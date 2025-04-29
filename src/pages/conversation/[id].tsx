import ChatInput from "@/components/ChatInput"
import ChatMessage, { MessageType } from "@/components/ChatMessage"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/Usercontext"
import { addQuestion, deleteQuestion, getQuestions,} from "@/hooks/supabase/question"
import { generateAnalogy } from "@/lib/utils"
import { Loader2, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog"
import { useDeleteConversation, useGetConversation } from "@/hooks/supabase/conversation"

const ConversationChat = () => {
    const [isLoadingMsg, setIsLoading] = useState(false)
    const param = useParams()
    const { data: questions, error: questionError, isLoading} = getQuestions(param.id)
    const { data: conversation } = useGetConversation(param.id)
    const askQuestion = addQuestion()
    const deleteMsg = deleteQuestion()
    const deleteConversation = useDeleteConversation()
    const { appUser } = useUser()
    const navigate = useNavigate()
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
    const handleDeleteConversation = async() => {
      if(messages.length > 0) {
        messages.forEach(message => {
          deleteMsg.mutateAsync(message?.id)
        })
        await deleteConversation.mutateAsync(param.id).then(() => {
          navigate("/")
        })
      }
    }
    return (
      <div className="flex flex-col h-screen">
        {appUser && appUser?.id === conversation?.user_id && (
        <Dialog>
        <DialogTrigger>
          <div className="flex items-center justify-end sticky top-0 p-4">
          <Button className="bg-transparent hover:bg-transparent focus:bg-transparent w-[180px] border border-dotted border-red-500 text-red-500">
            Delete Conversation <Trash2 />
          </Button>
          </div>
        </DialogTrigger>
        <DialogContent>
            Are you sure you want to delete this conversation ?
            <div className="flex items-center w-full justify-end gap-x-4">
              <DialogClose>
                <Button className="bg-tranparent text-black border hover:bg-transparent focus:bg-transparent">Cancel</Button>
              </DialogClose>
              <Button onClick={handleDeleteConversation} className="bg-red-500 hover:bg-red-500 focus:bg-red-500">Delete</Button>
            </div>
        </DialogContent>
      </Dialog>
        )}
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