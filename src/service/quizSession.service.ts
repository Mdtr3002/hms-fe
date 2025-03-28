import { API_URL } from '../config';
import { QuizSession, Response, UserAnswer } from '../types';
import { axios } from '../utils/custom-axios';

type GetAllQuizSessionArgument = {
  name?: string;
  subject?: string;
  chapter?: string;
};
type GetAllQuizSessionResponse = {
  total: number;
  result: QuizSession[];
};
const getAll = (query: GetAllQuizSessionArgument) => {
  const queryString = `${API_URL}quiz_session?pagination=false\
${query.name ? `&name=${query.name}` : ''}\
${query.subject ? `&subject=${query.subject}` : ''}\
${query.chapter ? `&chapter=${query.chapter}` : ''}`;

  return axios.get<Response<GetAllQuizSessionResponse>>(queryString);
};

type GetAllQuizSessionPaginatedArgument = {
  name?: string;
  subject?: string;
  chapter?: string;
  pageNumber?: number;
  pageSize?: number;
};
type GetAllQuizSessionPaginatedResponse = {
  total: number;
  pageCount: number;
  result: QuizSession[];
};
const getAllPaginated = (query: GetAllQuizSessionPaginatedArgument) => {
  const queryString = `${API_URL}quiz_session?pagination=true\
${query.name ? `&name=${query.name}` : ''}\
${query.subject ? `&subject=${query.subject}` : ''}\
${query.chapter ? `&chapter=${query.chapter}` : ''}\
${query.pageNumber !== undefined ? `&pageNumber=${query.pageNumber}` : ''}\
${query.pageSize !== undefined ? `&pageSize=${query.pageSize}` : ''}`;

  return axios.get<Response<GetAllQuizSessionPaginatedResponse>>(queryString);
};

const getById = (id: string) => {
  const queryString = `${API_URL}quiz_session/${id}`;

  return axios.get<Response<QuizSession>>(queryString);
};

const getByQuizId = (id: string) => {
  const queryString = `${API_URL}quiz_session/quiz/${id}`;

  return axios.get<Response<QuizSession | null>>(queryString);
};

const create = (quizId: string) => {
  return axios.post<Response<QuizSession>>(`${API_URL}quiz_session/${quizId}`);
};

const saveAnswer = (quizSessionId: string, questionId: string, answer: UserAnswer) => {
  return axios.post<Response<QuizSession>>(
    `${API_URL}quiz_session/${quizSessionId}/${questionId}/answer`,
    answer
  );
};

const submit = (quizSessionId: string) => {
  return axios.post<Response<QuizSession>>(`${API_URL}quiz_session/${quizSessionId}/submit`);
};

type Note = {
  note: string;
};

const note = (quizSessionId: string, questionId: string, content: Note = { note: '' }) => {
  return axios.post<Response<QuizSession>>(
    `${API_URL}quiz_session/${quizSessionId}/${questionId}/note`,
    content
  );
};

const QuizSessionService = {
  getAll,
  getAllPaginated,
  getById,
  getByQuizId,
  create,
  saveAnswer,
  submit,
  note,
};
export default QuizSessionService;
