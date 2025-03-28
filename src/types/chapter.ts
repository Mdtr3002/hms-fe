import { Subject } from './subject';

export type Chapter = {
  _id: string;
  name: string;
  subject: Subject;
  description: string;

  createdBy: string;
  createdAt: number;
  lastUpdatedAt?: number;
  deletedAt?: number;
};
