'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { subjects as allSubjects } from '@/lib/data';
import type { Subject, PastPerformance } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap } from 'lucide-react';

const formSchema = z.object({
  subjectId: z.string().min(1, 'Please select a subject.'),
  examLength: z.coerce.number().min(3, 'Minimum 3 questions.').max(20, 'Maximum 20 questions.'),
  weakTopics: z.array(z.string()).optional(), // Array of topic names
});

type PersonalizedPracticeFormValues = z.infer<typeof formSchema>;

interface PersonalizedPracticeFormProps {
  onSubmit: (data: { subject: string; pastPerformance: PastPerformance; examLength: number }) => void;
  isSubmitting: boolean;
}

export default function PersonalizedPracticeForm({ onSubmit, isSubmitting }: PersonalizedPracticeFormProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const form = useForm<PersonalizedPracticeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectId: '',
      examLength: 5,
      weakTopics: [],
    },
  });

  const subjectIdValue = form.watch('subjectId');

  useEffect(() => {
    if (subjectIdValue) {
      const subject = allSubjects.find(s => s.id === subjectIdValue);
      setSelectedSubject(subject || null);
      form.resetField('weakTopics'); // Reset weak topics when subject changes
    } else {
      setSelectedSubject(null);
    }
  }, [subjectIdValue, form]);

  const handleFormSubmit = (values: PersonalizedPracticeFormValues) => {
    if (!selectedSubject) return;

    const pastPerformance: PastPerformance = {};
    selectedSubject.topics.forEach(topic => {
      // If a topic is selected as weak, give it a low score (e.g., 0.2)
      // Otherwise, give it a moderate/high score (e.g., 0.7)
      pastPerformance[topic] = values.weakTopics?.includes(topic) ? 0.2 : 0.7;
    });
    
    onSubmit({
      subject: selectedSubject.name,
      pastPerformance,
      examLength: values.examLength,
    });
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader className="text-center">
        <Brain className="mx-auto h-12 w-12 text-primary mb-2" />
        <CardTitle className="text-2xl">Personalized AI Practice</CardTitle>
        <CardDescription>Let AI create a custom exam based on your needs.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allSubjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedSubject && selectedSubject.topics.length > 0 && (
              <FormField
                control={form.control}
                name="weakTopics"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Weak Topics (Optional)</FormLabel>
                      <FormDescription>
                        Select topics you find challenging. AI will focus more on these.
                      </FormDescription>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                    {selectedSubject.topics.map((topic) => (
                      <FormField
                        key={topic}
                        control={form.control}
                        name="weakTopics"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={topic}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(topic)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), topic])
                                      : field.onChange(
                                          (field.value || []).filter(
                                            (value) => value !== topic
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {topic}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="examLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Questions</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5" {...field} />
                  </FormControl>
                  <FormDescription>
                    How many questions should the AI generate? (Min 3, Max 20)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting || !selectedSubject} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {isSubmitting ? (
                <><Zap className="animate-pulse mr-2 h-4 w-4" /> Generating Exam...</>
              ) : (
                <><Zap className="mr-2 h-4 w-4" /> Generate Exam</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
