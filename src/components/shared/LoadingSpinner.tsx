import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
  size?: number;
}

export default function LoadingSpinner({ text = "Loading...", size = 48 }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-12">
      <Loader2 className="animate-spin text-primary" size={size} />
      <p className="text-lg text-muted-foreground">{text}</p>
    </div>
  );
}
