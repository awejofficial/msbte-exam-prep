
import Link from 'next/link';
import Image from 'next/image';
import { subjects, getQuestionsBySubject, DEFAULT_BATCH_SIZE } from '@/lib/data';
import type { Subject } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Layers } from 'lucide-react';

export default function SubjectsPage() {
  return (
    <div className="space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Browse Subjects</h1>
        <p className="text-muted-foreground text-lg">
          Choose a subject and a batch to start your practice session.
        </p>
      </header>
      
      {subjects.length === 0 ? (
        <p className="text-center text-muted-foreground">No subjects available at the moment. Please check back later.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <SubjectListItem key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
}

interface SubjectListItemProps {
  subject: Subject;
}

function SubjectListItem({ subject }: SubjectListItemProps) {
  const aiHint = subject.name.toLowerCase().split(' ').slice(0, 2).join(' ') + ' textbook';
  const subjectQuestions = getQuestionsBySubject(subject.id);
  const totalSubjectQuestions = subjectQuestions.length;

  const batchButtons = [];
  if (totalSubjectQuestions <= DEFAULT_BATCH_SIZE && totalSubjectQuestions > 0) {
    batchButtons.push(
      <Button asChild key="all" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors">
        <Link href={`/practice/${subject.id}`} className="flex items-center justify-center gap-2">
          Start Practice (All {totalSubjectQuestions} Qs) <ArrowRight size={18} />
        </Link>
      </Button>
    );
  } else if (totalSubjectQuestions > 0) {
    const numBatches = Math.ceil(totalSubjectQuestions / DEFAULT_BATCH_SIZE);
    for (let i = 0; i < numBatches; i++) {
      const batchNumber = i + 1;
      const startNum = i * DEFAULT_BATCH_SIZE + 1;
      const endNum = Math.min((i + 1) * DEFAULT_BATCH_SIZE, totalSubjectQuestions);
      batchButtons.push(
        <Button asChild key={`batch-${batchNumber}`} variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
          <Link href={`/practice/${subject.id}?batch=${batchNumber}&size=${DEFAULT_BATCH_SIZE}`} className="flex items-center justify-center gap-2">
            <Layers size={16} className="mr-1"/> Batch {batchNumber} (Q {startNum}-{endNum}) <ArrowRight size={18} />
          </Link>
        </Button>
      );
    }
  }


  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
      {subject.image && (
        <div className="relative h-48 w-full">
          <Image 
            src={subject.image} 
            alt={subject.name} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            data-ai-hint={aiHint}
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{subject.name}</CardTitle>
        <CardDescription className="h-12 overflow-hidden text-ellipsis">{subject.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">Total Questions: {totalSubjectQuestions}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {batchButtons.length > 0 ? batchButtons : <p className="text-sm text-muted-foreground">No questions available for this subject yet.</p>}
      </CardFooter>
    </Card>
  );
}

    