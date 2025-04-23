import { useState } from 'react';
import { Bot, CopyIcon, Loader2, RefreshCcw, Trash2Icon, User } from 'lucide-react';
import { Button } from './ui/button';
import { deleteQuestion, useUpdateResponse } from '@/hooks/supabase/question';
import { useDeleteConversation } from '@/hooks/supabase/conversation';
import { useNavigate } from 'react-router-dom';
import { generateAnalogy } from '@/lib/utils';

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

const ChatMessage = ({ message, questionsLength, id }) => {
  const isUser = message.role === 'user';
  const deleteMessage = deleteQuestion()
  const updateAnswer = useUpdateResponse()
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState<{id: string, state: boolean}>()
  const deleteConversation = useDeleteConversation()
  const handleDeleteConversation = () => {
    deleteConversation.mutateAsync(id).then(() => {
      navigate("/")
    })
  }
  const [isCopy, setCopy] = useState<{id: string, state: boolean}>()
  function callAfterCopy(fn) {
    setTimeout(fn, 800)
  }
  callAfterCopy(() => {
    setCopy(undefined)
  }, )
  const handleCopyResponse = (id: string) => {
    navigator.clipboard.writeText(message?.response).then(() => {
      setCopy({id: id, state: true})
    })
  }
  const handleDeleteQuestion = () => {
    deleteMessage.mutateAsync(message?.id)
    if(questionsLength === 1) {
      handleDeleteConversation()
    }
  }
  const handleGenerateNewAnswer = async(message) => {
      setLoading({id: message?.id, state: true})
      const response = await generateAnalogy(message?.question)
        if(response) {
        updateAnswer.mutateAsync({question_id: message?.id, newResponse: response?.answer}).finally(() => {
          setLoading(undefined)
        })
        }
  }
 
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
            {message?.response !== "" && isLoading?.id !== message?.id  && <p>{message.response.replace(/\*\*/g, '')}</p>}
            {message?.response !== "" && isLoading?.id !== message?.id  && <div className='flex items-center gap-x-4'>
              <Button onClick={() => handleCopyResponse(message?.id)} disabled={isCopy?.state} className='bg-transparent hover:bg-transparent p-0'> {isCopy?.id === message?.id && isCopy?.state ? <span className='text-[#000000]'>copied!!!</span> : <CopyIcon stroke='#000000'/>} </Button>
              <Button onClick={handleDeleteQuestion} className='bg-transparent hover:bg-transparent p-0'> <Trash2Icon stroke='#000000'/> </Button>
              <Button onClick={() => handleGenerateNewAnswer(message)} className='bg-transparent hover:bg-transparent p-0'> <RefreshCcw stroke='#000000'/> </Button>
              </div>
            }
            {message?.response !== "" && isLoading?.id === message.id && isLoading?.state && (
            <div className='flex items-center gap-x-4'>
              <span className='text-[12px] text-opacity-75'>Reasoning and generating analogy.....</span>
              <Loader2 className="h-5 w-5 animate-spin text-analogyai-primary" />
            </div>              
            )}
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
