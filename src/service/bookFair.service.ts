import { API_URL } from '../config';
import { Book, BookFacultyType } from '../types';
import { TBookFairSearchParams, TStudentInfo } from '../types/bookFair';
import { axios } from '../utils/custom-axios';

type GetBooksPaginatedRequest = {
  title?: string;
  faculty?: BookFacultyType;
  pageNumber?: number;
  pageSize?: number;
};
type GetBooksPaginatedResponse = {
  total: number;
  pageCount: number;
  pageSize: number;
  pageNumber: number;
  books: Book[];
};
const getAllPaginated = (params: GetBooksPaginatedRequest, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}bookfair/books`;

  return axios.get<GetBooksPaginatedResponse>(queryString, {
    params: {
      title: params.title || undefined,
      faculty: params.faculty || undefined,
      pageNumber: params.pageNumber || 1,
      pageSize: params.pageSize || 10,
    },
  });
};

const getById = (id: string, admin = false) => {
  const queryString = `${API_URL}${admin ? 'admin/' : ''}bookFair/books/${id}`;

  return axios.get<Book>(queryString);
};

type BookInformation = {
  title: string;
  faculty: BookFacultyType;
  thumbnail: string;
  totalAmount: number;
};
const edit = (id: string, body: FormData) => {
  const queryString = `${API_URL}admin/bookFair/books/${id}`;

  return axios.patch<Book>(queryString, body as Partial<BookInformation>);
};

const create = (data: FormData) => {
  const queryString = `${API_URL}admin/bookFair/books`;

  return axios.post<Book>(queryString, data as unknown as BookInformation);
};

const deleteById = (id: string) => {
  return axios.delete<void>(`${API_URL}admin/bookFair/books/${id}`);
};

type Recipient = {
  bookReceiptId: string;
  email: string;
  givenAt: string;
};

type GetRecipientRequest = {
  id: string;
  pageNumber: number;
  pageSize: number;
};
type GetRecipientResponse = {
  total: number;
  pageCount: number;
  pageSize: number;
  receipts: Recipient[];
};
const getRecipients = (request: GetRecipientRequest) => {
  return axios.get<GetRecipientResponse>(`${API_URL}admin/bookFair/books/${request.id}/receipts`, {
    params: {
      pageNumber: request.pageNumber || 1,
      pageSize: request.pageSize,
    },
  });
};

const giveBook = (id: string, studentId: string, giveAmount: number) => {
  return axios.post<void>(`${API_URL}admin/bookFair/books/${id}/give`, { studentId, giveAmount });
};

const revokeRecipient = (recipientId: string) => {
  return axios.post<void>(`${API_URL}admin/bookfair/receipts/${recipientId}/revoke`);
};

type GetReceivedBooksResponse = {
  total: number;
  books: [
    {
      bookReceiptId: string;
      bookId: string;
      year: number;
      title: string;
      faculty: BookFacultyType;
      thumbnail: string;
      receivedAt: string;
    }
  ];
};

const getReceivedBooks = async (): Promise<GetReceivedBooksResponse> => {
  const response = await axios.get<GetReceivedBooksResponse>(`${API_URL}bookfair/received`);
  return response.data;
};

type SearchByParamResponse = {
  total: number;
  pageCount: number;
  pageSize: number;
  pageNumber: number;
  books: Book[];
};

const searchByParam = async (
  { title, faculties }: TBookFairSearchParams,
  pageNumber: number,
  pageSize: number
): Promise<SearchByParamResponse> => {
  const response = await axios.get<SearchByParamResponse>(`${API_URL}bookfair/books`, {
    params: {
      title: title.length ? encodeURIComponent(title) : undefined,
      faculty: faculties.length ? faculties.join(',') : undefined,
      pageNumber,
      pageSize,
    },
  });
  return response.data;
};

const registerBookfair = (studentInfo: TStudentInfo) => {
  return axios.post(`${API_URL}bookfair/register`, studentInfo);
};

export type GetMyRegistrationInfoResponse = {
  email: string;
  isCheckedIn: boolean;
  familyAndMiddleName: string;
  givenName: string;
  studentId: string;
  phoneNumber: string;
  schoolYear: string;
  registeredAt: string;
};

const getMyRegistrationInfo = async (): Promise<GetMyRegistrationInfoResponse> => {
  const response = await axios.get<GetMyRegistrationInfoResponse>(
    `${API_URL}bookfair/registration`
  );
  return response.data;
};

const getStudentRegistrationInfo = async (
  studentId: string
): Promise<GetMyRegistrationInfoResponse> => {
  const response = await axios.get<GetMyRegistrationInfoResponse>(
    `${API_URL}admin/bookfair/registration/${studentId}`
  );
  return response.data;
};

const checkinBookfair = (studentInfo: { studentId: string }) => {
  return axios.post(`${API_URL}admin/bookfair/checkin`, studentInfo);
};

type GetCheckinListResponse = {
  total: number;
  pageCount: number;
  pageSize: number;
  registrations: (GetMyRegistrationInfoResponse & { checkedInAt: string })[];
};

const getCheckinList = (request: Omit<GetRecipientRequest, 'id'>) => {
  return axios.get<GetCheckinListResponse>(`${API_URL}admin/bookFair/checkin`, {
    params: {
      pageNumber: request.pageNumber || 1,
      pageSize: request.pageSize,
    },
  });
};

const BookFairService = {
  getAllPaginated,
  getById,
  create,
  deleteById,
  edit,
  getRecipients,
  giveBook,
  revokeRecipient,
  getReceivedBooks,
  searchByParam,
  registerBookfair,
  getMyRegistrationInfo,
  getStudentRegistrationInfo,
  checkinBookfair,
  getCheckinList,
};

export default BookFairService;
