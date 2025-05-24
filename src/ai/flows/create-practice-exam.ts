// src/ai/flows/create-practice-exam.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for creating personalized practice exams based on user performance.
 *
 * - createPracticeExam - A function that generates a practice exam.
 * - CreatePracticeExamInput - The input type for the createPracticeExam function.
 * - CreatePracticeExamOutput - The return type for the createPracticeExam function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreatePracticeExamInputSchema = z.object({
  subject: z.string().describe('The subject for the practice exam.'),
  pastPerformance: z.record(z.number()).describe('A record of the user\'s past performance in each topic of the subject. The keys are topics and values are performance scores between 0 and 1.'),
  examLength: z.number().int().positive().describe('The desired number of questions in the practice exam.'),
});
export type CreatePracticeExamInput = z.infer<typeof CreatePracticeExamInputSchema>;

const CreatePracticeExamOutputSchema = z.object({
  questions: z.array(z.string()).describe('An array of questions for the practice exam.'),
});
export type CreatePracticeExamOutput = z.infer<typeof CreatePracticeExamOutputSchema>;

export async function createPracticeExam(input: CreatePracticeExamInput): Promise<CreatePracticeExamOutput> {
  return createPracticeExamFlow(input);
}

const createPracticeExamPrompt = ai.definePrompt({
  name: 'createPracticeExamPrompt',
  input: {
    schema: CreatePracticeExamInputSchema,
  },
  output: {
    schema: CreatePracticeExamOutputSchema,
  },
  prompt: `You are an expert in creating practice exams for the MSBTE exam.

  Based on the student's past performance in {{subject}}, generate a practice exam with {{examLength}} questions that focuses on the student's weak areas.

  Past Performance:
  {{#each pastPerformance}}
  - Topic: {{@key}}, Score: {{this}}
  {{/each}}

  The questions should be challenging and relevant to the exam.

  Ensure that the questions cover the topics where the student has a low performance score.

  Output the questions in JSON format.
  `,
});

const createPracticeExamFlow = ai.defineFlow(
  {
    name: 'createPracticeExamFlow',
    inputSchema: CreatePracticeExamInputSchema,
    outputSchema: CreatePracticeExamOutputSchema,
  },
  async input => {
    const {output} = await createPracticeExamPrompt(input);
    return output!;
  }
);
