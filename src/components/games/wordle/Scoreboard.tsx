import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowLeft, Lock, Star, Shield } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { cn } from '@/lib/utils';

interface ScoreboardProps {
    onPlay: () => void;
    onBack: () => void;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ onPlay, onBack }) => {
    const { userStats } = useGame();

    const topPlayers = [
        { rank: 1, name: "NexusPrime", score: 1450, status: "Solved" },
        { rank: 2, name: "CipherQueen", score: 1420, status: "Solved" },
        { rank: 3, name: "QuantumDrifter", score: 1380, status: "Solved" },
    ];

    return (
        <div className="w-full max-w-lg mx-auto flex flex-col items-center min-h-[600px] p-6 relative animate-in fade-in zoom-in-95 duration-500">

            {/* Header */}
            <div className="w-full flex justify-between items-center mb-8">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="h-10 w-10 p-0 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="text-right">
                    <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Global Link</h2>
                    <p className="text-xs text-zinc-600 font-mono">Synced {new Date().toLocaleTimeString()}</p>
                </div>
            </div>

            <div className="text-center space-y-2 mb-10">
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Today's Standings</h1>
                <p className="text-zinc-500 text-sm">Top operatives have already cracked the code.</p>
            </div>

            {/* Leaderboard Card */}
            <div className="w-full bg-[#121212] border border-white/10 rounded-3xl overflow-hidden relative mb-8">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

                <div className="divide-y divide-white/5">
                    {topPlayers.map((player) => (
                        <div key={player.rank} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs",
                                    player.rank === 1 ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50" :
                                        player.rank === 2 ? "bg-zinc-400/20 text-zinc-400 border border-zinc-400/50" :
                                            "bg-amber-700/20 text-amber-600 border border-amber-700/50"
                                )}>
                                    {player.rank}
                                </div>
                                <span className="font-bold text-zinc-200">{player.name}</span>
                            </div>
                            <div className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                                {player.score} PTS
                            </div>
                        </div>
                    ))}

                    {/* User's Rank (Greyed Out / Bottom) */}
                    <div className="flex items-center justify-between p-4 bg-zinc-900/50 border-t border-white/5">
                        <div className="flex items-center gap-4 opacity-50">
                            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-500 ml-1">
                                #{userStats.rank}
                            </div>
                            <span className="font-bold text-zinc-500">YOU</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock className="h-3 w-3 text-zinc-600" />
                            <span className="text-xs font-mono text-zinc-600">LOCKED</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <Button
                onClick={onPlay}
                className="w-full h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black text-lg tracking-wide shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                <Lock className="h-5 w-5 opacity-50" />
                <span>Unlock Puzzle</span>
            </Button>

        </div>
    );
};

export default Scoreboard;
