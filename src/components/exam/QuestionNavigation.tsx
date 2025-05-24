
'use client';

import type { ButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area'; 
import { cn } from '@/lib/utils';

interface QuestionNavigationProps {
  className?: string; 
  contentClassName?: string; 
  totalQuestions: number;
  currentQuestionIndex: number;
  userAnswers: (string | null)[];
  isCorrectList: (boolean | null)[];
  markedForReview: boolean[];
  onQuestionSelect: (index: number) => void;
}

export default function QuestionNavigation({
  className,
  contentClassName,
  totalQuestions,
  currentQuestionIndex,
  userAnswers,
  isCorrectList,
  markedForReview,
  onQuestionSelect,
}: QuestionNavigationProps) {
  
  const getButtonStyles = (index: number): { variant: ButtonProps['variant'], className?: string } => {
    let variant: ButtonProps['variant'] = 'outline';
    let customClassName = "w-full justify-center text-xs sm:text-sm px-2 py-1.5 h-auto leading-tight aspect-square flex items-center justify-center";

    const isCurrent = index === currentQuestionIndex;
    const isMarked = markedForReview[index];
    const isAnsweredCorrectly = isCorrectList[index] === true;
    const isAnsweredIncorrectly = isCorrectList[index] === false;
    const isAnswered = userAnswers[index] !== null;
    const isGraded = isCorrectList[index] !== null;

    if (isMarked) {
      variant = 'default'; 
      customClassName = cn(customClassName, `bg-blue-500 hover:bg-blue-600 text-white border-blue-600`);
    } else if (isAnsweredCorrectly) {
      variant = 'default';
      customClassName = cn(customClassName, `bg-green-500 hover:bg-green-600 text-white border-green-600`);
    } else if (isAnsweredIncorrectly) {
      variant = 'default';
      customClassName = cn(customClassName, `bg-red-500 hover:bg-red-600 text-white border-red-600`);
    } else if (isAnswered && !isGraded) { 
      variant = 'secondary'; 
      customClassName = cn(customClassName, `bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200`);
    } else {
      variant = 'outline';
    }
    
    if (isCurrent) {
      if (isMarked) {
        customClassName = cn(customClassName, `ring-2 ring-offset-2 ring-blue-300`);
      } else if (isAnsweredCorrectly) {
        customClassName = cn(customClassName, `ring-2 ring-offset-2 ring-green-300`);
      } else if (isAnsweredIncorrectly) {
        customClassName = cn(customClassName, `ring-2 ring-offset-2 ring-red-300`);
      } else if (isAnswered && !isGraded) {
        customClassName = cn(customClassName, `ring-2 ring-offset-2 ring-yellow-400`);
      } else { 
        variant = 'default'; 
        customClassName = cn(customClassName, `bg-primary hover:bg-primary/90 text-primary-foreground ring-2 ring-offset-2 ring-primary-foreground/70`);
      }
    }

    return { variant, className: customClassName };
  };

  return (
    <div className={cn("flex flex-col", className)}> {/* Make the root a flex column */}
      <ScrollArea className="flex-1 w-full min-h-0"> {/* ScrollArea will take available space and can shrink. min-h-0 is key. */}
        <div className={cn("grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 gap-1.5", contentClassName)}>
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
