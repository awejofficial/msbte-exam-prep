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
  {
    id: 'management',
    name: 'Management (22509)',
    description: 'Principles and practices of management for technical professionals and entrepreneurs.',
    topics: ['Introduction to Management Concepts', 'Planning and Organizing', 'Directing and Controlling', 'Safety Management', 'Entrepreneurship', 'Industrial Acts and Labour Laws'],
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
  // Management (22509) - New Questions
  {
    id: 'mgt_q1',
    subjectId: 'management',
    topic: 'Industrial Acts and Labour Laws',
    text: 'Indian factory act come in to force on ----------',
    options: ['1st May 1960', '1st April 1949', '15th August 1947', '26th January 1950'],
    correctAnswer: '1st April 1949',
  },
  {
    id: 'mgt_q2',
    subjectId: 'management',
    topic: 'Industrial Acts and Labour Laws',
    text: 'As per Indian factory act, The person who has control over the affairs of factory is known as -------',
    options: ['Employee', 'Worker', 'Occupier', 'None of the above'],
    correctAnswer: 'Occupier',
  },
  {
    id: 'mgt_q3',
    subjectId: 'management',
    topic: 'Industrial Acts and Labour Laws',
    text: 'Section 27 under the Industrial dispute act is about ........',
    options: ['Manufacturing process', 'Penalty for instigation', 'Occupier', 'None of the above'],
    correctAnswer: 'Penalty for instigation',
  },
  {
    id: 'mgt_q4',
    subjectId: 'management',
    topic: 'Industrial Acts and Labour Laws',
    text: 'As per Indian Factory act, Employer has to provide canteen facility, if there are ---- number of employees.',
    options: ['50', '100', '200', '250'],
    correctAnswer: '250',
  },
  {
    id: 'mgt_q5',
    subjectId: 'management',
    topic: 'Industrial Acts and Labour Laws',
    text: '------------- section of Industrial Dispute act covers the topic penalty for instigation.',
    options: ['Section 7', 'Section 27', 'Section 5', 'None of the above'],
    correctAnswer: 'Section 27',
  },
  {
    id: 'mgt_q6',
    subjectId: 'management',
    topic: 'Industrial Acts and Labour Laws',
    text: '-- is not statuary welfare facility under Factory act',
    options: ['Canteen', 'Medical', 'Transport', 'None of the above'],
    correctAnswer: 'Transport',
  },
  {
    id: 'mgt_q7',
    subjectId: 'management',
    topic: 'Industrial Acts and Labour Laws',
    text: 'Bhopal gas tragedy led to an amendment under ---- legislation',
    options: ['Indian Safety act', 'Indian boiler act', 'Indian wage act', 'None of the above'],
    correctAnswer: 'None of the above', // Assuming this is the intended answer as provided. It likely led to Environment Protection Act, 1986.
  },
  {
    id: 'mgt_q8',
    subjectId: 'management',
    topic: 'Industrial Acts and Labour Laws',
    text: 'Arrangements of drinking water is mentioned under------ section of Factory act',
    options: ['15', '11', '10', '18'],
    correctAnswer: '18',
  },
  {
    id: 'mgt_q9',
    subjectId: 'management',
    topic: 'Industrial Acts and Labour Laws',
    text: 'For contravention of provisions of factories act , the occupier shall liable for punishment up to .-------',
    options: ['Fine of Rs 10000', 'Fine of Rs 100000', 'Fine of Rs 200000', 'None of the above'],
    correctAnswer: 'None of the above', // The penalties can be complex and include imprisonment and/or higher fines depending on the specific contravention and if it's a repeated offense. "None of the above" might be correct if specific options don't match the actual penalties.
  },
  {
    id: 'mgt_q10',
    subjectId: 'management',
    topic: 'Industrial Acts and Labour Laws',
    text: 'The license fee can be paid to get license for a factory maximum up to --------',
    options: ['One year', 'Two year', 'Five Year', 'Three year'],
    correctAnswer: 'Five Year',
  },
];

export const getQuestionsBySubject = (subjectId: string): Question[] => {
  return questions.filter(q => q.subjectId === subjectId);
};

export const getSubjectById = (subjectId: string): Subject | undefined => {
  return subjects.find(s => s.id === subjectId);
};
