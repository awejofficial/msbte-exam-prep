import Link from 'next/link';
import Image from 'next/image';
import { subjects } from '@/lib/data';
import type { Subject } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function SubjectsPage() {
  return (
    <div className="space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Browse Subjects</h1>
        <p className="text-muted-foreground text-lg">
          Choose a subject to start your practice session.
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
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
      {subject.image && (
        <div className="relative h-48 w-full">
          <Image 
            src={subject.image} 
            alt={subject.name} 
            layout="fill" 
            objectFit="cover" 
            data-ai-hint={`${subject.name.toLowerCase().replace(/\s+/g, '-')} subject cover`}
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{subject.name}</CardTitle>
        <CardDescription className="h-12 overflow-hidden text-ellipsis">{subject.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Potentially list some topics or number of questions */}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors">
          <Link href={`/practice/${subject.id}`} className="flex items-center justify-center gap-2">
            Start Practice <ArrowRight size={18} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
