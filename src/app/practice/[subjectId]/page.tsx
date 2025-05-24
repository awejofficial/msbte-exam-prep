
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSubjectById, getQuestionsBySubject } from '@/lib/data';
import type { Question, Subject } from '@/lib/types';
import QuestionDisplay from '@/components/exam/QuestionDisplay';
import ExamTimer from '@/components/exam/ExamTimer';
import QuestionNavigation from '@/components/exam/QuestionNavigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, CheckSquare, Bookmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

const DEFAULT_EXAM_DURATION_MINUTES = 30; // Default 30 minutes

export default function PracticeExamPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const subjectId = params.subjectId as string;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // For final exam submission
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false); // For immediate feedback on current question

  // New states for sidebar and review functionality
  const [markedForReview, setMarkedForReview] = useState<boolean[]>([]);
  const [isCorrectList, setIsCorrectList] = useState<(boolean | null)[]>([]); // null: not submitted, true: correct, false: incorrect

  useEffect(() => {
    if (subjectId) {
      const fetchedSubject = getSubjectById(subjectId);
      if (fetchedSubject) {
        setSubject(fetchedSubject);
        const fetchedQuestions = getQuestionsBySubject(subjectId);
        // Use all questions for the subject
        setQuestions(fetchedQuestions);
        setUserAnswers(new Array(fetchedQuestions.length).fill(null));
        setMarkedForReview(new Array(fetchedQuestions.length).fill(false));
        setIsCorrectList(new Array(fetchedQuestions.length).fill(null));
      }
      setIsLoading(false);
    }
  }, [subjectId]);

  const handleAnswerSelect = (selectedOption: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setUserAnswers(newAnswers);

    // If answer changes for an already judged question, reset its judged status for QuestionDisplay
    if (isCorrectList[currentQuestionIndex] !== null) {
      const newIsCorrect = [...isCorrectList];
      newIsCorrect[currentQuestionIndex] = null;
      setIsCorrectList(newIsCorrect);
    }
    // Current question's immediate feedback status should be reset until "Submit Answer" is pressed
    setIsQuestionSubmitted(false);
  };

  const handleSubmitAnswer = () => {
    if (userAnswers[currentQuestionIndex] === null) {
      toast({
        title: "No Answer Selected",
        description: "Please select an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const newIsCorrect = [...isCorrectList];
    newIsCorrect[currentQuestionIndex] = userAnswers[currentQuestionIndex] === questions[currentQuestionIndex].correctAnswer;
    setIsCorrectList(newIsCorrect);
    setIsQuestionSubmitted(true); // Show feedback on QuestionDisplay

    // Optionally, unmark for review when an answer is submitted
    if (markedForReview[currentQuestionIndex]) {
      const newMarked = [...markedForReview];
      newMarked[currentQuestionIndex] = false;
      setMarkedForReview(newMarked);
    }
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    // Set isQuestionSubmitted based on whether the target question has feedback available
    setIsQuestionSubmitted(isCorrectList[index] !== null);
  };

  const handleNextQuestion = () => {
    // If an answer is selected but not yet submitted, submit it before moving next
    if (userAnswers[currentQuestionIndex] !== null && !isQuestionSubmitted && isCorrectList[currentQuestionIndex] === null) {
      handleSubmitAnswer(); // Submit current answer
      // Add a slight delay to allow user to see feedback if desired, then navigate
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          navigateToQuestion(currentQuestionIndex + 1);
        } else {
          finishExam();
        }
      }, 500); // Delay for feedback visibility
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    } else {
      finishExam();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex - 1);
    }
  };

  const toggleMarkForReview = () => {
    const newMarked = [...markedForReview];
    newMarked[currentQuestionIndex] = !newMarked[currentQuestionIndex];
    setMarkedForReview(newMarked);
    toast({
      title: newMarked[currentQuestionIndex] ? "Marked for Review" : "Unmarked for Review",
      description: `Question ${currentQuestionIndex + 1} has been ${newMarked[currentQuestionIndex] ? 'marked' : 'unmarked'}.`,
      duration: 2000,
    });
  };

  const finishExam = useCallback(() => {
    setIsSubmitting(true);
    let score = 0;
    const finalCorrectList = [...isCorrectList];

    userAnswers.forEach((answer, index) => {
      // If a question wasn't explicitly submitted for feedback but has an answer, score it now.
      if (answer !== null && finalCorrectList[index] === null) {
         finalCorrectList[index] = answer === questions[index].correctAnswer;
      }
      if (finalCorrectList[index] === true) {
        score++;
      }
    });
    
    // Persist the final correctness for summary
    setIsCorrectList(finalCorrectList); 

    const examResult = {
      subjectId: subject?.id,
      subjectName: subject?.name,
      questions,
      userAnswers,
      score,
      totalQuestions: questions.length,
      isAIPractice: false,
      // We could also pass isCorrectList and markedForReview if summary page needs them
    };

    sessionStorage.setItem('examResult', JSON.stringify(examResult));
    router.push(`/practice/${subjectId}/summary`);
  }, [userAnswers, questions, subject, router, subjectId, isCorrectList]);


  if (isLoading) return <LoadingSpinner text="Loading exam..." />;
  if (!subject || questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Could not load exam questions for this subject. Please try again or select another subject.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
      <QuestionNavigation
        totalQuestions={questions.length}
        currentQuestionIndex={currentQuestionIndex}
        userAnswers={userAnswers}
        isCorrectList={isCorrectList}
        markedForReview={markedForReview}
        onQuestionSelect={navigateToQuestion}
        className="w-full md:w-64 lg:w-72 flex-shrink-0"
      />

      <div className="flex-grow space-y-6 md:space-y-8 min-w-0"> {/* min-w-0 for flex item squishing */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{subject.name} Practice</h1>
          <p className="text-muted-foreground">Answer all questions to the best of your ability.</p>
        </header>

        <ExamTimer durationInMinutes={DEFAULT_EXAM_DURATION_MINUTES * questions.length / 10} onTimeUp={finishExam} />
        
        <Progress value={progress} className="w-full h-3" />

        <QuestionDisplay
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onAnswerSelect={handleAnswerSelect}
          userAnswer={userAnswers[currentQuestionIndex]}
          isSubmitted={isQuestionSubmitted} // This now reflects if current question's feedback is shown
          // isCorrect={isCorrectList[currentQuestionIndex]} // Pass this if QuestionDisplay needs to know actual correctness beyond submission
        />

        <Card className="p-4">
          <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-3">
            <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0 || isSubmitting}>
              <ArrowLeft size={18} className="mr-2" /> Previous
            </Button>
            
            <Button variant="outline" onClick={toggleMarkForReview} className={markedForReview[currentQuestionIndex] ? 'bg-blue-100 text-blue-700 border-blue-300' : ''}>
              <Bookmark size={18} className={`mr-2 ${markedForReview[currentQuestionIndex] ? 'fill-blue-500' : ''}`} />
              {markedForReview[currentQuestionIndex] ? 'Unmark Review' : 'Mark for Review'}
            </Button>

            {!isQuestionSubmitted && userAnswers[currentQuestionIndex] !== null && (
              <Button onClick={handleSubmitAnswer} disabled={isSubmitting || userAnswers[currentQuestionIndex] === null} className="bg-primary hover:bg-primary/90">
                Submit Answer
              </Button>
            )}

            {isQuestionSubmitted && currentQuestionIndex < questions.length - 1 && (
              <Button onClick={handleNextQuestion} disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                Next Question <ArrowRight size={18} className="ml-2" />
              </Button>
            )}
            
            {(isQuestionSubmitted || userAnswers[currentQuestionIndex] !== null || currentQuestionIndex === questions.length -1) && currentQuestionIndex === questions.length - 1 && (
              <Button onClick={finishExam} disabled={isSubmitting} className="bg-accent hover:bg-accent/90">
                {isSubmitting ? 'Submitting...' : 'Finish Exam'} <CheckSquare size={18} className="ml-2" />
              </Button>
            )}
             {currentQuestionIndex < questions.length - 1 && userAnswers[currentQuestionIndex] === null && !isQuestionSubmitted && (
                <Button onClick={handleNextQuestion} variant="outline" disabled={isSubmitting}>
                    Skip Question <ArrowRight size={18} className="ml-2" />
                </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
