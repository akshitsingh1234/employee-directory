
export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface EmployeeInput {
  name: string;
  email: string;
  role: string;
}
