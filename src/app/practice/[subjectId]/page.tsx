
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getSubjectById, getQuestionsBySubject, getQuestionsForBatch } from '@/lib/data';
import type { Question, Subject } from '@/lib/types';
import QuestionDisplay from '@/components/exam/QuestionDisplay';
import ExamTimer from '@/components/exam/ExamTimer';
import QuestionNavigation from '@/components/exam/QuestionNavigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, CheckSquare, Bookmark, MenuSquare, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const DEFAULT_EXAM_DURATION_MINUTES_PER_QUESTION = 1.5; 

interface ExamBatchInfo {
  batchNumber: number;
  questionsInBatch: number;
  batchSize: number;
}

export default function PracticeExamPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const subjectId = params.subjectId as string;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false); 
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [examBatchInfo, setExamBatchInfo] = useState<ExamBatchInfo | null>(null);

  const [markedForReview, setMarkedForReview] = useState<boolean[]>([]);
  const [isCorrectList, setIsCorrectList] = useState<(boolean | null)[]>([]);

  useEffect(() => {
    if (subjectId) {
      const fetchedSubject = getSubjectById(subjectId);
      if (fetchedSubject) {
        setSubject(fetchedSubject);
        const batchParam = searchParams.get('batch');
        const sizeParam = searchParams.get('size');
        let fetchedQuestions: Question[];

        if (batchParam && sizeParam) {
          const batchNumber = parseInt(batchParam, 10);
          const batchSize = parseInt(sizeParam, 10);
          if (!isNaN(batchNumber) && !isNaN(batchSize) && batchNumber > 0 && batchSize > 0) {
            fetchedQuestions = getQuestionsForBatch(subjectId, batchNumber, batchSize);
            setExamBatchInfo({ batchNumber, questionsInBatch: fetchedQuestions.length, batchSize });
          } else {
            fetchedQuestions = getQuestionsBySubject(subjectId);
          }
        } else {
          fetchedQuestions = getQuestionsBySubject(subjectId);
        }
        
        setQuestions(fetchedQuestions);
        if (fetchedQuestions.length > 0) {
          setUserAnswers(new Array(fetchedQuestions.length).fill(null));
          setMarkedForReview(new Array(fetchedQuestions.length).fill(false));
          setIsCorrectList(new Array(fetchedQuestions.length).fill(null));
        }
      }
      setIsLoading(false);
    }
  }, [subjectId, searchParams]);

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
    setIsSheetOpen(false); 
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
      }, 300); 
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
      if (answer !== null && finalCorrectList[index] === null) { // Grade any unanswered but not submitted questions
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
      batchInfo: examBatchInfo ? `Batch ${examBatchInfo.batchNumber}` : undefined,
    };

    sessionStorage.setItem('examResult', JSON.stringify(examResult));
    // Construct summary URL, preserving batch info if present
    const summaryPath = `/practice/${subjectId}/summary`;
    const summaryParams = new URLSearchParams();
    if (examBatchInfo) {
        summaryParams.set('batch', examBatchInfo.batchNumber.toString());
        summaryParams.set('size', examBatchInfo.batchSize.toString());
    }
    router.push(`${summaryPath}${examBatchInfo ? `?${summaryParams.toString()}` : ''}`);

  }, [userAnswers, questions, subject, router, subjectId, isCorrectList, markedForReview, examBatchInfo]);


  if (isLoading || !subject) { // Removed questions.length === 0 check initially as it might be empty for an invalid batch
    if (isLoading) return <LoadingSpinner text="Loading exam..." />;
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Could not load subject data. Please try again or select another subject.</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/subjects')} className="mt-4">Back to Subjects</Button>
      </div>
    );
  }

  if (questions.length === 0 && !isLoading) { // Now check for empty questions after loading attempt
     return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Alert variant="destructive">
          <AlertTitle>No Questions</AlertTitle>
          <AlertDescription>
            No questions found for {subject.name}
            {examBatchInfo ? ` in Batch ${examBatchInfo.batchNumber}` : ''}. 
            This might be an invalid batch or the subject has no questions.
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/subjects')} className="mt-4">Back to Subjects</Button>
      </div>
    );
  }


  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const totalExamDuration = Math.ceil(questions.length * DEFAULT_EXAM_DURATION_MINUTES_PER_QUESTION);


  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 p-2 sm:p-4">
      <header className="text-center space-y-2">
        <div className="flex items-center justify-between">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <MenuSquare size={20} />
                <span className="sr-only">Open Question Navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-3/4 p-0 flex flex-col">
               <SheetHeader className="p-4 border-b flex-shrink-0">
                <SheetTitle>Questions</SheetTitle>
              </SheetHeader>
              <QuestionNavigation
                className="flex-1" 
                contentClassName="p-4" 
                totalQuestions={questions.length}
                currentQuestionIndex={currentQuestionIndex}
                userAnswers={userAnswers}
                isCorrectList={isCorrectList}
                markedForReview={markedForReview}
                onQuestionSelect={navigateToQuestion}
              />
            </SheetContent>
          </Sheet>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight flex-grow text-center px-2">
            {subject.name} Practice {examBatchInfo ? `(Batch ${examBatchInfo.batchNumber})` : ''}
          </h1>
           <div className="w-10 md:hidden"> {/* Placeholder for balance */}</div>
        </div>
        <p className="text-sm text-muted-foreground">Answer all questions to the best of your ability.</p>
        {examBatchInfo && (
             <div className="flex items-center justify-center text-xs text-muted-foreground bg-muted/50 py-1 px-3 rounded-full max-w-xs mx-auto">
                <Info size={14} className="mr-1.5" />
                Showing {examBatchInfo.questionsInBatch} questions from Batch {examBatchInfo.batchNumber}.
            </div>
        )}
      </header>
      
      <div className="md:hidden"> 
          <ExamTimer durationInMinutes={totalExamDuration} onTimeUp={finishExam} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
        <div className="hidden md:block md:w-56 lg:w-64 flex-shrink-0">
          <Card className="sticky top-4">
            <CardContent className="p-0 flex flex-col max-h-[calc(100vh-3rem)]">
               <div className="flex-shrink-0">
                 <ExamTimer durationInMinutes={totalExamDuration} onTimeUp={finishExam} />
                 <div className="p-2 border-b">
                   <h3 className="text-lg font-semibold px-2">Questions</h3>
                 </div>
               </div>
              <QuestionNavigation
                className="flex-grow" 
                contentClassName="p-3"
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

        <div className="flex-grow space-y-4 md:space-y-6 min-w-0">
          <Progress value={progress} className="w-full h-2.5" />

          <QuestionDisplay
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswerSelect={handleAnswerSelect}
            userAnswer={userAnswers[currentQuestionIndex]}
            isSubmitted={isQuestionSubmitted || isCorrectList[currentQuestionIndex] !== null}
            correctAnswer={currentQuestion.correctAnswer}
          />

          <Card className="p-3 sm:p-4 shadow-md">
            <div className="flex flex-wrap justify-between items-center gap-2 sm:gap-3">
              <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0 || isSubmitting}>
                <ArrowLeft size={18} className="mr-1 sm:mr-2" /> Previous
              </Button>
              
              <Button 
                variant="outline" 
                onClick={toggleMarkForReview} 
                className={cn(
                  'hover:bg-muted/50',
                  markedForReview[currentQuestionIndex] && 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 hover:text-blue-800'
                )}
              >
                <Bookmark size={18} className={cn("mr-1 sm:mr-2", markedForReview[currentQuestionIndex] && 'fill-blue-500 text-blue-500')} />
                {markedForReview[currentQuestionIndex] ? 'Unmark' : 'Mark'}
              </Button>

              {userAnswers[currentQuestionIndex] !== null && !isQuestionSubmitted && isCorrectList[currentQuestionIndex] === null && (
                <Button onClick={handleSubmitAnswer} disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                  Submit Answer
                </Button>
              )}

              {currentQuestionIndex < questions.length - 1 && (isQuestionSubmitted || userAnswers[currentQuestionIndex] !== null || isCorrectList[currentQuestionIndex] !== null) && (
                 <Button onClick={handleNextQuestion} disabled={isSubmitting} className={cn((isQuestionSubmitted || isCorrectList[currentQuestionIndex] !==null ) ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground')}>
                  Next <ArrowRight size={18} className="ml-1 sm:ml-2" />
                </Button>
              )}
              
              {currentQuestionIndex < questions.length - 1 && userAnswers[currentQuestionIndex] === null && !isQuestionSubmitted && isCorrectList[currentQuestionIndex] === null &&(
                  <Button onClick={handleNextQuestion} variant="outline" disabled={isSubmitting} className="hover:bg-muted/50">
                      Skip <ArrowRight size={18} className="ml-1 sm:ml-2" />
                  </Button>
              )}

              {currentQuestionIndex === questions.length - 1 && (isQuestionSubmitted || userAnswers[currentQuestionIndex] !== null || isCorrectList[currentQuestionIndex] !== null) &&(
                <Button onClick={finishExam} disabled={isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isSubmitting ? 'Submitting...' : 'Finish Exam'} <CheckSquare size={18} className="ml-1 sm:ml-2" />
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

    