import { Plus, MessageCircle, Loader,  Trash2, Share2, Share, Copy,} from "lucide-react";
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


type requiredProps = {
  newChat: () => void
}
const ChatSidebar = ({ newChat }: requiredProps) => {
  const { appUser } = useUser()
  const param = useParams()
  console.log(param)
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
  }, )
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
        <Button
          className="mb-4 flex w-full items-center gap-2 bg-analogyai-primary hover:bg-analogyai-secondary"
          onClick={newChat}
        >
          <Plus className="h-4 w-4" />
          New Conversation
        </Button>
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
      <h2 className="mb-2 text-sm font-medium text-sidebar-foreground">
        Conversations
      </h2>
      <ScrollArea className="h-[calc(90vh-100px)]">
        {isLoading && <div className="w-full flex flex-col gap-y-2 items-center"> Loading conversations < Loader /> </div>}
        {history && history?.length === 0 && <div className="w-full flex justify-center py-4">No conversations</div>}
        {historyError && <div className="w-full flex items-center py-4">{historyError.message}</div>}
        {history && history.length > 0 && (
          <div className="space-y-1">
            {history.map((conversation) => (
            <div className="flex flex-col">
              <div className="flex items-center">
              <Button
                key={conversation.id}
                onClick={() => openConversation(conversation.id)}
                variant="ghost"
                className={`flex w-6/12 justify-start gap-2 text-left hover:bg-chat-hover ${param.id === conversation.id && "bg-chat-hover"}`}
              >
                <MessageCircle className="h-4 w-4" />
                <div className="flex-1 truncate">{conversation.title}</div>
              </Button>
              <Dialog>
                <DialogTrigger>
                  <div className="flex px-[4px] items-center cursor-pointer">
                    <Share2 className="w-3 h-3"/>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    Share public link to chat
                  </DialogHeader>
                  <div className="flex items-center gap-x-2 mb-2">
                    <Input value={`${window.location.origin}/conversation/${param.id}`}/>
                    <Button disabled={isCopy} onClick={handleCopyLink} className="">
                      {isCopy ? "Copied" : <Copy />}
                    </Button>
                  </div>
                  <div className="flex items-center w-full justify-end gap-x-4">
                    <DialogClose>
                      <Button className="bg-tranparent text-black border hover:bg-transparent focus:bg-transparent">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleShareLink} className="">
                      <Share />
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
