'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonalizedPracticeForm from '@/components/forms/PersonalizedPracticeForm';
import { generatePersonalizedExamAction } from '@/lib/actions';
import type { PastPerformance } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function AIPracticePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: {
    subject: string;
    pastPerformance: PastPerformance;
    examLength: number;
  }) => {
    setIsSubmitting(true);
    setError(null);

    const result = await generatePersonalizedExamAction(data);

    if ('error' in result) {
      setError(result.error);
      toast({
        title: 'Error Generating Exam',
        description: result.error,
        variant: 'destructive',
      });
      setIsSubmitting(false);
    } else if (result.questions && result.questions.length > 0) {
      // Store generated questions in session storage to pass to the exam page
      sessionStorage.setItem('aiGeneratedExam', JSON.stringify({
        questions: result.questions,
        subjectName: data.subject, // Pass subject name for context
      }));
      toast({
        title: 'Exam Generated!',
        description: `Your personalized exam for ${data.subject} is ready.`,
      });
      router.push('/ai-practice/exam');
    } else {
       setError('AI generated an empty exam. Please try different parameters.');
       toast({
        title: 'Empty Exam Generated',
        description: 'The AI returned no questions. Please try again with different options.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <PersonalizedPracticeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      {error && (
        <Alert variant="destructive" className="mt-6">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Generation Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
       <Alert className="mt-8">
        <Terminal className="h-4 w-4" />
        <AlertTitle>AI Generation Note</AlertTitle>
        <AlertDescription>
          AI-generated questions are for practice and may not perfectly reflect actual MSBTE exam content or difficulty. Always cross-reference with official materials.
          The AI may take a moment to generate your exam.
        </AlertDescription>
      </Alert>
    </div>
  );
}
