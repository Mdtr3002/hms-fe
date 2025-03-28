import { BookFacultyType } from './book';

export type TBookFairPartner = {
  name: string;
  link: string;
};

export type TBookFairActivity = {
  title: string;
  image: string;
  placeholderImage: string;
};

export type TBookFairSearchParams = {
  title: string;
  faculties: BookFacultyType[];
};

export type TStudentInfo = {
  familyAndMiddleName: string;
  givenName: string;
  studentId: string;
  phoneNumber: string;
  schoolYear: string;
};
