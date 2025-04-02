
import React from 'react';
import { Menu, MessageSquarePlus } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import ChatSidebar from './ChatSidebar';
import { useUser } from '@/context/Usercontext';

type requiredProps = {
  newChat: () => void
}
const ChatHeader = ({ newChat }: requiredProps) => {
  const { appUser } = useUser()
  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between border-b bg-background p-3 md:hidden">
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <ChatSidebar newChat={newChat}/>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold">
          <span className="text-analogyai-primary">Analogy</span>AI
        </h1>
      </div>
      {appUser && (
      <div onClick={newChat}>
      <MessageSquarePlus />
    </div>
      )}
    </header>
  );
};

export default ChatHeader;
