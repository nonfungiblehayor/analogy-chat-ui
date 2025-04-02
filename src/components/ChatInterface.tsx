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
  const askQuestion = addQuestion()
  const simulateResponse = async (message: string, id: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const response = generateAnalogy(message);
    if(response) {
      askQuestion.mutateAsync({conversation_id: id, response: response, question: message}).then((response) => {
        navigate(`/conversation/${response.conversation_id}`)
      })
    }
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
    addConversation.mutateAsync({user_id: appUser.id, title: "Blockchain what is", initial_message: content}).then((response) => {
      simulateResponse(content, response.id);
    })
    setMessages((prev) => [...prev, newMessage]);
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
