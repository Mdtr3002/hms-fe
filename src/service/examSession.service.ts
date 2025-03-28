import { API_URL } from '../config';
import { ExamSession, ExamType, Response, Summary, UserAnswer } from '../types';
import { axios } from '../utils/custom-axios';

type GetAllExamSessionArgument = {
  subject?: string;
  semester?: string;
  type?: 'midterm' | 'final';
};
type GetAllExamSessionResponse = {
  total: number;
  result: ExamSession[];
};
const getAll = (query: GetAllExamSessionArgument) => {
  const queryString = `${API_URL}exam_session?pagination=false\
  ${query.subject ? `&subject=${query.subject}` : ''}\
  ${query.semester ? `&semester=SEMESTER_${query.semester}` : ''}\
  ${
    query.type
      ? `&type=${query.type === 'midterm' ? ExamType.MIDTERM_EXAM : ExamType.FINAL_EXAM}`
      : ''
  }`;

  return axios.get<Response<GetAllExamSessionResponse>>(queryString);
};

type GetAllExamSessionPaginatedArgument = {
  subject?: string;
  semester?: string;
  type?: 'midterm' | 'final';
  pageNumber?: number;
  pageSize?: number;
};
type GetAllExamSessionPaginatedResponse = {
  total: number;
  pageCount: number;
  result: ExamSession[];
};
const getAllPaginated = (query: GetAllExamSessionPaginatedArgument) => {
  const queryString = `${API_URL}exam_session?pagination=true\
  ${query.subject ? `&subject=${query.subject}` : ''}\
  ${query.semester ? `&semester=SEMESTER_${query.semester}` : ''}\
  ${
    query.type
      ? `&type=${query.type === 'midterm' ? ExamType.MIDTERM_EXAM : ExamType.FINAL_EXAM}`
      : ''
  }\
  ${query.pageNumber !== undefined ? `&pageNumber=${query.pageNumber}` : ''}\
  ${query.pageSize !== undefined ? `&pageSize=${query.pageSize}` : ''}`;

  return axios.get<Response<GetAllExamSessionPaginatedResponse>>(queryString);
};

const getById = (id: string) => {
  const queryString = `${API_URL}exam_session/${id}`;

  return axios.get<Response<ExamSession>>(queryString);
};

const getByExamId = (id: string) => {
  const queryString = `${API_URL}exam_session/exam/${id}`;

  return axios.get<Response<ExamSession | null>>(queryString);
};

const create = (examId: string) => {
  return axios.post<Response<ExamSession>>(`${API_URL}exam_session/${examId}`);
};

const saveAnswer = (examSessionId: string, questionId: string, answer: UserAnswer) => {
  return axios.post<Response<ExamSession>>(
    `${API_URL}exam_session/${examSessionId}/question/${questionId}/save`,
    answer
  );
};

const submit = (examSessionId: string) => {
  return axios.post<Response<ExamSession>>(`${API_URL}exam_session/${examSessionId}/submit`);
};

const getSummary = (examSessionId: string) => {
  return axios.get<Response<Summary>>(`${API_URL}exam_session/${examSessionId}/slot/summary`);
};

const ExamSessionService = {
  getAll,
  getAllPaginated,
  getById,
  getByExamId,
  create,
  saveAnswer,
  submit,
  getSummary,
};
export default ExamSessionService;
