export type Subject = {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: number;
  lastUpdatedAt?: number;
  deletedAt?: number;
};
