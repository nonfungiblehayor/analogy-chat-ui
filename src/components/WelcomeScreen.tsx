
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Lightbulb, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onExampleClick: (example: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
  const examples = [
    { 
      icon: <Zap className="h-6 w-6 text-analogyai-primary" />,  
      text: "Explain quantum entanglement like I'm five", 
    },
    { 
      icon: <Lightbulb className="h-6 w-6 text-analogyai-primary" />, 
      text: "How does blockchain work in simple terms?", 
    },
    { 
      icon: <BookOpen className="h-6 w-6 text-analogyai-primary" />, 
      text: "What's the theory of relativity using a train analogy?", 
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
          <Card key={idx} className="transition-all hover:border-analogyai-primary hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              {example.icon}
              <CardTitle className="text-sm">Example {idx + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="ghost" 
                className="h-auto w-full justify-start p-2 text-left"
                onClick={() => onExampleClick(example.text)}
              >
                {example.text}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 max-w-md text-center">
        <p className="text-sm text-muted-foreground">
          Powered by advanced AI technology to create intuitive and relatable analogies that simplify complex topics.
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
