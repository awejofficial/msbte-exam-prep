import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpenCheck, Brain } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:opacity-90 transition-opacity">
          MSBTE Exam Prep
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
            <Link href="/subjects" className="flex items-center gap-2">
              <BookOpenCheck size={20} />
              <span className="hidden sm:inline">Subjects</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
            <Link href="/ai-practice" className="flex items-center gap-2">
              <Brain size={20} />
              <span className="hidden sm:inline">AI Practice</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
