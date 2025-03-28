import { ExamType, Semester } from './examArchive';
import { Subject } from './subject';

export type RegisteredUser = {
  userId: string;
  givenName: string;
  familyAndMiddleName: string;
  dateOfBirth: number;
  studentId: string;
  major: string;
  gender: string;
  phoneNumber: string;
};

export type SlotQuestion = {
  _id: string;
  name: string;

  code: string;
  subject: string;
  chapter: string;

  description: string;

  options?: {
    key: number;
    description: string;
  }[];
  shuffleOptions?: boolean;
  answerKeys?: number[];

  explanation: string;

  createdAt: number;
  createdBy: string;
  lastUpdatedAt?: number;
  deletedAt?: number;
};

export type Slots = {
  slotId: number;
  name: string;
  registeredUsers: RegisteredUser[];
  userLimit: number;
  questions: SlotQuestion[];
  startedAt: number;
  endedAt: number;
};

export type MockTest = {
  _id: string;
  name: string;
  subject: Subject;
  semester: Semester;
  type: ExamType;
  isHidden: boolean;
  description: string;
  slots: Slots[];
  createdBy: string;
  createdAt: number;
  lastUpdatedAt?: number;
};
