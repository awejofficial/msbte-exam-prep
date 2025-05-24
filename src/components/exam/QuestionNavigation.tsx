
'use client';

import type { ComponentProps } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface QuestionNavigationProps extends ComponentProps<'div'> {
  totalQuestions: number;
  currentQuestionIndex: number;
  userAnswers: (string | null)[];
  isCorrectList: (boolean | null)[];
  markedForReview: boolean[];
  onQuestionSelect: (index: number) => void;
}

export default function QuestionNavigation({
  totalQuestions,
  currentQuestionIndex,
  userAnswers,
  isCorrectList,
  markedForReview,
  onQuestionSelect,
  className,
  ...props
}: QuestionNavigationProps) {
  
  const getButtonStyles = (index: number): { variant: ButtonProps['variant'], className?: string } => {
    let variant: ButtonProps['variant'] = 'outline';
    let customClassName = "w-full justify-start text-xs sm:text-sm px-2 py-1.5 h-auto leading-tight";

    if (markedForReview[index]) {
      return { variant: 'default', className: `${customClassName} bg-blue-500 hover:bg-blue-600 text-white border-blue-600` };
    }
    if (isCorrectList[index] === true) {
      return { variant: 'default', className: `${customClassName} bg-green-500 hover:bg-green-600 text-white border-green-600` };
    }
    if (isCorrectList[index] === false) {
      return { variant: 'default', className: `${customClassName} bg-red-500 hover:bg-red-600 text-white border-red-600` };
    }
    if (userAnswers[index] !== null) {
      // Answered but not yet graded or status unknown
      variant = 'secondary';
      customClassName = `${customClassName} bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200`;
    }
    
    // Highlight current question if no other specific status applies, or add additive styling
    if (index === currentQuestionIndex) {
        if (variant === 'outline' && !markedForReview[index] && isCorrectList[index] === null && userAnswers[index] === null) {
             return { variant: 'default', className: `${customClassName}` }; // Primary for current & unanswered
        } else if (variant === 'secondary' && !markedForReview[index] && isCorrectList[index] === null) {
             return { variant: 'default', className: `${customClassName} bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-yellow-500 ring-2 ring-primary`}; // Distinct for current & answered-not-graded
        }
         // For review/correct/incorrect, current status can be an additional ring
        customClassName = `${customClassName} ring-2 ring-offset-1 ring-primary-foreground`;
    }


    return { variant, className: customClassName };
  };

  return (
    <Card className={cn("sticky top-4 h-fit max-h-[calc(100vh-5rem)]", className)} {...props}>
      <CardHeader className="p-3 sm:p-4">
        <CardTitle className="text-lg sm:text-xl">Questions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-15rem)] sm:h-[calc(100vh-16rem)] md:max-h-[70vh]">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-4 gap-1.5 p-2 sm:p-3">
            {Array.from({ length: totalQuestions }).map((_, index) => {
              const { variant, className: buttonClassName } = getButtonStyles(index);
              return (
                <Button
                  key={index}
                  variant={variant}
                  className={buttonClassName}
                  onClick={() => onQuestionSelect(index)}
                  size="sm" 
                >
                  {index + 1}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
