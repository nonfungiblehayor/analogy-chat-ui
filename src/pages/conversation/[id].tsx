import ChatInput from "@/components/ChatInput"
import ChatMessage, { MessageType } from "@/components/ChatMessage"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/Usercontext"
import { addQuestion, deleteQuestion, getQuestions, } from "@/hooks/supabase/question"
import { generateAnalogy } from "@/lib/utils"
import { Loader2, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog"
import { useDeleteConversation, useGetConversation } from "@/hooks/supabase/conversation"

const ConversationChat = () => {
  const [isLoadingMsg, setIsLoading] = useState(false)
  const param = useParams()
  const { data: questions, error: questionError, isLoading } = getQuestions(param.id as string)
  const { data: conversation } = useGetConversation(param.id as string)
  const askQuestion = addQuestion()
  const deleteMsg = deleteQuestion()
  const deleteConversation = useDeleteConversation()
  const { appUser } = useUser()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    if (questions) {
      setMessages(questions)
    }
  }, [questions])

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const simulateResponse = async (message: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const response = await generateAnalogy(message);
    if (response) {
      askQuestion.mutateAsync({ conversation_id: param?.id as string, response: response?.answer, question: message })
    }
  };

  const handleSendMessage = (content: string) => {
    setIsLoading(true);
    const newMessage: MessageType = {
      id: "loading-" + Date.now(),
      conversation_id: param.id as string,
      question: content,
      response: "",
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    simulateResponse(content).finally(() => {
      setIsLoading(false)
    })
  }

  const handleDeleteConversation = async () => {
    if (messages.length > 0) {
      for (const message of messages) {
        if (!message.id.startsWith('loading-')) {
          await deleteMsg.mutateAsync(message?.id)
        }
      }
    }
    await deleteConversation.mutateAsync(param.id as string).then(() => {
      navigate("/")
    })
  }

  return (
    <div className="flex flex-col h-screen relative">
      {appUser && appUser?.id === conversation?.user_id && (
        <div className="absolute top-4 right-4 z-20 md:flex hidden">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-50 hover:text-red-600 border-dashed">
                Delete Conversation <Trash2 className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="space-y-4">
                <p className="text-zinc-600">Are you sure you want to delete this conversation? This action cannot be undone.</p>
                <div className="flex items-center justify-end gap-x-4">
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleDeleteConversation} variant="destructive">Delete</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div ref={containerRef} className="flex-1 overflow-y-auto scroll-smooth">
        <div className="pb-32 pt-4">
          {questionError && (
            <div className="flex py-16 items-center justify-center text-red-500 text-sm">
              {questionError.toString()}
            </div>
          )}

          {isLoading && (
            <div className="w-full py-16 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-analogyai-primary" />
            </div>
          )}

          {questions && questions.length === 0 && !isLoadingMsg && (
            <div className="w-full py-16 flex items-center justify-center text-zinc-500">
              Conversation is empty
            </div>
          )}

          {messages?.map((message) => (
            <ChatMessage
              id={param.id as string}
              questionsLength={messages.filter(m => !m.id.startsWith('loading-')).length}
              key={message.id}
              message={message}
            />
          ))}
        </div>

        {appUser && appUser?.id === conversation?.user_id && (
          <div className="fixed bottom-28 right-4 z-20 md:hidden">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="icon" className="h-12 w-12 rounded-full shadow-lg">
                  <Trash2 className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className="space-y-4">
                  <p className="text-zinc-600">Are you sure you want to delete this conversation?</p>
                  <div className="flex items-center justify-end gap-x-4">
                    <DialogClose asChild>
                      <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleDeleteConversation} variant="destructive">Delete</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="flex-none p-4 bg-background border-t">
        {appUser && (
          <div className="max-w-3xl mx-auto">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoadingMsg}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ConversationChat