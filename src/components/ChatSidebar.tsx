import { Plus, MessageCircle, Loader, Trash2, Share2, Share, Copy, Gamepad } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/context/Usercontext";
import { GoogleIcon } from "./ui/Icons";
import { GoogleAuth } from "@/lib/utils";
import { useGetHistory } from "@/hooks/supabase/conversation";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import { useGame } from "@/context/GameContext";


type requiredProps = {
  newChat: () => void
}
const ChatSidebar = ({ newChat }: requiredProps) => {
  const { appUser } = useUser()
  const { setGameMode } = useGame()
  const param = useParams()
  const handleSignin = () => {
    GoogleAuth()
  };

  const navigate = useNavigate()
  const openConversation = (id: string) => {
    navigate(`/conversation/${id}`)
  }

  const {
    data: history,
    error: historyError,
    isLoading,
  } = useGetHistory(appUser?.id);
  const [isCopy, setCopy] = useState<boolean>()
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/conversation/${param.id}`).then(() => {
      setCopy(true)
    })
  }
  const handleShareLink = () => {
    navigator.share({
      title: "Conversation on Analogy AI",
      url: `${window.location.origin}/conversation/${param.id}`
    })
  }
  function callAfterCopy(fn) {
    setTimeout(fn, 800)
  }
  callAfterCopy(() => {
    setCopy(undefined)
  },)
  return (
    <div className="flex h-full w-full flex-col bg-sidebar p-3">
      <div className="mb-4 flex items-center justify-between">
        <h1
          className="text-xl font-semibold"
        >
          <span className="text-analogyai-primary">Analogy</span>AI
        </h1>
        {appUser && (
          <img
            className="w-6 h-6 rounded-[10px]"
            src={appUser.identities[0]?.identity_data?.avatar_url}
            alt="user image"
          />
        )}
      </div>
      {appUser ? (
        <div className="space-y-2 mb-4">
          <Button
            className="flex w-full items-center gap-2 bg-analogyai-primary hover:bg-analogyai-secondary transition-all hover:scale-[1.02] active:scale-[0.98]"
            onClick={newChat}
          >
            <Plus className="h-4 w-4" />
            New Conversation
          </Button>
          <Button
            variant="outline"
            className="flex w-full items-center gap-2 border-analogyai-primary/30 text-analogyai-primary hover:bg-analogyai-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98] group"
            onClick={() => setGameMode(true)}
          >
            <Gamepad className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            Play Analogy Game
          </Button>
        </div>
      ) : (
        <Button
          className="mb-4 flex w-full items-center gap-2 bg-analogyai-primary hover:bg-analogyai-secondary"
          onClick={() => handleSignin()}
        >
          Sign in to start a conversation
          <span className="bg-[#FFFFFF] p-[5px] rounded-[8px]">
            <GoogleIcon />
          </span>
        </Button>
      )}

      {appUser && (
        <div className="mb-4">
          <h2 className="mb-2 text-sm font-medium text-sidebar-foreground px-2">
            Conversations
          </h2>
          <ScrollArea className="h-[calc(100vh-250px)]">
            {isLoading && <div className="w-full flex flex-col gap-y-2 items-center py-4"> Loading < Loader className="animate-spin" /> </div>}
            {history && history?.length === 0 && <div className="w-full flex justify-center py-8 text-muted-foreground text-sm italic">No conversations yet</div>}
            {historyError && <div className="w-full flex items-center py-4 text-destructive">{historyError.message}</div>}
            {history && history.length > 0 && (
              <div className="space-y-1">
                {history.map((conversation) => (
                  <div key={conversation.id} className="flex flex-col group/item relative">
                    <div className="flex justify-between w-full items-center">
                      <Button
                        onClick={() => openConversation(conversation.id)}
                        variant="ghost"
                        className={`flex w-full justify-start gap-3 text-left hover:bg-chat-hover px-3 py-6 ${param.id === conversation.id ? "bg-chat-hover text-analogyai-primary" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <MessageCircle className="h-4 w-4 shrink-0" />
                        <div className="flex-1 truncate text-sm font-medium">{conversation.title}</div>
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center cursor-pointer p-2 hover:bg-zinc-200 rounded-md">
                            <Share2 className="w-3.5 h-3.5 text-muted-foreground hover:text-analogyai-primary" />
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            Share public link to chat
                          </DialogHeader>
                          <div className="flex items-center gap-x-2 mb-2">
                            <Input value={`${window.location.origin}/conversation/${param.id}`} readOnly />
                            <Button disabled={isCopy} onClick={handleCopyLink} className="shrink-0">
                              {isCopy ? "Copied" : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                          <div className="flex items-center w-full justify-end gap-x-4">
                            <DialogClose asChild>
                              <Button variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleShareLink} className="gap-2">
                              <Share className="h-4 w-4" />
                              Share link
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
