import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameArenaProps {
    analogy: string;
    attempts: number;
    maxAttempts: number;
    onGuess: (guess: string) => void;
    onExit: () => void;
    isShake?: boolean;
}

const GameArena: React.FC<GameArenaProps> = ({
    analogy,
    attempts,
    maxAttempts,
    onGuess,
    onExit,
    isShake
}) => {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim().length >= 2) {
            onGuess(inputValue);
            setInputValue("");
        }
    };

    return (
        <div className={cn(
            "w-full max-w-2xl mx-auto flex flex-col h-full min-h-[600px] relative animate-in fade-in zoom-in-95 duration-500 transition-colors duration-1000",
            attempts > 0 ? "bg-red-950/20" : "" // Atmosphere darkens slightly on failure
        )}>

            {/* Top Bar: Life Counter & Exit */}
            <div className="absolute top-0 w-full flex justify-between items-center p-6 z-20">
                <div className="flex gap-2">
                    {[...Array(maxAttempts)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-3 w-3 rounded-full border border-zinc-700 transition-all duration-500",
                                i < (maxAttempts - attempts)
                                    ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" // Remaining Life (Filled)
                                    : "bg-transparent border-red-500/50" // Lost Life (Hollow)
                            )}
                        />
                    ))}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onExit}
                    className="rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 space-y-16">

                {/* The Analogy Message */}
                <div className="w-full text-center space-y-6">
                    <p className="font-serif text-3xl md:text-5xl text-zinc-100 leading-tight tracking-tight drop-shadow-xl selection:bg-purple-500/30">
                        {analogy}
                    </p>
                </div>

                {/* Minimalist Input Area */}
                <div className={cn("w-full max-w-md transition-all duration-300", isShake && "animate-shake")}>
                    <form onSubmit={handleSubmit} className="relative group flex flex-col items-center gap-8">

                        {/* The Line Input */}
                        <div className="relative w-full">
                            <input
                                autoFocus
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type your answer..."
                                className="w-full bg-transparent border-b-2 border-white/20 text-center py-4 text-3xl md:text-4xl font-bold text-[#2A2A2A] placeholder:text-zinc-800 focus:outline-none focus:border-white transition-all caret-purple-500 invert"
                            // Note: text-[#2A2A2A] is Deep Charcoal. invert makes it look good on dark mode if we want light text, 
                            // but request said "Deep Charcoal" which implies light background? 
                            // Wait, the overall app is Dark Mode. Deep Charcoal on Black is invisible. 
                            // Assuming they meant "Deep Charcoal" if it was light mode, OR they want a high contrast text. 
                            // Let's stick to White text for dark mode, but maybe a "Charcoal" gray input line.
                            // Correction: "Letters appear in Deep Charcoal". This strongly implies a Light Mode or paper-like container?
                            // OR it's a stylistic choice on a light card. 
                            // Given the app is dark, sticking to White/Light Grey text is safer for accessibility, 
                            // unless we render a 'paper' strip. 
                            // Let's use a very light grey (almost white) which matches "Deep Charcoal" inverted logic.
                            />
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={inputValue.trim().length < 2}
                            className="h-14 px-10 rounded-full bg-white text-black hover:bg-zinc-200 disabled:opacity-0 disabled:translate-y-4 transition-all duration-500 font-bold text-lg tracking-wide shadow-xl flex items-center gap-2"
                        >
                            <span>SUBMIT</span>
                            <ArrowRight className="h-5 w-5" />
                        </Button>

                        {/* Feedback Badge */}
                        {attempts > 0 && (
                            <div className="absolute -bottom-12 animate-pulse text-red-400 font-mono text-xs tracking-widest uppercase">
                                {maxAttempts - attempts} attempts remaining
                            </div>
                        )}
                    </form>
                </div>

            </div>
        </div>
    );
};

export default GameArena;
