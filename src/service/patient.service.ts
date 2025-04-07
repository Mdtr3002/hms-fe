import { API_URL } from '../config';
import { Patient } from '../types/patient';
import { axios } from '../utils/custom-axios';

import type { Response } from '../types/response';

type CreatePatientArgument = {
  name: string;
  phoneNumber: string;
  dob: number;
  description?: string;
  medicalRecord?: {
    recordId: string;
    date: number;
    followUpDate: number;
    treatment: string;
    notes?: string;
  }[];
};

type EditPatientArgument = {
  name: string;
  phoneNumber: string;
  dob: number;
  description?: string;
  medicalRecord?: {
    recordId: string;
    date: number;
    followUpDate: number;
    treatment: string;
    notes?: string;
  }[];
};

type GetAllPatientPaginatedArgument = {
  name?: string;
  pageNumber?: number;
  pageSize?: number;
};

type GetAllPatientPaginatedReturnType = {
  total: number;
  pageCount: number;
  pageSize: number;
  pageNumber: number;
  result: Patient[];
};

const create = (data: CreatePatientArgument) => {
  return axios.post<Response<Patient>>(`${API_URL}admin/patient`, data);
};

const editById = (id: string, data: EditPatientArgument) => {
  return axios.patch<Response<Patient>>(`${API_URL}admin/patient/${id}`, data);
};

const getById = (id: string, admin = false) => {
  return axios.get<Response<Patient>>(`${API_URL}${admin ? 'admin/' : ''}patient/${id}`);
};

const getAllPaginated = (query: GetAllPatientPaginatedArgument, admin = true) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}patient?pagination=true\
${query.name ? `&name=${encodeURIComponent(query.name)}` : ''}\
${query.pageNumber !== undefined ? `&pageNumber=${query.pageNumber}` : ''}\
${query.pageSize !== undefined ? `&pageSize=${query.pageSize}` : ''}
  `;

  return axios.get<Response<GetAllPatientPaginatedReturnType>>(queryString);
};

const deleteById = (id: string) => {
  return axios.delete<Response>(`${API_URL}admin/patient/${id}`);
};

const PatientService = {
  create,
  editById,
  getById,
  getAllPaginated,
  deleteById,
};

export default PatientService;
