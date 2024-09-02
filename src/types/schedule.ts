// src/types/schedule.ts

export interface User {
  name: string; // Only include properties that exist in the data
  // id: string; // Remove this line if the id is not present in your data
}

export interface Schedule {
  id: string;
  plan_name: string;
  month: string;
  dates: string[];
  locations: Array<{ title: string; roadAddress: string }>;
  created_by: string;
  users: User[];
}

export interface Invitation {
  id: string;
  schedule_id: string;
  schedules: Schedule[]; 
  status: string;
}
