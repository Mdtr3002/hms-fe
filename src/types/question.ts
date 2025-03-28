import { Chapter } from './chapter';
import { Subject } from './subject';

export enum QuestionType {
  MULTIPLE_CHOICE_SINGLE_ANSWER = 'MULTIPLE_CHOICE_SINGLE_ANSWER',
  MULTIPLE_CHOICE_MULTIPLE_ANSWERS = 'MULTIPLE_CHOICE_MULTIPLE_ANSWERS',
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
}

export type UserAnswer = {
  answerKeys?: number[];
  answerField?: string | number;
};

export type ConcreteQuestion = {
  questionId: number;
  type: QuestionType;
  description: string;
  options?: {
    key: number;
    description: string;
  }[];
  answerKeys?: number[];
  answerField?: string | number;
  userNote?: string;

  matchCase?: boolean;
  maximumError?: number;
  explanation: string;

  userAnswerKeys?: number[];
  userAnswerField?: string | number;
  isCorrect?: boolean;
};

export type Question = {
  _id: string;
  name: string;

  code: string;
  subject: Subject;
  chapter: Chapter;

  type: QuestionType;
  description: string;

  options?: {
    key: number;
    description: string;
  }[];
  shuffleOptions?: boolean;
  answerKeys?: number[];
  answerField?: string;
  matchCase?: boolean;
  maximumError?: number;

  explanation: string;

  createdAt: number;
  createdBy: string;
  lastUpdatedAt?: number;
  deletedAt?: number;
};
