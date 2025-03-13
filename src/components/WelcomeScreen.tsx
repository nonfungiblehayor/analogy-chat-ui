
import React, { useContext, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Lightbulb, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from './ui/Icons';
import { GoogleAuth } from '@/lib/utils';
import { User } from '@/context/Usercontext';
interface WelcomeScreenProps {
  onExampleClick: (example: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
  const user = useContext(User)
  const handleSignin = () => {
    GoogleAuth()
  }
  const examples = [
    { 
      icon: <Zap className="h-6 w-6 text-analogyai-primary" />,  
      text: "Explain quantum entanglement", 
    },
    { 
      icon: <Lightbulb className="h-6 w-6 text-analogyai-primary" />, 
      text: "How does blockchain work?", 
    },
    { 
      icon: <BookOpen className="h-6 w-6 text-analogyai-primary" />, 
      text: "What's the theory of relativity?", 
    },
  ];
  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">
          <span className="text-analogyai-primary">Analogy</span>AI
        </h1>
        <p className="text-lg text-muted-foreground">
          Explaining complex concepts through simple analogies
        </p>
      </div>

      <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-1 md:grid-cols-3">
        {examples.map((example, idx) => (
          <Card  onClick={() => onExampleClick(example.text)} key={idx} className="transition-all hover:border-analogyai-primary hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              {example.icon}
              <CardTitle className="text-sm">Example {idx + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="ghost" 
                className="h-auto w-full justify-start p-2 text-left"
              >
                {example.text}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 mb-4 max-w-md text-center">
        <p className="text-sm text-muted-foreground">
          Powered by advanced AI technology to create intuitive and relatable analogies that simplify complex topics.
        </p>
      </div>
      {!user && 
            <Button 
            className="sticky bottom-4 flex lg:hidden w-full items-center gap-2 bg-analogyai-primary hover:bg-analogyai-secondary" 
            onClick={() => handleSignin()}
          >
             Sign in to start a conversation 
             <span className='bg-[#FFFFFF] p-[5px] rounded-[8px]'>
              <GoogleIcon />
            </span>
    </Button>
      }
    </div>
  );
};

export default WelcomeScreen;
