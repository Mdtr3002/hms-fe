import { Chapter } from './chapter';
import { Subject } from './subject';

export type Material = {
  _id: string;
  name: string;
  subject: Subject;
  chapter: Chapter;
  isHidden: boolean;

  description: string;
  resource: string;
  createdBy: string;
  createdAt: number;
  lastUpdatedAt?: number;

  deletedAt?: number;
};
