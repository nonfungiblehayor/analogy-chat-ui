
import React, { useState, useRef, useEffect, useContext } from 'react';
import ChatHeader from './ChatHeader';
import ChatSidebar from './ChatSidebar';
import ChatMessage, { MessageType } from './ChatMessage';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import { Loader2 } from 'lucide-react';
import { User } from '@/context/Usercontext';
import toast from 'react-hot-toast';

const ChatInterface = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useContext(User)
  const testWithExample = () => {
    if(user) {

    } else {
      toast.error("Sign in to start  a conversation")
    }
  }
  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Simulated response, in a real app this would call your AI service
  const simulateResponse = async (message: string) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create the analogy response based on the user message
    const response = generateAnalogy(message);
    
    // Add the AI response to the messages
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      },
    ]);
    
    setIsLoading(false);
  };

  // Simple function to generate an analogy response
  // In a real application, this would call your AI service
  const generateAnalogy = (message: string): string => {
    if (message.toLowerCase().includes('quantum')) {
      return "Think of quantum entanglement like this: Imagine you have two magical coins. When you flip one coin, the other coin instantly knows and matches it, no matter how far apart they are. It's like they're connected by an invisible thread that works instantly, regardless of distance. This is similar to quantum entanglement where particles can be connected in ways that defy our everyday understanding of physics.";
    } else if (message.toLowerCase().includes('blockchain')) {
      return "Blockchain is like a shared notebook that everyone can see. When someone writes in it, everyone gets a copy of the same note. If someone tries to change an old note, everyone would notice because their copy would be different. Everyone agrees to only add new notes, never change old ones, and this way, we all have the same trusted record of everything that's been written.";
    } else if (message.toLowerCase().includes('relativity')) {
      return "Imagine you're on a train moving at a constant speed, and you throw a ball straight up. To you, the ball goes straight up and comes back down to your hand. But to someone watching from outside, the ball traces a curved path as the train moves forward. Both of you are right about what you see! This is similar to how the theory of relativity works - measurements like time and space can be different depending on your frame of reference, and both can be correct.";
    } else {
      return "Let me explain that using an analogy: Imagine your question is like exploring a new city. You start at one familiar point (what you already know) and gradually discover new streets and landmarks (new concepts) that connect to your starting point. This makes the unfamiliar territory easier to navigate because you're building on existing knowledge. Similarly, analogies help us understand complex topics by relating them to familiar experiences.";
    }
  };

  const handleSendMessage = (content: string) => {
    const newMessage: MessageType = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    simulateResponse(content);
  };

  return (
    <div className="flex h-screen flex-col">
      <ChatHeader />
      
      <div className="flex flex-1 overflow-hidden pt-[57px] md:pt-0">
        {/* Sidebar - hidden on mobile, visible on desktop */}
        <div className="hidden w-80 shrink-0 border-r md:block">
          <div className="h-full">
            <ChatSidebar />
          </div>
        </div>
        
        {/* Main chat area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <WelcomeScreen onExampleClick={testWithExample} />
            ) : (
              <div>
                {messages.map((message) => (
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
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          {user &&  <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
