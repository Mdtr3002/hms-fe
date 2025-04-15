import { API_URL } from '../config';
import { axios } from '../utils/custom-axios';
import type { Response } from '../types/response';
import { Doctor } from '../types/doctor';
import { Nurse } from '../types/nurse';

/* ======================= */
/*       DoctorService     */
/* ======================= */
export type CreateDoctorArgument = {
  name: string;
  phoneNumber: string;
  dob: number;
  description?: string;
  specialization: string;
  scheduleStartTime: string;
  scheduleEndTime: string;
  workDays: string[];
  scheduleWorkDescription?: string;
};

export type EditDoctorArgument = {
  name: string;
  phoneNumber: string;
  dob: number;
  description?: string;
  specialization: string;
  scheduleStartTime: string;
  scheduleEndTime: string;
  workDays: string[];
  scheduleWorkDescription?: string;
};

export type GetAllDoctorPaginatedArgument = {
  name?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type GetAllDoctorPaginatedReturnType = {
  total: number;
  pageCount: number;
  pageSize: number;
  pageNumber: number;
  result: Doctor[];
};

const createDoctor = (data: CreateDoctorArgument) => {
  const payload = { ...data, role: 'Doctor' };
  return axios.post<Response<Doctor>>(`${API_URL}admin/staff`, payload);
};

const editDoctorById = (id: string, data: EditDoctorArgument) => {
  return axios.patch<Response<Doctor>>(`${API_URL}admin/staff/${id}`, data);
};

const getDoctorById = (id: string, admin = true) => {
  return axios.get<Response<Doctor>>(`${API_URL}admin/staff/${id}`);
};

const getAllDoctorsPaginated = (
  query: GetAllDoctorPaginatedArgument,
  admin = true
) => {
  const queryString = `${API_URL}${
    admin ? 'admin/staff' : 'staff'
  }?pagination=true${
    query.name ? `&name=${encodeURIComponent(query.name)}` : ''
  }${
    query.pageNumber !== undefined ? `&pageNumber=${query.pageNumber}` : ''
  }${
    query.pageSize !== undefined ? `&pageSize=${query.pageSize}` : ''
  }`;

  return axios.get<Response<GetAllDoctorPaginatedReturnType>>(queryString);
};

const deleteDoctorById = (id: string) => {
  return axios.delete<Response>(`${API_URL}admin/staff/${id}`);
};

const DoctorService = {
  create: createDoctor,
  editById: editDoctorById,
  getById: getDoctorById,
  getAllPaginated: getAllDoctorsPaginated,
  deleteById: deleteDoctorById,
};

/* ======================= */
/*       NurseService      */
/* ======================= */
export type CreateNurseArgument = {
  name: string;
  phoneNumber: string;
  dob: number;
  description?: string;
  specialization: string;
  scheduleStartTime: string;
  scheduleEndTime: string;
  workDays: string[];
  scheduleWorkDescription?: string;
};

export type EditNurseArgument = {
  name: string;
  phoneNumber: string;
  dob: number;
  description?: string;
  specialization: string;
  scheduleStartTime: string;
  scheduleEndTime: string;
  workDays: string[];
  scheduleWorkDescription?: string;
};

export type GetAllNursePaginatedArgument = {
  name?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type GetAllNursePaginatedReturnType = {
  total: number;
  pageCount: number;
  pageSize: number;
  pageNumber: number;
  result: Nurse[];
};

const createNurse = (data: CreateNurseArgument) => {
  const payload = { ...data, role: 'Nurse' };
  return axios.post<Response<Nurse>>(`${API_URL}admin/staff`, payload);
};

const editNurseById = (id: string, data: EditNurseArgument) => {
  return axios.patch<Response<Nurse>>(`${API_URL}admin/staff/${id}`, data);
};

const getNurseById = (id: string, admin = true) => {
  return axios.get<Response<Nurse>>(
    `${API_URL}${admin ? 'admin/staff/' : 'staff/'}${id}`
  );
};

const getAllNursesPaginated = (
  query: GetAllNursePaginatedArgument,
  admin = true
) => {
  const queryString = `${API_URL}${
    admin ? 'admin/staff' : 'staff'
  }?pagination=true${
    query.name ? `&name=${encodeURIComponent(query.name)}` : ''
  }${
    query.pageNumber !== undefined ? `&pageNumber=${query.pageNumber}` : ''
  }${
    query.pageSize !== undefined ? `&pageSize=${query.pageSize}` : ''
  }`;

  return axios.get<Response<GetAllNursePaginatedReturnType>>(queryString);
};

const deleteNurseById = (id: string) => {
  return axios.delete<Response>(`${API_URL}admin/staff/${id}`);
};

const NurseService = {
  create: createNurse,
  editById: editNurseById,
  getById: getNurseById,
  getAllPaginated: getAllNursesPaginated,
  deleteById: deleteNurseById,
};

export { DoctorService, NurseService };
