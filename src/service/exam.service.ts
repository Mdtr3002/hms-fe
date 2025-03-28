import { API_URL } from '../config';
import { Exam, ExamType, Response } from '../types';
import { axios } from '../utils/custom-axios';

type GetAllExamArgument = {
  subject?: string;
  semester?: string;
  type?: 'midterm' | 'final';
};
type GetAllExamResponse = {
  total: number;
  result: Exam[];
};
const getAll = (query: GetAllExamArgument, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}exam?pagination=false\
${query.subject ? `&subject=${query.subject}` : ''}\
${query.semester ? `&semester=SEMESTER_${query.semester}` : ''}\
${
  query.type
    ? `&type=${query.type === 'midterm' ? ExamType.MIDTERM_EXAM : ExamType.FINAL_EXAM}`
    : ''
}`;

  return axios.get<Response<GetAllExamResponse>>(queryString);
};

type GetAllExamPaginatedArgument = {
  subject?: string;
  semester?: string;
  type?: 'midterm' | 'final';
  pageNumber?: number;
  pageSize?: number;
};
type GetAllExamPaginatedArgumentResponse = {
  total: number;
  pageCount: number;
  result: Exam[];
};
const getAllPaginated = (query: GetAllExamPaginatedArgument, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}exam?pagination=true\
${query.subject ? `&subject=${query.subject}` : ''}\
${query.semester ? `&semester=SEMESTER_${query.semester}` : ''}\
${
  query.type
    ? `&type=${query.type === 'midterm' ? ExamType.MIDTERM_EXAM : ExamType.FINAL_EXAM}`
    : ''
}\
${query.pageNumber !== undefined ? `&pageNumber=${query.pageNumber}` : ''}\
${query.pageSize !== undefined ? `&pageSize=${query.pageSize}` : ''}`;

  return axios.get<Response<GetAllExamPaginatedArgumentResponse>>(queryString);
};

const getById = (id: string, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}exam/${id}`;

  return axios.get<Response<Exam>>(queryString);
};

const register = (examId: string, slotId: number) => {
  return axios.post<Response>(`${API_URL}exam/${examId}/slot/${slotId}`);
};

const unregister = (examId: string) => {
  return axios.post<Response>(`${API_URL}exam/${examId}/unregister`);
};

const getSummary = (examId: string) => {
  return axios.get<Response<number[]>>(`${API_URL}exam/${examId}/summary`);
};

const ExamService = { getAll, getAllPaginated, getById, register, unregister, getSummary };
export default ExamService;
