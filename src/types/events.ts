import { Option } from '../components/Select';

import { Subject, User } from './';

export enum EventType {
  LHOT = 'LOP_HOC_ON_TAP',
  OTHER = 'OTHER',
}

export const EVENT_TYPE_OPTIONS: Option[] = [
  { value: EventType.LHOT, label: 'Lớp học ôn tập' },
  { value: EventType.OTHER, label: 'Khác' },
];

export type EventUser = {
  userId: string;
  studentId: string;
  phoneNumber: string;
  givenName: string;
  familyAndMiddleName: string;
  checkedInAt: Date;
};

export type Event = {
  _id: string;

  name: string;
  description: string;

  eventType: EventType;
  venue: string;

  hasRegistrationTime: boolean;
  registrationStartedAt?: number;
  registrationEndedAt?: number;

  startedAt: number;
  endedAt: number;

  lhotMetadata: {
    subject: Subject;
  };

  registeredUsers: EventUser[];

  createdAt: number;
  createdBy: User;
  lastUpdatedAt: number;
  deletedAt?: number;
};
