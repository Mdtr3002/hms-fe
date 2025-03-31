import { Schedule } from './schedule';

export type Nurse = {
  _id: string;
  name: string;
  phoneNum: string;
  specialization: string;
  dob: string;
  schedule: Schedule;
  lastUpdatedAt?: string;
};
