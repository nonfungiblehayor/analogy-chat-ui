import { useState, useEffect } from 'react';
import { Bot, CopyIcon, Loader2, RefreshCcw, Trash2Icon, User, Gamepad2 } from 'lucide-react';
import { Button } from './ui/button';
import { deleteQuestion, useUpdateResponse } from '@/hooks/supabase/question';
import { useDeleteConversation } from '@/hooks/supabase/conversation';
import { useNavigate } from 'react-router-dom';
import { generateAnalogy } from '@/lib/utils';
import { useGame } from '@/context/GameContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type MessageType = {
  id: string;
  question: string;
  response: string;
  created_at: string;
  conversation_id: string
};

interface ChatMessageProps {
  message: any;
  questionsLength: number;
  id: string;
}

const ChatMessage = ({ message, questionsLength, id }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const { setGameMode, setGameTopic } = useGame();
  const deleteMessage = deleteQuestion()
  const updateAnswer = useUpdateResponse()
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState<{ id: string, state: boolean }>()
  const deleteConversation = useDeleteConversation()

  const handleDeleteConversation = () => {
    deleteConversation.mutateAsync(id).then(() => {
      navigate("/")
    })
  }

  const [isCopy, setCopy] = useState<{ id: string, state: boolean }>()

  useEffect(() => {
    if (isCopy?.state) {
      const timer = setTimeout(() => {
        setCopy(undefined);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isCopy]);

  const handleCopyResponse = (msgId: string) => {
    navigator.clipboard.writeText(message?.response).then(() => {
      setCopy({ id: msgId, state: true })
    })
  }

  const handleDeleteQuestion = () => {
    deleteMessage.mutateAsync(message?.id)
    if (questionsLength === 1) {
      handleDeleteConversation()
    }
  }

  const handleGenerateNewAnswer = async (msg) => {
    setLoading({ id: msg?.id, state: true })
    const response = await generateAnalogy(msg?.question)
    if (response) {
      updateAnswer.mutateAsync({ question_id: msg?.id, newResponse: response?.answer }).finally(() => {
        setLoading(undefined)
      })
    }
  }

  return (
    <div className={`py-8 px-4 space-y-10 ${isUser ? 'bg-chat-user-bg' : 'bg-chat-bot-bg'}`}>
      <div className="mx-auto px-2 flex max-w-3xl items-center justify-end gap-4">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isUser ? 'bg-gray-300' : 'bg-analogyai-primary'}`}>
          <User className="h-5 w-5 text-white" />
        </div>
        <div className="flex px-14">
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
            {message?.response && isLoading?.id !== message?.id && (
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.response}
                </ReactMarkdown>
              </div>
            )}

            {!isUser && message?.response && isLoading?.id !== message?.id && (
              <div className="mt-4 p-4 rounded-2xl bg-analogyai-primary/10 border border-analogyai-primary/20 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <p className="text-sm font-medium text-analogyai-secondary">
                  Think you've got it? Bet you can't solve this riddle about {message.question.split(' ').slice(-1)[0].replace(/[?]/g, '')}...
                </p>
                <Button
                  onClick={() => {
                    setGameTopic(message.question.split(' ').slice(-1)[0].replace(/[?]/g, ''));
                    setGameMode(true);
                  }}
                  className="bg-analogyai-primary hover:bg-analogyai-secondary text-white gap-2 rounded-xl shadow-lg shadow-analogyai-primary/20 transition-all hover:scale-105"
                >
                  <Gamepad2 className="h-4 w-4" />
                  Try me
                </Button>
              </div>
            )}

            {message?.response && isLoading?.id !== message?.id && (
              <div className='flex items-center gap-x-4 mt-4'>
                <Button onClick={() => handleCopyResponse(message?.id)} disabled={isCopy?.state} className='bg-transparent hover:bg-transparent p-0'>
                  {isCopy?.id === message?.id && isCopy?.state ? <span className='text-black text-sm'>copied!!!</span> : <CopyIcon stroke='black' />}
                </Button>
                <Button onClick={handleDeleteQuestion} className='bg-transparent hover:bg-transparent p-0'>
                  <Trash2Icon stroke='black' />
                </Button>
                <Button onClick={() => handleGenerateNewAnswer(message)} className='bg-transparent hover:bg-transparent p-0'>
                  <RefreshCcw stroke='black' />
                </Button>
              </div>
            )}

            {(isLoading?.id === message.id && isLoading?.state) || !message?.response ? (
              <div className='flex items-center gap-x-4 mt-4'>
                <span className='text-sm text-zinc-500'>Reasoning and generating analogy.....</span>
                <Loader2 className="h-5 w-5 animate-spin text-analogyai-primary" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
