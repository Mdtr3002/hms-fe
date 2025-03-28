import { API_URL } from '../config';
import { ConcreteQuestion, Question, QuestionType, Response } from '../types';
import { axios } from '../utils/custom-axios';

type GetAllQuestionArgument = {
  name?: string;
  subject?: string;
  chapter?: string;
};
type GetAllQuestionResponse = {
  total: number;
  result: Question[];
};
const getAll = (query: GetAllQuestionArgument, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}question?pagination=false\
${query.name ? `&name=${encodeURIComponent(query.name)}` : ''}\
${query.subject ? `&subject=${encodeURIComponent(query.subject)}` : ''}\
${query.chapter ? `&chapter=${encodeURIComponent(query.chapter)}` : ''}`;

  return axios.get<Response<GetAllQuestionResponse>>(queryString);
};

type GetAllQuestionPaginatedArgument = {
  name?: string;
  subject?: string;
  chapter?: string;
  pageNumber?: number;
  pageSize?: number;
};
type GetAllQuestionPaginatedResponse = {
  total: number;
  pageCount: number;
  result: Question[];
};
const getAllPaginated = (query: GetAllQuestionPaginatedArgument, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}question?pagination=true\
${query.name ? `&name=${encodeURIComponent(query.name)}` : ''}\
${query.subject ? `&subject=${encodeURIComponent(query.subject)}` : ''}\
${query.chapter ? `&chapter=${encodeURIComponent(query.chapter)}` : ''}\
${query.pageNumber !== undefined ? `&pageNumber=${query.pageNumber}` : ''}\
${query.pageSize !== undefined ? `&pageSize=${query.pageSize}` : ''}`;

  return axios.get<Response<GetAllQuestionPaginatedResponse>>(queryString);
};

const getById = (questionId: string, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}question/${questionId}`;

  return axios.get<Response<Question>>(queryString);
};

type PreviewQuestionArgument = {
  code: string;
  type: QuestionType;
  description: string;

  options?: string[];
  answerKeys?: number[];
  shuffleOptions?: boolean;

  explanation: string;
};
const preview = (arg: PreviewQuestionArgument) => {
  const queryString = `${API_URL}admin/question/preview`;
  return axios.post<Response<ConcreteQuestion>>(queryString, arg);
};

type CreateQuestionArgument = {
  name: string;
  code: string;
  subject: string;
  chapter: string;
  type: QuestionType;

  description: string;
  options?: string[];
  answerKeys?: number[];
  shuffleOptions?: boolean;

  explanation: string;
};
type EditArgument = {
  name: string;
  subject: string;
  chapter: string;
  description: string;
  code: string;
  options?: string[];
  answerKeys?: number[];
  shuffleOptions?: boolean;

  explanation: string;
};
const create = (arg: CreateQuestionArgument) => {
  return axios.post<Response<Question>>(`${API_URL}admin/question`, arg);
};

const deleteById = (questionId: string) => {
  return axios.delete<Response<Question>>(`${API_URL}admin/question/${questionId}`);
};

const edit = (questionId: string, data: EditArgument, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}question/${questionId}`;

  return axios.patch<Response<Question>>(queryString, data);
};

const QuestionService = { getAll, getAllPaginated, getById, preview, create, deleteById, edit };

export default QuestionService;
