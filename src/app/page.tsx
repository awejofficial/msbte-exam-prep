import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenCheck, Brain, CheckCircle, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center space-y-12">
      <section className="w-full py-12 md:py-20 lg:py-28 rounded-lg shadow-xl bg-card">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4 text-left">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  MSBTE Exam Prep
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Your ultimate tool to conquer MSBTE exams. Practice MCQs, track your progress, and get AI-powered personalized exams to focus on your weak areas.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-transform hover:scale-105">
                  <Link href="/subjects" className="flex items-center gap-2">
                    <BookOpenCheck size={22} />
                    Browse Subjects
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-accent text-accent hover:bg-accent/10 shadow-md transition-transform hover:scale-105">
                  <Link href="/ai-practice" className="flex items-center gap-2">
                    <Brain size={22} />
                    Personalized Practice
                  </Link>
                </Button>
              </div>
            </div>
            <Image
              src="https://placehold.co/600x400.png"
              data-ai-hint="education study"
              width="600"
              height="400"
              alt="Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="w-full max-w-5xl space-y-8">
        <h2 className="text-3xl font-bold tracking-tight">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Zap className="text-accent" />}
            title="Practice Exams"
            description="Access a wide range of MCQs for various MSBTE subjects."
          />
          <FeatureCard
            icon={<CheckCircle className="text-primary" />}
            title="Immediate Feedback"
            description="Know if your answer is correct right away and learn from explanations."
          />
          <FeatureCard
            icon={<Brain className="text-accent" />}
            title="AI-Powered Personalization"
            description="Generate custom exams focusing on topics where you need improvement."
          />
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="bg-primary/10 p-3 rounded-full">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-md">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
