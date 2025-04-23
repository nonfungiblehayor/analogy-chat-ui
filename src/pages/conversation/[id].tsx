import ChatInput from "@/components/ChatInput"
import ChatMessage, { MessageType } from "@/components/ChatMessage"
import { useUser } from "@/context/Usercontext"
import { addQuestion, getQuestions,} from "@/hooks/supabase/question"
import { generateAnalogy } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

const ConversationChat = () => {
    const [isLoadingMsg, setIsLoading] = useState(false)
    const param = useParams()
    const { data: questions, error: questionError, isLoading} = getQuestions(param.id)
    const askQuestion = addQuestion()
    const { appUser } = useUser()
    const [messages, setMessages] = useState<MessageType[]>([]);
    useEffect(() => {
      if(questions) {
        setMessages(questions)
      }
    }, [questions])
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const simulateResponse = async (message: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const response = await generateAnalogy(message);
      if(response) {
        askQuestion.mutateAsync({conversation_id: param?.id, response: response?.answer, question: message})
      }
    };
    const handleSendMessage = (content: string) => {
      setIsLoading(true);
      const newMessage: MessageType = {
        id: "",
        conversation_id: "",
        question: content,
        response: "",
        created_at: "",
      };
      setMessages((prev) => [...prev, newMessage]);
      simulateResponse(content).finally(() => {
        setIsLoading(false)
      })
    }
    const containerRef = useRef(null);
    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.scrollBy({ top: 150, behavior: 'smooth' });
      }
    }, [messages]);
    return (
      <div className="flex flex-col h-screen">
        <div ref={containerRef} className="h-[650px] overflow-y-scroll">
        {questionError && (
          <div className="flex py-16 items-center justify-center text-red-500 text-[14px]">
            {questionError.message}
          </div>
        )}
        {isLoading && (
          <div className="w-full py-16 flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
          </div>
        )}
        {questions && questions.length === 0 && (
              <div className="w-full py-16 flex items-center justify-center">
                  Conversation is empty !!!!!
              </div>
        )}
        {questions?.length > 0 && messages?.length > 0 && messages?.map((message) => (
          <ChatMessage id={param.id} questionsLength={questions?.length} key={message.id} message={message} />
        ))}
        {/* {isLoading && (
          <div className="py-8 px-4">
            <div className="mx-auto flex max-w-3xl items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-analogyai-primary">
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              </div>
              <div className="flex-1">
                <div className="h-6 w-1/3 animate-pulse rounded bg-muted"></div>
              </div>
            </div>
            <div ref={messagesEndRef} />
          </div>
        )} */}
        </div>
        {appUser && (
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoadingMsg}
            />
          )}
      </div>
    )
}
export default ConversationChat