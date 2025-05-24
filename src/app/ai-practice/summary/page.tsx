'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ExamResult } from '@/lib/types';
import ExamSummary from '@/components/exam/ExamSummary';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function AIPracticeSummaryPage() {
  const router = useRouter();
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resultString = sessionStorage.getItem('examResult');
    if (resultString) {
      try {
        const result = JSON.parse(resultString) as ExamResult;
        // Check if it's an AI practice summary
        if (result.isAIPractice) {
          setExamResult(result);
        } else {
          // If not, perhaps redirect or show error. For now, clear and show error.
          sessionStorage.removeItem('examResult');
          setExamResult(null);
        }
      } catch (error) {
        console.error("Failed to parse exam result from session storage", error);
        setExamResult(null);
      }
    }
    setIsLoading(false);
    // Clean up session storage after displaying the summary
    // sessionStorage.removeItem('examResult'); // Or do this when user navigates away
  }, []);

  const handleTryAnotherAIExam = () => {
    router.push('/ai-practice');
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading AI exam summary..." />;
  }

  if (!examResult) {
    return (
      <div className="text-center space-y-6">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Summary</AlertTitle>
          <AlertDescription>
            Could not load AI exam summary. The data might be missing or corrupted.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/ai-practice" className="flex items-center gap-2">
            <ArrowLeft size={18}/> Back to AI Practice Setup
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          AI Exam Summary: {examResult.subjectName || 'Personalized Practice'}
        </h1>
        <p className="text-muted-foreground text-lg">
          Review your performance on the AI-generated exam.
        </p>
      </header>
      
      <ExamSummary {...examResult} />

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
        <Button onClick={handleTryAnotherAIExam} variant="outline" className="border-primary text-primary hover:bg-primary/10">
          <RefreshCw size={18} className="mr-2" /> Generate New AI Exam
        </Button>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft size={18} className="mr-2" /> Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
