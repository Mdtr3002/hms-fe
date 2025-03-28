import { Chapter } from './chapter';
import { ConcreteQuestion, Question } from './question';
import { Subject } from './subject';

export type Quiz = {
  _id: string;
  name: string;
  description: string;
  subject: Subject;
  chapter: Chapter;
  isHidden: boolean;

  duration: number;
  potentialQuestions?: Question[];
  sampleSize: number;

  createdBy: string;
  createdAt: number;
  lastUpdatedAt?: number;
  deletedAt?: number;
};

export enum SessionStatus {
  ONGOING = 'ONGOING',
  ENDED = 'ENDED',
}

export type QuizSession = {
  _id: string;
  userId: string;
  status: SessionStatus;
  createdAt: number;
  duration: number;
  startedAt: number;
  endedAt?: number;
  standardizedScore?: number;
  timeLeft: number;

  fromQuiz: Quiz;
  questions: ConcreteQuestion[];
};
