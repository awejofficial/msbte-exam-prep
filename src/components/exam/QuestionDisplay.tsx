'use client';

import type { Question } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionDisplayProps {
  question: Question | { text: string, options: string[], correctAnswer: string, explanation?: string }; // AI questions might be simpler
  questionNumber: number;
  totalQuestions: number;
  onAnswerSelect: (selectedOption: string) => void;
  userAnswer: string | null;
  isSubmitted: boolean; // Indicates if the answer for this question is final (e.g., user moved to next or exam ended)
}

export default function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSelect,
  userAnswer,
  isSubmitted,
}: QuestionDisplayProps) {
  
  const getOptionClasses = (option: string) => {
    if (!isSubmitted) {
      return 'hover:bg-muted/50';
    }
    if (option === question.correctAnswer) {
      return 'bg-green-100 border-green-500 text-green-700';
    }
    if (option === userAnswer && option !== question.correctAnswer) {
      return 'bg-red-100 border-red-500 text-red-700';
    }
    return 'text-muted-foreground';
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl md:text-2xl">Question {questionNumber}/{totalQuestions}</CardTitle>
        </div>
        <CardDescription className="text-lg pt-2">{question.text}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={userAnswer ?? undefined}
          onValueChange={onAnswerSelect}
          disabled={isSubmitted}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <Label
              key={index}
              htmlFor={`option-${index}`}
              className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${getOptionClasses(option)} ${userAnswer === option ? 'ring-2 ring-primary' : ''}`}
            >
              <RadioGroupItem value={option} id={`option-${index}`} disabled={isSubmitted} />
              <span>{option}</span>
              {isSubmitted && option === question.correctAnswer && <CheckCircle className="ml-auto text-green-500" />}
              {isSubmitted && option === userAnswer && option !== question.correctAnswer && <XCircle className="ml-auto text-red-500" />}
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      {isSubmitted && question.explanation && (
        <CardFooter className="flex-col items-start gap-2 pt-4 border-t">
          <h4 className="font-semibold">Explanation:</h4>
          <p className="text-sm text-muted-foreground">{question.explanation}</p>
        </CardFooter>
      )}
    </Card>
  );
}
