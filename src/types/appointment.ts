export type Appointment = {
  id: string; 
  patientName: string;
  doctorId: string;
  date: Date; 
  reason: string;
  status: "scheduled" | "completed" | "canceled" | "pending";
};
