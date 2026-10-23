
import axios from 'axios';
import type { Employee, EmployeeInput } from '../types/employee';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const employeeApi = {
  async getAll(search = ''): Promise<Employee[]> {
    const response = await api.get<Employee[]>('/employees', {
      params: search ? { search } : {},
    });
    return response.data;
  },

  async create(data: EmployeeInput): Promise<Employee> {
    const response = await api.post<Employee>('/employees', data);
    return response.data;
  },

  async update(id: number, data: EmployeeInput): Promise<Employee> {
    const response = await api.put<Employee>(`/employees/${id}`, data);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/employees/${id}`);
  },
};

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message || 'Request failed.';
  }

  return 'An unexpected error occurred.';
}
