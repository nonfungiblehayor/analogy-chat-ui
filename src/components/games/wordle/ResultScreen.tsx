import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, ArrowLeft, Send, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGame } from '@/context/GameContext';

interface ResultScreenProps {
    status: 'won' | 'lost';
    analogy: string;
    answer: string;
    attempts: number;
    onBack: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
    status,
    analogy,
    answer,
    attempts,
    onBack,
}) => {
    const [copied, setCopied] = useState(false);
    const { userStats } = useGame();

    // Scoring logic helper to display correct points
    const points = status === 'won' ? (attempts === 0 ? 10 : attempts === 1 ? 5 : 3) : 0;

    // Mock Rank Movement
    const oldRank = 1054;
    const newRank = status === 'won' ? 890 : 1054;

    const handleShare = () => {
        const text = `Daily Cipher #42\n${status === 'won' ? 'Solved in ' + (attempts + 1) + ' Attempt(s) 🎯' : 'Failed 💀'}\n\nPlayed on Analogy AI`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[600px] p-6 text-center animate-in zoom-in-95 fade-in duration-500">

            {/* Top: Score Indicator */}
            <div className="mb-12 scale-150">
                <div className={cn(
                    "text-6xl font-black tracking-tighter drop-shadow-2xl",
                    status === 'won' ? "text-emerald-400" : "text-zinc-600"
                )}>
                    {status === 'won' ? `+${points}` : "+0"} <span className="text-2xl font-bold tracking-normal align-middle opacity-50">PTS</span>
                </div>
            </div>

            {/* Middle: Rank Movement Card */}
            <div className="w-full max-w-sm bg-[#121212] border border-white/10 rounded-2xl p-6 mb-12 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Rank Update</h3>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-zinc-500">#{oldRank}</span>
                        <span className="text-[10px] text-zinc-600 uppercase">Previous</span>
                    </div>

                    <div className={cn(
                        "h-0.5 flex-1 mx-4 relative",
                        status === 'won' ? "bg-emerald-500/50" : "bg-zinc-800"
                    )}>
                        <ArrowLeft className={cn(
                            "absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 rotate-180 transition-all duration-1000",
                            status === 'won' ? "text-emerald-500 translate-x-1" : "text-zinc-600"
                        )} />
                    </div>

                    <div className="flex flex-col items-center">
                        <span className={cn(
                            "text-3xl font-black",
                            status === 'won' ? "text-white" : "text-zinc-500"
                        )}>
                            #{newRank}
                        </span>
                        <span className={cn(
                            "text-[10px] uppercase font-bold",
                            status === 'won' ? "text-emerald-500" : "text-zinc-600"
                        )}>Current</span>
                    </div>
                </div>
            </div>

            {/* Share Ticket */}
            <div className="w-full bg-[#EFEFEF] text-black rounded-sm p-6 mb-8 relative shadow-2xl skew-y-1 transform transition-transform hover:skew-y-0 duration-500 origin-bottom-left max-w-xs mx-auto border-t-8 border-black">
                {/* Receipt Jagged Edge (Simulated with simple masking or svg if complex, simplified here) */}

                <div className="space-y-4 text-center font-mono">
                    <div className="border-b-2 border-dashed border-black/20 pb-4">
                        <h2 className="text-xl font-black uppercase tracking-tight">Daily Cipher #42</h2>
                        <p className="text-xs opacity-60">{new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="py-2 space-y-2">
                        <p className="text-sm font-bold uppercase">
                            {status === 'won' ? `Solved in ${attempts + 1} Attempt${attempts > 0 ? 's' : ''}` : "Mission Failed"}
                        </p>
                        <div className="text-4xl text-center">
                            {status === 'won' ? '🎯' : '💀'}
                        </div>
                    </div>

                    {/* Generative Pattern Placeholder */}
                    <div className="w-full h-16 bg-black/5 overflow-hidden flex items-center justify-center opacity-50">
                        <p className="text-[10px] -rotate-12 opacity-50">GEN-PATTERN-ID-X92</p>
                    </div>

                    <div className="pt-4 border-t-2 border-black">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-center">Analogy AI System</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full max-w-xs">
                <Button
                    onClick={handleShare}
                    className="w-full h-14 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                >
                    {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
                    <span>{copied ? "Copied to Clipboard" : "Share Result"}</span>
                </Button>

                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="w-full h-12 rounded-full text-zinc-500 hover:text-white hover:bg-white/5 font-medium"
                >
                    Return to Headquarters
                </Button>
            </div>

        </div>
    );
};

export default ResultScreen;
