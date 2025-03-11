
import React from 'react';
import { Plus, MessageCircle, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

type Conversation = {
  id: string;
  title: string;
  date: string;
};

const ChatSidebar = () => {
  // Example conversations
  const conversations: Conversation[] = [
    { id: '1', title: 'Explain quantum physics', date: '2023-06-15' },
    { id: '2', title: 'How does DNA work?', date: '2023-06-14' },
    { id: '3', title: 'Tell me about black holes', date: '2023-06-13' },
  ];

  return (
    <div className="flex h-full w-full flex-col bg-sidebar p-3">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          <span className="text-analogyai-primary">Analogy</span>AI
        </h1>
      </div>
      
      <Button 
        className="mb-4 flex w-full items-center gap-2 bg-analogyai-primary hover:bg-analogyai-secondary" 
        onClick={() => console.log('New conversation')}
      >
        <Plus className="h-4 w-4" />
        New Conversation
      </Button>
      
      <div className="mb-4">
        <h2 className="mb-2 text-sm font-medium text-sidebar-foreground">Conversations</h2>
        <ScrollArea className="h-[calc(100vh-160px)]">
          <div className="space-y-1">
            {conversations.map((conv) => (
              <Button
                key={conv.id}
                variant="ghost"
                className="flex w-full justify-start gap-2 text-left hover:bg-chat-hover"
              >
                <MessageCircle className="h-4 w-4" />
                <div className="flex-1 truncate">{conv.title}</div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <div className="mt-auto">
        <Button 
          variant="outline" 
          className="flex w-full items-center gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash className="h-4 w-4" />
          Clear conversations
        </Button>
      </div>
    </div>
  );
};

export default ChatSidebar;
