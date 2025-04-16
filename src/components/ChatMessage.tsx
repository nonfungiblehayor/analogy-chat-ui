
import React from 'react';
import { Bot, Loader2, User } from 'lucide-react';

export type MessageType = {
  id: string;
  question: string;
  response: string;
  created_at: string;
  conversation_id: string
};

interface ChatMessageProps {
  message: any;
}

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div 
      className={`py-8 px-4 space-y-10 ${isUser ? 'bg-chat-user-bg' : 'bg-chat-bot-bg'}`}
    >
      <div className="mx-auto px-2 flex max-w-3xl items-center justify-end gap-4">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isUser ? 'bg-gray-300' : 'bg-analogyai-primary'}`}>
            <User className="h-5 w-5 text-white" />
        </div>
        <div className="flex">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p>{message.question}</p>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-3xl items-start gap-4">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gray-300`}>
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {message?.response !== "" && <p>{message.response.replace(/\*\*/g, '')}</p>}
            {message?.response === "" && 
            <div className='flex items-center gap-x-4'>
              <span className='text-[12px] text-opacity-75'>Reasoning and generating analogy.....</span>
              <Loader2 className="h-5 w-5 animate-spin text-analogyai-primary" />
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
