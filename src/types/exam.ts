import { ConcreteQuestion, ExamType, Question, Semester, SessionStatus, Subject, User } from './';

export interface Student extends Omit<User, '_id'> {
  userId: string;
}

export type Exam = {
  _id: string;
  name: string;
  description: string;

  subject: Subject;
  semester: Semester;
  type: ExamType;

  slots: {
    slotId: number;

    name: string;
    registeredUsers: Student[];
    userLimit: number;
    questions?: Question[];
    questionCount?: number;

    startedAt: number;
    endedAt: number;
  }[];

  createdBy: string;
  createdAt: number;
  lastUpdatedAt?: number;

  isHidden: boolean;
  deletedAt?: number;
};

export type ExamSession = {
  _id: string;
  userId: string;
  status: SessionStatus;

  duration: number;
  timeLeft: number;
  startedAt: number;
  endedAt?: number;

  standardizedScore?: number;
  fromExam: Exam;
  slotId: number;

  questions: ConcreteQuestion[];
};

export type Summary = {
  registeredCount: number;
  startedCount: number;
  completedCount: number;
  completedScores: number[];
};
