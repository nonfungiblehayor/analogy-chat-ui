
import React, { useState } from 'react';
import { Loader2, SendIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t bg-background p-4 mb-10 md:mb-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="relative flex items-center">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="min-h-[60px] w-full resize-none pr-12"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 bg-analogyai-primary hover:bg-analogyai-secondary"
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : <SendIcon className="h-4 w-4" />} 
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          I explain complex topics using analogies to make them easier to understand.
        </p>
      </form>
    </div>
  );
};

export default ChatInput;
