'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSubjectById, getQuestionsBySubject } from '@/lib/data';
import type { Question, Subject } from '@/lib/types';
import QuestionDisplay from '@/components/exam/QuestionDisplay';
import ExamTimer from '@/components/exam/ExamTimer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_EXAM_DURATION_MINUTES = 30; // Default 30 minutes for N questions

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
  const [isSubmitting, setIsSubmitting] = useState(false); // For final submission
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false); // For immediate feedback

  useEffect(() => {
    if (subjectId) {
      const fetchedSubject = getSubjectById(subjectId);
      if (fetchedSubject) {
        setSubject(fetchedSubject);
        const fetchedQuestions = getQuestionsBySubject(subjectId);
        // For demo, let's take first 5 or all if less
        const practiceQuestions = fetchedQuestions.slice(0, Math.min(fetchedQuestions.length, 10));
        setQuestions(practiceQuestions);
        setUserAnswers(new Array(practiceQuestions.length).fill(null));
      }
      setIsLoading(false);
    }
  }, [subjectId]);

  const handleAnswerSelect = (selectedOption: string) => {
    if (isQuestionSubmitted) return; // Don't allow change after submitting this question's answer
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setUserAnswers(newAnswers);
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
    setIsQuestionSubmitted(true);
    // Optionally, show correct/incorrect right away or just enable Next
  };

  const handleNextQuestion = () => {
    if (!isQuestionSubmitted && userAnswers[currentQuestionIndex] !== null) {
      // If user clicks Next without explicitly submitting, consider it submitted.
      setIsQuestionSubmitted(true); 
      // Short delay to see feedback if any, then move.
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setIsQuestionSubmitted(false);
        } else {
          // This case should ideally be handled by "Finish Exam"
          finishExam();
        }
      }, 500);
       return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsQuestionSubmitted(false);
    } else {
      finishExam();
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setIsQuestionSubmitted(true); // When going back, keep it as submitted to review
    }
  };

  const finishExam = useCallback(() => {
    setIsSubmitting(true);
    let score = 0;
    userAnswers.forEach((answer, index) => {
      if (questions[index] && answer === questions[index].correctAnswer) {
        score++;
      }
    });

    const examResult = {
      subjectId: subject?.id,
      subjectName: subject?.name,
      questions,
      userAnswers,
      score,
      totalQuestions: questions.length,
      isAIPractice: false,
    };

    sessionStorage.setItem('examResult', JSON.stringify(examResult));
    router.push(`/practice/${subjectId}/summary`);
  }, [userAnswers, questions, subject, router, subjectId]);


  if (isLoading) return <LoadingSpinner text="Loading exam..." />;
  if (!subject || questions.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Could not load exam questions for this subject. Please try again or select another subject.</AlertDescription>
      </Alert>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="space-y-6 md:space-y-8 max-w-3xl mx-auto">
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{subject.name} Practice</h1>
        <p className="text-muted-foreground">Answer all questions to the best of your ability.</p>
      </header>

      <ExamTimer durationInMinutes={DEFAULT_EXAM_DURATION_MINUTES} onTimeUp={finishExam} />
      
      <Progress value={progress} className="w-full h-3" />

      <QuestionDisplay
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onAnswerSelect={handleAnswerSelect}
        userAnswer={userAnswers[currentQuestionIndex]}
        isSubmitted={isQuestionSubmitted}
      />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
        <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0 || isSubmitting}>
          <ArrowLeft size={18} className="mr-2" /> Previous
        </Button>
        
        {!isQuestionSubmitted && userAnswers[currentQuestionIndex] !== null && (
          <Button onClick={handleSubmitAnswer} disabled={isSubmitting || userAnswers[currentQuestionIndex] === null} className="bg-blue-500 hover:bg-blue-600 text-white">
            Submit Answer
          </Button>
        )}

        {isQuestionSubmitted && currentQuestionIndex < questions.length - 1 && (
          <Button onClick={handleNextQuestion} disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
            Next Question <ArrowRight size={18} className="ml-2" />
          </Button>
        )}
        
        {(isQuestionSubmitted || currentQuestionIndex === questions.length -1) && currentQuestionIndex === questions.length - 1 && (
          <Button onClick={finishExam} disabled={isSubmitting} className="bg-accent hover:bg-accent/90">
            {isSubmitting ? 'Submitting...' : 'Finish Exam'} <CheckSquare size={18} className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
