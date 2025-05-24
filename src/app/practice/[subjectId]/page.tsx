
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
import { ArrowLeft, ArrowRight, CheckSquare, Bookmark, MenuSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [markedForReview, setMarkedForReview] = useState<boolean[]>([]);
  const [isCorrectList, setIsCorrectList] = useState<(boolean | null)[]>([]);

  useEffect(() => {
    if (subjectId) {
      const fetchedSubject = getSubjectById(subjectId);
      if (fetchedSubject) {
        setSubject(fetchedSubject);
        const fetchedQuestions = getQuestionsBySubject(subjectId);
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

    if (isCorrectList[currentQuestionIndex] !== null) {
      const newIsCorrect = [...isCorrectList];
      newIsCorrect[currentQuestionIndex] = null;
      setIsCorrectList(newIsCorrect);
    }
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
    setIsQuestionSubmitted(true); 

    if (markedForReview[currentQuestionIndex]) {
      const newMarked = [...markedForReview];
      newMarked[currentQuestionIndex] = false;
      setMarkedForReview(newMarked);
    }
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setIsQuestionSubmitted(isCorrectList[index] !== null);
    setIsSheetOpen(false); // Close sheet after navigation
  };

  const handleNextQuestion = () => {
    if (userAnswers[currentQuestionIndex] !== null && !isQuestionSubmitted && isCorrectList[currentQuestionIndex] === null) {
      handleSubmitAnswer(); 
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          navigateToQuestion(currentQuestionIndex + 1);
        } else {
          finishExam();
        }
      }, 500); 
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
      if (answer !== null && finalCorrectList[index] === null) {
         finalCorrectList[index] = answer === questions[index].correctAnswer;
      }
      if (finalCorrectList[index] === true) {
        score++;
      }
    });
    
    setIsCorrectList(finalCorrectList); 

    const examResult = {
      subjectId: subject?.id,
      subjectName: subject?.name,
      questions,
      userAnswers,
      score,
      totalQuestions: questions.length,
      isAIPractice: false,
      isCorrectList: finalCorrectList,
      markedForReview: markedForReview,
    };

    sessionStorage.setItem('examResult', JSON.stringify(examResult));
    router.push(`/practice/${subjectId}/summary`);
  }, [userAnswers, questions, subject, router, subjectId, isCorrectList, markedForReview]);


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
  const examDurationPerQuestion = 1.5; // minutes
  const totalExamDuration = Math.ceil(questions.length * examDurationPerQuestion);


  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 p-4">
      <header className="text-center space-y-2">
        <div className="flex items-center justify-between">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <MenuSquare size={20} />
                <span className="sr-only">Open Question Navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-3/4 p-0">
               <SheetHeader className="p-4 border-b">
                <SheetTitle>Questions</SheetTitle>
              </SheetHeader>
              <QuestionNavigation
                totalQuestions={questions.length}
                currentQuestionIndex={currentQuestionIndex}
                userAnswers={userAnswers}
                isCorrectList={isCorrectList}
                markedForReview={markedForReview}
                onQuestionSelect={navigateToQuestion}
              />
            </SheetContent>
          </Sheet>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight flex-grow text-center">{subject.name} Practice</h1>
           <div className="w-10 md:hidden"> {/* Placeholder for balance if needed */}</div>
        </div>
        <p className="text-muted-foreground">Answer all questions to the best of your ability.</p>
      </header>
      
      <div className="md:hidden"> {/* Timer for mobile, outside of fixed elements that might overlap */}
          <ExamTimer durationInMinutes={totalExamDuration} onTimeUp={finishExam} />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
         {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 lg:w-72 flex-shrink-0">
          <Card className="sticky top-4">
            <CardContent className="p-0">
               <ExamTimer durationInMinutes={totalExamDuration} onTimeUp={finishExam} />
               <div className="p-2 border-b">
                 <h3 className="text-lg font-semibold px-2">Questions</h3>
               </div>
              <QuestionNavigation
                totalQuestions={questions.length}
                currentQuestionIndex={currentQuestionIndex}
                userAnswers={userAnswers}
                isCorrectList={isCorrectList}
                markedForReview={markedForReview}
                onQuestionSelect={navigateToQuestion}
              />
            </CardContent>
          </Card>
        </div>

        {/* Main exam content */}
        <div className="flex-grow space-y-6 min-w-0">
          <Progress value={progress} className="w-full h-3" />

          <QuestionDisplay
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswerSelect={handleAnswerSelect}
            userAnswer={userAnswers[currentQuestionIndex]}
            isSubmitted={isQuestionSubmitted}
          />

          <Card className="p-4 shadow-md">
            <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-3">
              <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0 || isSubmitting}>
                <ArrowLeft size={18} className="mr-2" /> Previous
              </Button>
              
              <Button variant="outline" onClick={toggleMarkForReview} className={markedForReview[currentQuestionIndex] ? 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 hover:text-blue-800' : 'hover:bg-muted/50'}>
                <Bookmark size={18} className={`mr-2 ${markedForReview[currentQuestionIndex] ? 'fill-blue-500 text-blue-500' : ''}`} />
                {markedForReview[currentQuestionIndex] ? 'Unmark' : 'Mark Review'}
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
                <Button onClick={finishExam} disabled={isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isSubmitting ? 'Submitting...' : 'Finish Exam'} <CheckSquare size={18} className="ml-2" />
                </Button>
              )}
              {currentQuestionIndex < questions.length - 1 && userAnswers[currentQuestionIndex] === null && !isQuestionSubmitted && (
                  <Button onClick={handleNextQuestion} variant="outline" disabled={isSubmitting} className="hover:bg-muted/50">
                      Skip Question <ArrowRight size={18} className="ml-2" />
                  </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

