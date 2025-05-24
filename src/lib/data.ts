import type { Subject, Question } from './types';

export const subjects: Subject[] = [
  {
    id: 'applied-mathematics',
    name: 'Applied Mathematics',
    description: 'Fundamental concepts of mathematics applied in engineering.',
    topics: ['Algebra', 'Trigonometry', 'Calculus', 'Differential Equations', 'Probability'],
    image: 'https://placehold.co/600x400.png',
  },
  {
    id: 'basic-electronics',
    name: 'Basic Electronics',
    description: 'Introduction to electronic devices and circuits.',
    topics: ['Semiconductors', 'Diodes', 'Transistors', 'Operational Amplifiers', 'Digital Logic'],
    image: 'https://placehold.co/600x400.png',
  },
  {
    id: 'programming-in-c',
    name: 'Programming in C',
    description: 'Learn the fundamentals of programming using the C language.',
    topics: ['Variables & Data Types', 'Control Structures', 'Functions', 'Arrays & Pointers', 'File Handling'],
    image: 'https://placehold.co/600x400.png',
  },
];

export const questions: Question[] = [
  // Applied Mathematics
  {
    id: 'am_q1',
    subjectId: 'applied-mathematics',
    topic: 'Algebra',
    text: 'What is the value of x if 2x + 5 = 15?',
    options: ['3', '5', '7', '10'],
    correctAnswer: '5',
    explanation: '2x = 15 - 5 => 2x = 10 => x = 10/2 => x = 5.',
  },
  {
    id: 'am_q2',
    subjectId: 'applied-mathematics',
    topic: 'Trigonometry',
    text: 'What is sin(90 degrees)?',
    options: ['0', '0.5', '1', 'undefined'],
    correctAnswer: '1',
  },
  {
    id: 'am_q3',
    subjectId: 'applied-mathematics',
    topic: 'Calculus',
    text: 'What is the derivative of x^2?',
    options: ['x', '2x', 'x^2/2', '2'],
    correctAnswer: '2x',
  },
  // Basic Electronics
  {
    id: 'be_q1',
    subjectId: 'basic-electronics',
    topic: 'Semiconductors',
    text: 'Which of these is a semiconductor?',
    options: ['Copper', 'Silicon', 'Glass', 'Rubber'],
    correctAnswer: 'Silicon',
    explanation: 'Silicon is a widely used semiconductor material.',
  },
  {
    id: 'be_q2',
    subjectId: 'basic-electronics',
    topic: 'Diodes',
    text: 'A diode allows current to flow in how many directions?',
    options: ['One', 'Two', 'Zero', 'Four'],
    correctAnswer: 'One',
  },
  // Programming in C
  {
    id: 'pc_q1',
    subjectId: 'programming-in-c',
    topic: 'Variables & Data Types',
    text: 'Which keyword is used to define a constant in C?',
    options: ['const', 'let', 'final', 'static'],
    correctAnswer: 'const',
  },
  {
    id: 'pc_q2',
    subjectId: 'programming-in-c',
    topic: 'Control Structures',
    text: 'What is the output of `printf("%d", 10 > 5);`?',
    options: ['10', '5', '1', '0'],
    correctAnswer: '1',
    explanation: 'In C, true conditions evaluate to 1.',
  },
];

export const getQuestionsBySubject = (subjectId: string): Question[] => {
  return questions.filter(q => q.subjectId === subjectId);
};

export const getSubjectById = (subjectId: string): Subject | undefined => {
  return subjects.find(s => s.id === subjectId);
};
