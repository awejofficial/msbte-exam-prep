export interface Question {
  id: string;
  subjectId: string;
  topic: string; // For AI context and potentially for filtering
  text: string;
  options: string[];
  correctAnswer: string; // Store the correct option string, not index
  explanation?: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  topics: string[]; // List of topics within the subject
  image?: string; // Optional: for display
}

export interface ExamResult {
  subjectId?: string; // For standard exams
  subjectName?: string; // For display
  questions: Question[] | { text: string, options: string[], correctAnswer: string, explanation?: string }[]; // AI questions might not have full Question structure
  userAnswers: (string | null)[];
  score: number;
  totalQuestions: number;
  timeTaken?: number; // in seconds
  isAIPractice?: boolean;
}

export interface PastPerformance {
  [topic: string]: number; // Score between 0 and 1
}
