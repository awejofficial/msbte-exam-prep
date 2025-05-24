'use server';
import { createPracticeExam, type CreatePracticeExamInput, type CreatePracticeExamOutput } from '@/ai/flows/create-practice-exam';

export async function generatePersonalizedExamAction(input: CreatePracticeExamInput): Promise<CreatePracticeExamOutput | { error: string }> {
  try {
    console.log("Generating personalized exam with input:", input);
    const result = await createPracticeExam(input);
    if (!result || !result.questions || result.questions.length === 0) {
      console.error("AI failed to generate questions or returned an empty set.");
      return { error: 'AI failed to generate questions. Please try adjusting your parameters.' };
    }
    console.log("AI generated questions:", result.questions.length);
    return result;
  } catch (error) {
    console.error('Error generating personalized exam:', error);
    return { error: 'An unexpected error occurred while generating the exam. Please try again later.' };
  }
}
