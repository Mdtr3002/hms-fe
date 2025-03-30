export type MedicalRecord = {
  _id: string;
  date: number;
  followUpDate: number;
  treatment: string;
  notes?: string;
};

export type Patient = {
  _id: string;
  name: string;
  phoneNum: string;
  dob: number;
  description?: string;
  lastUpdatedAt?: number;
  medicalRecords?: MedicalRecord[];
};
