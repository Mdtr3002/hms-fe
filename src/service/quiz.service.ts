import { API_URL } from '../config';
import { Quiz, Response } from '../types';
import { axios } from '../utils/custom-axios';

type GetAllQuizArgument = {
  name?: string;
  subject?: string;
  chapter?: string;
};
type GetAllQuizResponse = {
  total: number;
  result: Quiz[];
};
const getAll = (query: GetAllQuizArgument, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}quiz?pagination=false\
${query.name ? `&name=${query.name}` : ''}\
${query.subject ? `&subject=${query.subject}` : ''}\
${query.chapter ? `&chapter=${query.chapter}` : ''}`;

  return axios.get<Response<GetAllQuizResponse>>(queryString);
};

type GetAllQuizPaginatedArgument = {
  name?: string;
  subject?: string;
  chapter?: string;
  pageNumber?: number;
  pageSize?: number;
};
type GetAllQuizPaginatedArgumentResponse = {
  total: number;
  pageCount: number;
  result: Quiz[];
};
const getAllPaginated = (query: GetAllQuizPaginatedArgument, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}quiz?pagination=true\
${query.name ? `&name=${query.name}` : ''}\
${query.subject ? `&subject=${query.subject}` : ''}\
${query.chapter ? `&chapter=${query.chapter}` : ''}\
${query.pageNumber !== undefined ? `&pageNumber=${query.pageNumber}` : ''}\
${query.pageSize !== undefined ? `&pageSize=${query.pageSize}` : ''}`;

  return axios.get<Response<GetAllQuizPaginatedArgumentResponse>>(queryString);
};

const getById = (id: string, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}quiz/${id}`;

  return axios.get<Response<Quiz>>(queryString);
};

type CreateQuizArgument = {
  name: string;
  description: string;
  subject: string;
  chapter: string;
  duration: number;
  potentialQuestions: string[];
  sampleSize: number;
};
type EditArgument = {
  name: string;
  description: string;
  subject: string;
  chapter: string;
  isHidden?: boolean;
  duration: number;
  potentialQuestions: string[];
  sampleSize: number;
};
const create = (data: CreateQuizArgument) => {
  return axios.post<Response<Quiz>>(`${API_URL}admin/quiz`, data);
};

const deleteById = (id: string) => {
  return axios.delete<Response<Quiz>>(`${API_URL}admin/quiz/${id}`);
};

const edit = (id: string, data: EditArgument) => {
  const bodyQuery = `${API_URL}admin/quiz/${id}`;

  return axios.patch<Response<Quiz>>(bodyQuery, data);
};

const QuizService = { getAll, getAllPaginated, getById, create, deleteById, edit };
export default QuizService;
