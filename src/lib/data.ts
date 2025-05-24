import type { Subject, Question } from './types';

export const subjects: Subject[] = [
  {
    id: 'applied-mathematics',
    name: 'Applied Mathematics',
    description: 'Fundamental concepts of mathematics applied in engineering.',
    topics: ['Algebra', 'Trigonometry', 'Calculus', 'Differential Equations', 'Probability'],
    image: 'https://placehold.co/600x400.png', // data-ai-hint will be added in subjects/page.tsx if used there
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
  {
    id: 'management',
    name: 'Management (22509)',
    description: 'Principles and practices of management for technical professionals and entrepreneurs.',
    topics: ['Introduction to Management Concepts', 'Planning and Organizing', 'Directing and Controlling', 'Safety Management', 'Entrepreneurship'],
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
  // Management (22509)
  {
    id: 'mgt_q1',
    subjectId: 'management',
    topic: 'Introduction to Management Concepts',
    text: 'Which of the following is NOT a primary function of management?',
    options: ['Planning', 'Organizing', 'Marketing', 'Controlling'],
    correctAnswer: 'Marketing',
    explanation: 'The primary functions of management are typically Planning, Organizing, Leading/Directing, and Controlling. Marketing is a business function but not a core management function in this context.',
  },
  {
    id: 'mgt_q2',
    subjectId: 'management',
    topic: 'Planning and Organizing',
    text: 'SWOT analysis stands for:',
    options: ['Strengths, Weaknesses, Opportunities, Threats', 'Strategy, Work, Output, Time', 'Sales, Workforce, Operations, Technology', 'Systems, Workflow, Objectives, Targets'],
    correctAnswer: 'Strengths, Weaknesses, Opportunities, Threats',
    explanation: 'SWOT analysis is a strategic planning technique used to help a person or organization identify strengths, weaknesses, opportunities, and threats related to business competition or project planning.',
  },
  {
    id: 'mgt_q3',
    subjectId: 'management',
    topic: 'Directing and Controlling',
    text: 'Which management principle suggests that each subordinate should report to only one superior?',
    options: ['Division of Work', 'Unity of Command', 'Scalar Chain', 'Esprit de Corps'],
    correctAnswer: 'Unity of Command',
    explanation: 'Unity of command means that an employee should have only one direct supervisor and should receive orders from that person only.',
  },
  {
    id: 'mgt_q4',
    subjectId: 'management',
    topic: 'Safety Management',
    text: 'What is the primary purpose of a safety audit?',
    options: ['To assign blame for accidents', 'To identify potential hazards and improve safety measures', 'To fulfill legal requirements only', 'To reduce insurance premiums'],
    correctAnswer: 'To identify potential hazards and improve safety measures',
    explanation: 'While safety audits can help with legal compliance and potentially insurance, their main goal is proactive hazard identification and safety improvement.',
  },
];

export const getQuestionsBySubject = (subjectId: string): Question[] => {
  return questions.filter(q => q.subjectId === subjectId);
};

export const getSubjectById = (subjectId: string): Subject | undefined => {
  return subjects.find(s => s.id === subjectId);
};
