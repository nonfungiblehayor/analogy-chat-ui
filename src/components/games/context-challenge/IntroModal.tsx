import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface IntroModalProps {
    onStart: () => void;
    onExit: () => void;
}

const IntroModal: React.FC<IntroModalProps> = ({ onStart, onExit }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
            <div
                className={cn(
                    "w-full max-w-lg bg-black/40 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden transition-all duration-500 transform pointer-events-auto",
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}
            >
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={onExit}
                    className="absolute top-4 left-4 z-20 h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white p-0"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-analogyai-secondary/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-6 mt-8">
                    {/* Thumbnail Image */}
                    <div className="h-40 w-full bg-black rounded-2xl mb-2 shadow-lg border border-zinc-100 overflow-hidden relative">
                        <img
                            src="/context_challenge_thumb.png"
                            alt="Context Challenge"
                            className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Title & Copy */}
                    <div className="space-y-4 max-w-sm">
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            Define the Abstract
                        </h2>
                        <p className="text-zinc-300 text-base leading-relaxed font-medium">
                            A specific word will be presented.
                            Choose the explanation that best captures its essence.
                        </p>
                    </div>

                    {/* Action */}
                    <Button
                        onClick={onStart}
                        className="w-full h-14 bg-analogyai-secondary hover:brightness-110 text-white text-lg font-bold rounded-xl shadow-lg shadow-analogyai-secondary/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Start Challenge <Sparkles className="ml-2 h-5 w-5" />
                    </Button>

                    <p className="text-xs text-slate-400 font-medium">
                        Precision. Nuance. Context.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default IntroModal;
