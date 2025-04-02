import ChatInput from "@/components/ChatInput"
import ChatMessage, { MessageType } from "@/components/ChatMessage"
import { useUser } from "@/context/Usercontext"
import { useGetConversation } from "@/hooks/supabase/conversation"
import { addQuestion, getQuestions } from "@/hooks/supabase/question"
import { Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

const ConversationChat = () => {
    const [isLoading, setIsLoading] = useState(false)
    const param = useParams()
    const { data: questions, error: questionError,} = getQuestions(param.id)
    const askQuestion = addQuestion()
    const { appUser } = useUser()
    const [messages, setMessages] = useState<MessageType[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const generateAnalogy = (message: string): string => {
      if (message.toLowerCase().includes("quantum")) {
        return "Think of quantum entanglement like this: Imagine you have two magical coins. When you flip one coin, the other coin instantly knows and matches it, no matter how far apart they are. It's like they're connected by an invisible thread that works instantly, regardless of distance. This is similar to quantum entanglement where particles can be connected in ways that defy our everyday understanding of physics.";
      } else if (message.toLowerCase().includes("blockchain")) {
        return "Blockchain is like a shared notebook that everyone can see. When someone writes in it, everyone gets a copy of the same note. If someone tries to change an old note, everyone would notice because their copy would be different. Everyone agrees to only add new notes, never change old ones, and this way, we all have the same trusted record of everything that's been written.";
      } else if (message.toLowerCase().includes("relativity")) {
        return "Imagine you're on a train moving at a constant speed, and you throw a ball straight up. To you, the ball goes straight up and comes back down to your hand. But to someone watching from outside, the ball traces a curved path as the train moves forward. Both of you are right about what you see! This is similar to how the theory of relativity works - measurements like time and space can be different depending on your frame of reference, and both can be correct.";
      } else {
        return "Let me explain that using an analogy: Imagine your question is like exploring a new city. You start at one familiar point (what you already know) and gradually discover new streets and landmarks (new concepts) that connect to your starting point. This makes the unfamiliar territory easier to navigate because you're building on existing knowledge. Similarly, analogies help us understand complex topics by relating them to familiar experiences.";
      }
    };
    const simulateResponse = async (message: string) => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
  
      // Create the analogy response based on the user message
      const response = generateAnalogy(message);
      if(response) {
        askQuestion.mutateAsync({conversation_id: param?.id, response: response, question: message})
      }
  
      // Add the AI response to the messages
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: response,
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
  
      setIsLoading(false);
    };
    const handleSendMessage = (content: string) => {
      const newMessage: MessageType = {
        id: Date.now().toString(),
        content,
        role: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      simulateResponse(content);
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
        {questions?.length > 0 && questions?.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
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
        )}
        </div>
        {appUser && (
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          )}
      </div>
    )
}
export default ConversationChat