import { API_URL } from '../config';
import { MockTest } from '../types/mockTest';
import { axios } from '../utils/custom-axios';

import type { Response } from '../types/response';

type CreateMockTestArgument = {
  name: string;
  description: string;
  subject: string;
  semester: string;
  type: string;
  slots?: never[];
};

type CreateSlotArgument = {
  name: string;
  userLimit: number;
  questions: string[];
  startedAt: number;
  endedAt: number;
};

type GetAllMockTestArgument = {
  name?: string;
  subject?: string;
  semester?: string;
  chapter?: string;
  type?: string;
};

type EditMockTestArgument = {
  name?: string;
  subject?: string;
  semester?: string;
  type?: string;
  description?: string;
  isHidden?: boolean;
};

type GetAllMockTestReturnType = {
  total: number;
  result: MockTest[];
};
const getAll = (query: GetAllMockTestArgument, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}exam?pagination=false\
${query.name ? `&name=${query.name}` : ''}\
${query.subject ? `&subject=${query.subject}` : ''}\
${query.semester ? `&semester=${query.semester}` : ''}\
${query.type ? `&type=${query.type}` : ''}`;

  return axios.get<Response<GetAllMockTestReturnType>>(queryString);
};

type GetAllMockTestPaginatedArgument = {
  name?: string;
  subject?: string;
  semester?: string;
  type?: string;
  pageNumber?: number;
  pageSize?: number;
};
type GetAllMockTestPaginatedReturnType = {
  total: number;
  pageCount: number;
  pageSize: number;
  result: MockTest[];
};
const getAllPaginated = (query: GetAllMockTestPaginatedArgument, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}exam?pagination=true\
${query.name ? `&name=${query.name}` : ''}\
${query.subject ? `&subject=${query.subject}` : ''}\
${query.semester ? `&semester=${query.semester}` : ''}\
${query.type ? `&type=${query.type}` : ''}\
${query.pageNumber !== undefined ? `&pageNumber=${query.pageNumber}` : ''}\
${query.pageSize !== undefined ? `&pageSize=${query.pageSize}` : ''}`;

  return axios.get<Response<GetAllMockTestPaginatedReturnType>>(queryString);
};

const getById = (examId: string, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}exam/${examId}`;

  return axios.get<Response<MockTest>>(queryString);
};

const create = (data: CreateMockTestArgument) => {
  return axios.post<Response<MockTest>>(`${API_URL}admin/exam`, data);
};

const deleteById = (mockTestId: string) => {
  return axios.delete<Response<MockTest>>(`${API_URL}admin/exam/${mockTestId}`);
};

const editGeneralInformation = (mockTestId: string, data: EditMockTestArgument, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}exam/${mockTestId}`;

  return axios.patch<Response<MockTest>>(queryString, data);
};

const createSlot = (data: CreateSlotArgument, mockTestId: string) => {
  return axios.post<Response<MockTest>>(`${API_URL}admin/exam/${mockTestId}/slot`, data);
};

const editSlot = (data: CreateSlotArgument, mockTestId: string, slotNumber: number) => {
  return axios.patch<Response<MockTest>>(
    `${API_URL}admin/exam/${mockTestId}/slot/${slotNumber}`,
    data
  );
};

const deleteSlot = (mockTestId: string, slotNumber: number) => {
  return axios.delete<Response<MockTest>>(`${API_URL}admin/exam/${mockTestId}/slot/${slotNumber}`);
};

const MockTestService = {
  getAll,
  getAllPaginated,
  getById,
  create,
  deleteById,
  editGeneralInformation,
  createSlot,
  deleteSlot,
  editSlot,
};

export default MockTestService;
