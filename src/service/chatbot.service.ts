import { API_URL } from '../config';
import { Response } from '../types';
import { TConversation, TMessage } from '../types/chatbot';
import { axios } from '../utils/custom-axios';

type GetAllConversationsResponse = TConversation[];

const getAllConversations = async () => {
  const queryString = `${API_URL}rag/conversations`;

  const response = await axios.get<Response<GetAllConversationsResponse>>(queryString);
  return response.data.payload;
};

type GetConversationByIdRequest = {
  conversationId: string;
};

type GetConversationByIdResponse = {
  conversation: TConversation;
  messages: TMessage[];
};

const getConversationById = async (params: GetConversationByIdRequest) => {
  const queryString = `${API_URL}rag/conversations/${params.conversationId}`;

  const response = await axios.get<Response<GetConversationByIdResponse>>(queryString);
  return response.data.payload;
};

type UpdateOrCreateConversionRequest = {
  conversationId?: string;
  title?: string;
  query: string;
};

type UpdateOrCreateConversationResponse = {
  title: string;
  conversationId: string;
  messages: TMessage[];
};

const updateOrCreateConversation = async (params: UpdateOrCreateConversionRequest) => {
  const queryString = `${API_URL}rag/conversations`;

  const response = await axios.post<Response<UpdateOrCreateConversationResponse>>(
    queryString,
    params
  );
  return response.data.payload;
};

type GenerateMessageRequest = {
  senderMessageId: string;
  receiverMessageId: string;
};

const generateMessage = async (params: GenerateMessageRequest) => {
  const queryString = `${API_URL}rag/message`;
  const token = JSON.parse(localStorage.getItem('token') ?? '');

  const response = await fetch(queryString, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(response.body?.toString());
  }

  return response.body;
};

const ChatbotService = {
  getAllConversations,
  getConversationById,
  updateOrCreateConversation,
  generateMessage,
};

export default ChatbotService;
