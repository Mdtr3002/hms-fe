export type MedicalRecord = {
  recordId: string;
  date: number;
  followUpDate: number;
  treatment: string;
  notes?: string;
};

export type Patient = {
  _id: string;
  name: string;
  phoneNumber: string;
  dob: number;
  description?: string;
  lastUpdatedAt?: number;
  medicalRecord?: MedicalRecord[];
};
