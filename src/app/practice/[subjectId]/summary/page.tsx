'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { ExamResult, Question } from '@/lib/types';
import ExamSummary from '@/components/exam/ExamSummary';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function PracticeSummaryPage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = params.subjectId as string;
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resultString = sessionStorage.getItem('examResult');
    if (resultString) {
      try {
        const result = JSON.parse(resultString) as ExamResult;
        // Basic validation if the result is for the current subject summary page
        if (result.subjectId === subjectId) {
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
  }, [subjectId]);

  const handleRetakeExam = () => {
    router.push(`/practice/${subjectId}`);
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading exam summary..." />;
  }

  if (!examResult) {
    return (
       <div className="text-center space-y-6">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Summary</AlertTitle>
          <AlertDescription>
            Could not load exam summary. The data might be missing or corrupted.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/subjects" className="flex items-center gap-2">
            <ArrowLeft size={18}/> Back to Subjects
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Exam Summary: {examResult.subjectName || 'Practice Exam'}
        </h1>
        <p className="text-muted-foreground text-lg">
          Review your performance below.
        </p>
      </header>
      
      <ExamSummary {...examResult} />

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
        <Button onClick={handleRetakeExam} variant="outline" className="border-primary text-primary hover:bg-primary/10">
          <RefreshCw size={18} className="mr-2" /> Retake Exam
        </Button>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/subjects" className="flex items-center gap-2">
            <ArrowLeft size={18} className="mr-2" /> Back to Subjects
          </Link>
        </Button>
      </div>
    </div>
  );
}
