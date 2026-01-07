import React, { useState, useEffect, useRef } from 'react';
import { RiddleQuestion, PlayerStats } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import { Lightbulb, CheckCircle2, XCircle, X, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameArenaProps {
    question: RiddleQuestion;
    questionNumber: number;
    totalQuestions: number;
    stats: PlayerStats;
    onAnswer: (isCorrect: boolean, timeTaken: number) => void;
    onUseHint: () => boolean;
    onExit: () => void;
}

const GameArena: React.FC<GameArenaProps> = ({
    question,
    questionNumber,
    totalQuestions,
    stats,
    onAnswer,
    onUseHint,
    onExit
}) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [hintsShown, setHintsShown] = useState<number>(0);
    const [shakeId, setShakeId] = useState<string | null>(null);
    const [displayedText, setDisplayedText] = useState("");

    // Typewriter effect ref
    const textIndex = useRef(0);
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);

    // Reset state on new question
    useEffect(() => {
        setSelectedOption(null);
        setIsRevealed(false);
        setShakeId(null);
        setHintsShown(0);

        // Start Typewriter effect for the Word
        setDisplayedText("");
        textIndex.current = 0;

        const typeWord = () => {
            const chars = question.riddle.split("");
            if (textIndex.current < chars.length) {
                setDisplayedText(prev => prev + chars[textIndex.current]);
                textIndex.current++;
                typingTimeout.current = setTimeout(typeWord, 50); // Faster for single word
            }
        };

        // Initial delay
        typingTimeout.current = setTimeout(typeWord, 300);

        return () => {
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
        };
    }, [question]);

    const handleOptionSelect = (optionId: string, isCorrect: boolean) => {
        if (isRevealed) return;

        setSelectedOption(optionId);
        setIsRevealed(true);

        if (isCorrect) {
            setTimeout(() => {
                onAnswer(true, 0); // Simplified time tracking
            }, 1200);
        } else {
            setShakeId(optionId);
            setTimeout(() => {
                onAnswer(false, 0);
            }, 2000);
        }
    };

    const triggerHint = () => {
        if (hintsShown < 3 && stats.hintsUsed < 5) {
            const success = onUseHint();
            if (success) {
                setHintsShown(prev => prev + 1);
            }
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-between max-w-4xl mx-auto py-4 relative">

            {/* Minimal Header */}
            <div className="flex justify-between items-center px-4 mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onExit}
                        className="h-8 w-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700"
                    >
                        <X className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-2">
                        <div className="h-[2px] w-16 sm:w-24 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-analogyai-secondary transition-all duration-1000"
                                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                            />
                        </div>
                        <span className="font-mono text-xs text-zinc-500">
                            {questionNumber} / <span className="text-zinc-700">{totalQuestions}</span>
                        </span>
                    </div>
                </div>

                <div className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full border transition-colors",
                    stats.hintsUsed >= 5 ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"
                )}>
                    <Lightbulb className="h-3 w-3" />
                    <span className="text-[10px] font-bold tracking-wider">
                        Hints: {stats.hintsUsed}/5
                    </span>
                </div>
            </div>

            {/* Hero Section: The Word */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] mb-8 relative">
                <div className="text-center space-y-2 max-w-2xl px-6 relative">
                    <p className="text-xs text-analogyai-secondary font-bold uppercase tracking-[0.2em] mb-4 opacity-70 animate-pulse">
                        Define
                    </p>
                    {/* The Word */}
                    <h1 className="font-black text-4xl md:text-7xl text-white tracking-tighter leading-none drop-shadow-2xl">
                        {displayedText}
                        <span className="animate-pulse inline-block w-3 h-10 bg-analogyai-secondary ml-1 align-middle opacity-50" />
                    </h1>
                </div>

                {/* Hint System Floating Near Text */}
                <div className="mt-12 relative">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={triggerHint}
                        disabled={hintsShown >= 3 || stats.hintsUsed >= 5 || isRevealed}
                        className={cn(
                            "rounded-full gap-2 transition-all duration-300 border",
                            hintsShown > 0
                                ? "bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
                                : "bg-cyan-950/30 border-cyan-500/30 text-cyan-300 hover:bg-cyan-400 hover:text-black hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:scale-105"
                        )}
                    >
                        {hintsShown > 0 ? (
                            <span className="text-xs">Context Clue ({hintsShown})</span>
                        ) : (
                            <><Maximize2 className="h-4 w-4 animate-pulse" /> <span className="text-xs font-bold drop-shadow-md">Expand Context</span></>
                        )}
                    </Button>

                    {/* Unfolding Hint Paper */}
                    {hintsShown > 0 && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 z-30">
                            {question.hints.slice(0, hintsShown).map((hint, idx) => (
                                <div
                                    key={idx}
                                    className="bg-[#E0F7FA] text-cyan-950 p-4 text-sm font-medium shadow-xl border border-cyan-200 mb-[-10px] last:mb-0 relative animate-unfold origin-top rounded-sm"
                                    style={{ animationDelay: `${idx * 0.1}s`, zIndex: 10 - idx }}
                                >
                                    <div className="absolute top-2 left-2 text-cyan-500/50">
                                        <Lightbulb className="h-3 w-3" />
                                    </div>
                                    <p className="pl-6 italic">"{hint}"</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Options Grid - Explanations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8 px-4 items-stretch">
                {question.options.map((option, index) => {
                    const isSelected = selectedOption === option.id;
                    const isRight = option.isCorrect;
                    const isShaking = shakeId === option.id;

                    // Base: Dark "Obsidian Glass"
                    let cardClass = "bg-white/5 backdrop-blur-md border-2 border-white/10 hover:border-analogyai-secondary/50 hover:bg-white/10 hover:shadow-[0_0_20px_-5px_rgba(34,211,238,0.4)] hover:-translate-y-1 shadow-lg";
                    let textClass = "text-zinc-300 group-hover:text-white transition-colors duration-300";

                    if (isRevealed) {
                        if (isRight) {
                            // Correct: Cyan Prism
                            cardClass = "bg-gradient-to-br from-cyan-400/20 via-cyan-900/40 to-black border-2 border-cyan-400 text-cyan-100 shadow-[0_0_50px_-10px_rgba(34,211,238,0.8)] scale-105 z-20";
                            textClass = "text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]";
                        } else if (isSelected && !isRight) {
                            // Wrong: Rose Fracture
                            cardClass = "bg-gradient-to-br from-rose-500/10 to-black border-rose-500/50 text-rose-200 opacity-90 grayscale-[0.2]";
                            textClass = "text-rose-200";
                        } else {
                            // Unselected: Dimmed
                            cardClass = "opacity-20 grayscale scale-95 border-transparent";
                        }
                    }

                    return (
                        <button
                            key={option.id}
                            disabled={isRevealed}
                            onClick={() => handleOptionSelect(option.id, isRight)}
                            className={cn(
                                "group relative min-h-[100px] md:min-h-[140px] w-full rounded-2xl md:rounded-3xl border-2 transition-all duration-300 p-4 md:p-6 flex flex-col items-center justify-center gap-2 overflow-hidden outline-none focus:ring-4 focus:ring-analogyai-secondary/30",
                                cardClass,
                                isShaking && "animate-shake ring-2 ring-rose-500"
                            )}
                        >
                            {/* Status Icon */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                                {isRevealed ? (
                                    isRight ? <CheckCircle2 className="h-6 w-6 text-cyan-400" /> :
                                        (isSelected && <XCircle className="h-6 w-6 text-rose-400" />)
                                ) : (
                                    <div className="h-2 w-2 rounded-full bg-white/20 group-hover:bg-analogyai-secondary transition-colors" />
                                )}
                            </div>

                            <span className={cn(
                                "text-sm md:text-lg font-medium leading-relaxed text-center transition-colors",
                                textClass
                            )}>
                                {option.text}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default GameArena;
