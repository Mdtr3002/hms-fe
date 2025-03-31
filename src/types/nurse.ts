import { Schedule } from "./schedule";

export type nurse = {
  _id: string;
  name: string;
  phoneNum: string;
  specialization: string;
  dob: string;
  schedule: Schedule;
  lastUpdatedAt?: string;
};
