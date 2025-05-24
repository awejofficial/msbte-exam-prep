
'use client';

import type { ComponentProps } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface QuestionNavigationProps extends Omit<ComponentProps<'div'>, 'className'> {
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
  ...props
}: QuestionNavigationProps) {
  
  const getButtonStyles = (index: number): { variant: ButtonProps['variant'], className?: string } => {
    let variant: ButtonProps['variant'] = 'outline';
    let customClassName = "w-full justify-center text-xs sm:text-sm px-2 py-1.5 h-auto leading-tight aspect-square flex items-center justify-center";

    if (index === currentQuestionIndex) {
      // Base for current question: primary, unless overridden by specific status
      variant = 'default';
    }

    if (markedForReview[index]) {
      // Strongest override: blue for marked
      return { variant: 'default', className: `${customClassName} bg-blue-500 hover:bg-blue-600 text-white border-blue-600 ${index === currentQuestionIndex ? 'ring-2 ring-offset-1 ring-blue-300' : ''}` };
    }
    if (isCorrectList[index] === true) {
      // Green for correct
      return { variant: 'default', className: `${customClassName} bg-green-500 hover:bg-green-600 text-white border-green-600 ${index === currentQuestionIndex ? 'ring-2 ring-offset-1 ring-green-300' : ''}` };
    }
    if (isCorrectList[index] === false) {
      // Red for incorrect
      return { variant: 'default', className: `${customClassName} bg-red-500 hover:bg-red-600 text-white border-red-600 ${index === currentQuestionIndex ? 'ring-2 ring-offset-1 ring-red-300' : ''}` };
    }
    if (userAnswers[index] !== null) {
      // Answered but not yet graded or status unknown (e.g. not explicitly submitted for feedback)
      // If current, use primary; otherwise secondary
      variant = index === currentQuestionIndex ? 'default' : 'secondary';
      customClassName = `${customClassName} ${index === currentQuestionIndex ? 'bg-primary hover:bg-primary/90' : 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200'} ${index === currentQuestionIndex ? 'ring-2 ring-offset-1 ring-primary-foreground' : ''}`;
    }
    
    // For purely current and unanswered
    if (index === currentQuestionIndex && variant === 'default' && userAnswers[index] === null && isCorrectList[index] === null && !markedForReview[index]) {
        customClassName = `${customClassName} bg-primary hover:bg-primary/90 ring-2 ring-offset-1 ring-primary-foreground`;
    } else if (index === currentQuestionIndex && variant === 'outline') { // Ensure current but un-styled gets default
        variant = 'default';
        customClassName = `${customClassName} bg-primary hover:bg-primary/90 ring-2 ring-offset-1 ring-primary-foreground`;
    }


    return { variant, className: customClassName };
  };

  return (
    <div {...props}>
      <ScrollArea className="h-full max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-12rem)]"> {/* Adjusted max-h for sheet */}
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 p-3">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const { variant, className: buttonClassName } = getButtonStyles(index);
            return (
              <Button
                key={index}
                variant={variant}
                className={cn(buttonClassName)}
                onClick={() => onQuestionSelect(index)}
                size="sm" 
              >
                {index + 1}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

