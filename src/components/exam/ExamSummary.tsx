'use client';

import type { ExamResult, Question } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, XCircle, HelpCircle, Percent } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ExamSummary({
  questions,
  userAnswers,
  score,
  totalQuestions,
  subjectName,
  isAIPractice
}: ExamResult) {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getQuestionStatusIcon = (question: Question | { text: string, options: string[], correctAnswer: string }, userAnswer: string | null) => {
    if (userAnswer === null) return <HelpCircle className="text-yellow-500" />;
    if (userAnswer === question.correctAnswer) return <CheckCircle className="text-green-500" />;
    return <XCircle className="text-red-500" />;
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl">
          {isAIPractice ? 'AI Practice' : subjectName} Results
        </CardTitle>
        <CardDescription className="text-lg">
          You scored {score} out of {totalQuestions}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-2 text-4xl font-bold text-primary">
                <Percent size={36} />
                <span>{percentage}%</span>
            </div>
            <Progress value={percentage} className="w-full h-3" />
            <p className="text-sm text-muted-foreground">{score} Correct / {totalQuestions - score} Incorrect</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {questions.map((q, index) => {
            const question = q as Question; // Assuming Question type for simplicity, AI structure might differ
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            return (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className={`flex justify-between items-center hover:no-underline ${isCorrect && userAnswer !== null ? 'text-green-600' : userAnswer !== null ? 'text-red-600' : 'text-foreground'}`}>
                  <div className="flex items-center gap-2 text-left">
                    {getQuestionStatusIcon(question, userAnswer)}
                    <span className="font-medium">Question {index + 1}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pl-8 pr-2 pt-2">
                  <p className="font-semibold text-md">{question.text}</p>
                  <ul className="space-y-1 text-sm">
                    {question.options.map((option, optIndex) => (
                      <li
                        key={optIndex}
                        className={`
                          ${option === question.correctAnswer ? 'text-green-700 font-medium' : ''}
                          ${option === userAnswer && option !== question.correctAnswer ? 'text-red-700 line-through' : ''}
                        `}
                      >
                        {option}
                        {option === question.correctAnswer && <span className="ml-2">(Correct)</span>}
                        {option === userAnswer && option !== question.correctAnswer && <span className="ml-2">(Your Answer)</span>}
                      </li>
                    ))}
                  </ul>
                  {userAnswer === null && <p className="text-yellow-600 font-medium">You did not answer this question.</p>}
                  {question.explanation && (
                    <div className="pt-2 border-t mt-2">
                      <h5 className="font-semibold text-xs text-muted-foreground">Explanation:</h5>
                      <p className="text-xs">{question.explanation}</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
