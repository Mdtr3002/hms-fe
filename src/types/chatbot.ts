export type TConversation = {
  _id: string;
  title: string;
  users: string[];
  createdAt: number;
};

export type TMessage = {
  _id: string;
  content: string;
  attachments: string[];
  conversationId: string;
  senderId: string;
  createdAt: number;
  updatedAt: number;
};
