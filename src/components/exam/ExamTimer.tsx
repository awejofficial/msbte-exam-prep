'use client';

import { useState, useEffect } from 'react';
import { TimerIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ExamTimerProps {
  durationInMinutes: number;
  onTimeUp: () => void;
  isPaused?: boolean;
  onTick?: (remainingTime: number) => void; // Optional callback for each tick
}

export default function ExamTimer({ durationInMinutes, onTimeUp, isPaused = false, onTick }: ExamTimerProps) {
  const [remainingTime, setRemainingTime] = useState(durationInMinutes * 60);

  useEffect(() => {
    if (isPaused || remainingTime <= 0) {
      if (remainingTime <= 0) onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setRemainingTime((prevTime) => {
        const newTime = prevTime - 1;
        if (onTick) onTick(newTime);
        if (newTime <= 0) {
          clearInterval(timerId);
          onTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [remainingTime, onTimeUp, isPaused, onTick]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Card className="shadow-md sticky top-4 z-10">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <TimerIcon className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-lg sm:text-xl font-semibold tabular-nums">
            {formatTime(remainingTime)}
          </span>
          <span className="text-sm text-muted-foreground hidden sm:inline">Remaining</span>
        </div>
      </CardContent>
    </Card>
  );
}
