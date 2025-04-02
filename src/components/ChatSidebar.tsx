import React, { useContext } from "react";
import { Plus, MessageCircle, Trash, Loader2, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/context/Usercontext";
import { GoogleIcon } from "./ui/Icons";
import { GoogleAuth } from "@/lib/utils";
import { useGetHistory } from "@/hooks/supabase/conversation";
import { useNavigate, useParams } from "react-router-dom";

type Conversation = {
  id: string;
  title: string;
  date: string;
};
type requiredProps = {
  newChat: () => void
}
const ChatSidebar = ({ newChat }: requiredProps) => {
  // Example conversations
  const { appUser } = useUser()
  const param = useParams()
  const handleSignin = () => {
    GoogleAuth();
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
      <ScrollArea className="h-[calc(90vh-160px)]">
        {isLoading && <div className="w-full flex flex-col gap-y-2 items-center"> Loading conversations < Loader /> </div>}
        {history && history?.length === 0 && <div className="w-full flex justify-center py-4">No conversations</div>}
        {historyError && <div className="w-full flex items-center py-4">{historyError.message}</div>}
        {history && history.length > 0 && (
          <div className="space-y-1">
          {history.map((conversation) => (
            <Button
              key={conversation.id}
              onClick={() => openConversation(conversation.id)}
              variant="ghost"
              className={`flex w-full justify-start gap-2 text-left hover:bg-chat-hover ${param.id === conversation.id && "bg-chat-hover"}`}
            >
              <MessageCircle className="h-4 w-4" />
              <div className="flex-1 truncate">{conversation.title}</div>
            </Button>
          ))}
          </div>
        )}
      </ScrollArea>
    </div>
      )}
      {/* <div className="mt-auto">
        <Button
          variant="outline"
          className="flex w-full items-center gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash className="h-4 w-4" />
          Clear conversations
        </Button>
      </div> */}
    </div>
  );
};

export default ChatSidebar;
