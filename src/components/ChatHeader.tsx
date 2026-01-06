import { Menu, MessageSquarePlus, Gamepad } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import ChatSidebar from './ChatSidebar';
import { useUser } from '@/context/Usercontext';
import { useGame } from '@/context/GameContext';

type requiredProps = {
  newChat: () => void
}
const ChatHeader = ({ newChat }: requiredProps) => {
  const { appUser } = useUser()
  const { setGameMode } = useGame()
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
            <ChatSidebar newChat={newChat} />
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold">
          <span className="text-analogyai-primary">Analogy</span>AI
        </h1>
      </div>
      {appUser && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setGameMode(true)}
            className="text-analogyai-secondary hover:text-analogyai-primary hover:bg-analogyai-light/50 flex items-center gap-1.5 px-2"
          >
            <Gamepad className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Play</span>
          </Button>
          <div className="h-4 w-px bg-zinc-200 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={newChat}
            className="hover:bg-zinc-100"
          >
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
        </div>
      )}
    </header>
  );
};

export default ChatHeader;
