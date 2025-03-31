import { Schedule } from "./schedule";

export type Doctor = {
  _id: string;
  name: string;
  phoneNum: string;
  specialization: string;
  dob: string;
  schedule: Schedule;
  lastUpdatedAt?: string;
};
