import React, { useState, useRef, useEffect, useContext } from "react";
import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import ChatMessage, { MessageType } from "./ChatMessage";
import ChatInput from "./ChatInput";
import WelcomeScreen from "./WelcomeScreen";
import { Loader2 } from "lucide-react";
import { useUser } from "@/context/Usercontext";
import toast from "react-hot-toast";
import { useAddConversation } from "@/hooks/supabase/conversation";
import { useNavigate } from "react-router-dom";
import { addQuestion } from "@/hooks/supabase/question";
import { generateAnalogy } from "@/lib/utils";

const ChatInterface = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { appUser } = useUser()
  const addConversation  = useAddConversation()
  const navigate = useNavigate()
  const testWithExample = (example: string) => {
    if (appUser) {
      handleSendMessage(example)
    } else {
      toast.error("Sign in to start  a conversation");
    }
  };
  const askQuestion = addQuestion()
  const simulateResponse = async (message: string, id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const response = await generateAnalogy(message);
    if(response) {
      askQuestion.mutateAsync({conversation_id: id, response: response?.answer, question: message}).then((response) => {
        navigate(`/conversation/${response.conversation_id}`)
      })
    }
    // setMessages((prev) => [
    //   ...prev,
    //   {
    //     id: Date.now().toString(),
    //     content: response?.answer,
    //     role: "assistant",
    //     timestamp: new Date(),
    //   },
    // ]);
  };
  const handleSendMessage = async(content: string) => {
    setIsLoading(true)
    // const newMessage: MessageType = {
    //   id: Date.now().toString(),
    //   content,
    //   role: "user",
    //   timestamp: new Date(),
    // };
    const question = await generateAnalogy(content)
    if(question) {
      addConversation.mutateAsync({user_id: appUser.id, title: question?.title.split(':')[0].trim(), initial_message: content}).then((response) => {
        simulateResponse(content, response.id).finally(() => {
          setIsLoading(false)
        })
      })
      // setMessages((prev) => [...prev, newMessage]);
    }
  };
  return (
    <div className="flex h-screen flex-col">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
              <WelcomeScreen onExampleClick={testWithExample} />
          </div>
          {appUser && (
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          )}
      </div>
    </div>
  );
};

export default ChatInterface;
