export type Schedule = {
  _id: string;
  workingTime: {
    startTime: string;
    endTime: string;
  };
  workDay: string[];
  workDescription?: string;
};
