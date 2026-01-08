import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import { ArrowLeft, Sparkles, Trophy, Gamepad2, Brain, Puzzle, Target, Medal, Star, Flame, RefreshCcw, CheckCircle2, AlertCircle } from "lucide-react";
import { generateGameContent, evaluateAnalogy } from "@/lib/utils";

import LeaderboardOverlay from "@/components/LeaderboardOverlay";

import { supabase } from '@/hooks/supabase';
import { cn } from '@/lib/utils';

// Game Skeletons (to be implemented fully later)
const SelectionView = ({ onOpenLeaderboard }: { onOpenLeaderboard: () => void }) => {
    const { setActiveGame, userStats, gameTopic, setGameTopic } = useGame();
    const [previewLeaderboard, setPreviewLeaderboard] = useState<{ rank: number; name: string; score: number; avatar: string; initials: string; }[]>([]);

    useEffect(() => {
        const fetchPreview = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                // Fetch all recent scores to aggregate
                const { data: lbGames } = await supabase
                    .from('normal_games')
                    .select('user_score, user_id')
                    .order('created_at', { ascending: false })
                    .limit(1000);

                if (lbGames && lbGames.length > 0) {
                    // Aggregate Scores
                    const userMap = new Map<string, number>();

                    lbGames.forEach(game => {
                        const currentScore = userMap.get(game.user_id) || 0;
                        userMap.set(game.user_id, currentScore + (game.user_score || 0));
                    });

                    // Sort by Total Score
                    const sortedUsers = Array.from(userMap.entries())
                        .map(([userId, totalScore]) => ({ userId, totalScore }))
                        .sort((a, b) => b.totalScore - a.totalScore)
                        .slice(0, 3);

                    const userIds = sortedUsers.map(u => u.userId);
                    const { data: profiles } = await supabase
                        .from('profiles')
                        .select('id, username, avatar_url')
                        .in('id', userIds);

                    const formattedLb = sortedUsers.map((entry, i) => {
                        const { userId, totalScore } = entry;
                        const profile = profiles?.find(p => p.id === userId);
                        const isCurrentUser = user ? userId === user.id : false;

                        let displayName = "Unknown Player";
                        if (isCurrentUser) displayName = "You";
                        else if (profile?.username) displayName = profile.username;
                        else displayName = `Player ${userId.slice(0, 4)}`;

                        return {
                            rank: i + 1,
                            name: displayName,
                            score: totalScore,
                            avatar: ["bg-purple-500", "bg-cyan-500", "bg-rose-500", "bg-amber-500", "bg-emerald-500"][i % 5],
                            initials: (profile?.username || displayName).substring(0, 2).toUpperCase()
                        };
                    });
                    setPreviewLeaderboard(formattedLb);
                }
            } catch (error) {
                console.error("Error fetching preview leaderboard:", error);
            }
        };
        fetchPreview();
    }, []);

    return (
        <div className="relative z-10 flex flex-col items-center max-w-5xl w-full px-6 text-center space-y-8 animate-in zoom-in-95 fade-in duration-700 pb-10 pt-8">
            {/* User Stats - Compacted */}
            <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-[2rem] p-4 backdrop-blur-md shadow-2xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 min-w-max">
                        <div className="h-14 w-14 flex-shrink-0 rounded-full bg-gradient-to-br from-analogyai-primary to-analogyai-secondary p-0.5">
                            <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center">
                                <Trophy className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="text-left whitespace-nowrap">
                            <h2 className="text-xl font-black text-white leading-none">Arena Profile</h2>
                            <p className="text-zinc-500 text-xs font-medium">Rank #{userStats.rank} Overall</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-8 items-center justify-between md:justify-center bg-white/5 rounded-2xl px-3 md:px-8 py-3 border border-white/5 w-full md:w-auto">
                        <div className="text-center min-w-[60px]">
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Points</p>
                            <p className="text-xl font-black text-analogyai-primary">{userStats.points}</p>
                        </div>
                        <div className="h-8 w-px bg-white/10 hidden md:block" />
                        <div className="text-center min-w-[60px]">
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Solved</p>
                            <p className="text-xl font-black text-analogyai-secondary">{userStats.gamesPlayed}</p>
                        </div>
                        <div className="h-8 w-px bg-white/10 hidden md:block" />
                        <div className="text-center min-w-[60px]">
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Streak</p>
                            <div className="flex items-center gap-1 justify-center">
                                <Flame className="h-4 w-4 text-orange-500" />
                                <p className="text-xl font-black text-white">{userStats.streak}</p>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-white/10 hidden md:block" />
                        <div className="text-center min-w-[60px]">
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-0.5 whitespace-nowrap">Win Streak</p>
                            <div className="flex items-center gap-1 justify-center">
                                <Target className="h-4 w-4 text-green-500" />
                                <p className="text-xl font-black text-white">{userStats.winningStreak}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {userStats.achievements.slice(0, 2).map((ach, i) => (
                            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-400">
                                <Medal className="h-3 w-3 text-yellow-500" />
                                {ach.toUpperCase()}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-analogyai-primary/10 border border-analogyai-primary/20 text-analogyai-primary text-xs font-bold uppercase tracking-widest">
                    <Sparkles className="h-3 w-3" />
                    Analogy Arena
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">
                    <span className="bg-gradient-to-r from-analogyai-primary to-analogyai-secondary bg-clip-text text-transparent uppercase">
                        Select Your Challenge
                    </span>
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-4">
                {/* Mode 1: Reverse Riddle */}
                <div
                    onClick={() => setActiveGame('reverse-riddle')}
                    className="group relative p-6 rounded-3xl bg-[#121212] border border-white/10 backdrop-blur-xl hover:bg-white/5 transition-all cursor-pointer hover:border-analogyai-primary/50 hover:-translate-y-2 shadow-xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10 pointer-events-none" />

                    {/* Image Thumbnail */}
                    <div className="w-full h-40 mb-6 rounded-2xl overflow-hidden relative z-0">
                        <img
                            src="/reverse_riddle_thumb.png"
                            alt="Reverse Riddle"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                        />
                    </div>

                    <div className="relative z-20">
                        <h3 className="text-2xl font-bold text-left mb-2 text-white group-hover:text-analogyai-primary transition-colors">Reverse Riddle</h3>
                        <p className="text-sm text-zinc-400 text-left leading-relaxed">
                            The AI describes a concept. You guess the word.
                        </p>
                    </div>
                </div>

                {/* Mode 2: Context Challenge */}
                <div
                    onClick={() => setActiveGame('context-challenge')}
                    className="group relative p-6 rounded-3xl bg-[#121212] border border-white/10 backdrop-blur-xl hover:bg-white/5 transition-all cursor-pointer hover:border-analogyai-secondary/50 hover:-translate-y-2 shadow-xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10 pointer-events-none" />

                    {/* Image Thumbnail */}
                    <div className="w-full h-40 mb-6 rounded-2xl overflow-hidden relative z-0">
                        <img
                            src="/context_challenge_thumb.png"
                            alt="Context Challenge"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                        />
                    </div>

                    <div className="relative z-20">
                        <h3 className="text-2xl font-bold text-left mb-2 text-white group-hover:text-analogyai-secondary transition-colors">Context Challenge</h3>
                        <p className="text-sm text-zinc-400 text-left leading-relaxed">
                            AI gives you a word. You explain it with an analogy.
                        </p>
                    </div>
                </div>

                {/* Mode 3: Wordle */}
                <div
                    onClick={() => setActiveGame('wordle')}
                    className="group relative p-6 rounded-3xl bg-[#121212] border border-white/10 backdrop-blur-xl hover:bg-white/5 transition-all cursor-pointer hover:border-purple-500/50 hover:-translate-y-2 shadow-xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10 pointer-events-none" />

                    {/* Image Thumbnail */}
                    <div className="w-full h-40 mb-6 rounded-2xl overflow-hidden relative z-0">
                        <img
                            src="/wordle_thumb.png"
                            alt="Wordle"
                            className="w-full h-full object-contain bg-black/50 group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                        />
                    </div>

                    <div className="relative z-20">
                        <h3 className="text-2xl font-bold text-left mb-2 text-white group-hover:text-purple-500 transition-colors">Daily Cipher</h3>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="relative inline-flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live</span>
                            <span className="text-[10px] font-mono text-zinc-500 ml-auto">14h 20m rem.</span>
                        </div>
                        <p className="text-sm text-zinc-400 text-left leading-relaxed">
                            Attempt the daily cryptographic challenge. One chance.
                        </p>
                    </div>
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                        <span className="text-xs font-bold text-purple-500 uppercase tracking-wider flex items-center gap-1">
                            Attempt <ArrowLeft className="h-3 w-3 rotate-180" />
                        </span>
                    </div>
                </div>
            </div>

            {/* Global Leaderboard Card (Ticket Style) */}
            <div className="w-full mt-6 grid grid-cols-1">
                <div
                    onClick={onOpenLeaderboard}
                    className="group relative p-6 rounded-3xl bg-[#121212] border border-white/10 backdrop-blur-xl hover:bg-white/5 transition-all cursor-pointer hover:border-yellow-500/50 hover:-translate-y-2 shadow-xl overflow-hidden"
                >
                    <div className="absolute -top-[1px] left-8 right-8 border-t-2 border-dashed border-zinc-400/30" />

                    <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="w-full md:w-1/3 flex items-center gap-4">
                            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-yellow-500 to-amber-700 p-0.5 flex-shrink-0">
                                <div className="w-full h-full rounded-full bg-[#121212] flex items-center justify-center">
                                    <Trophy className="h-6 w-6 text-yellow-500" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-left text-white group-hover:text-yellow-500 transition-colors">Hall of Fame</h3>
                                <p className="text-xs text-zinc-400 text-left">Top Global Rankings</p>
                            </div>
                        </div>

                        {/* Preview List */}
                        <div className="w-full md:w-2/3 space-y-2">
                            {previewLeaderboard.length > 0 ? previewLeaderboard.map((user) => (
                                <div key={user.rank} className="flex items-center justify-between bg-white/5 rounded-full px-4 py-2 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white", user.avatar)}>
                                            {user.initials}
                                        </div>
                                        <span className={cn("text-sm font-bold", user.name === "You" ? "text-analogyai-primary" : "text-zinc-300")}>
                                            {user.name}
                                        </span>
                                    </div>
                                    <span className="font-mono text-xs text-zinc-500">{user.score} pts</span>
                                </div>
                            )) : (
                                <div className="text-center text-xs text-zinc-500 py-2">Loading top scores...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


import ReverseRiddleGame from "@/components/games/reverse-riddle/ReverseRiddleGame";
import ContextChallengeGame from "@/components/games/context-challenge/ContextChallengeGame";
import WordleGame from "@/components/games/wordle/WordleGame";







const GameView = () => {
    const { setGameMode, activeGame } = useGame();
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const renderActiveGame = () => {
        switch (activeGame) {
            case 'reverse-riddle': return <ReverseRiddleGame />;
            case 'context-challenge': return <ContextChallengeGame />;
            case 'wordle': return <WordleGame />;
            default: return <SelectionView onOpenLeaderboard={() => setShowLeaderboard(true)} />;
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-start bg-[#0a0a0a] text-white overflow-y-auto overflow-x-hidden pb-5 scroll-smooth">
            {/* Background Vibe: Animated Gradients + Dot Grid */}
            <div className="fixed inset-0 bg-dot-grid pointer-events-none opacity-80" />
            <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-analogyai-primary/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-analogyai-secondary/10 rounded-full blur-[150px] animate-pulse delay-700 pointer-events-none" />

            {/* Top Navigation - Sticky Header with Backdrop */}
            <div className="sticky top-0 z-50 w-full flex items-center px-6 py-2 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent backdrop-blur-md mb-4 animate-in slide-in-from-top-4 duration-500">
                <Button
                    variant="ghost"
                    onClick={() => setGameMode(false)}
                    className="group gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all rounded-full px-4 h-10 border border-zinc-800 shadow-lg hover:scale-105 active:scale-95"
                >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium text-xs uppercase tracking-wider">Leave Arena</span>
                </Button>
            </div>

            {renderActiveGame()}

            <LeaderboardOverlay isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />

        </div>
    );
};

const Loader2 = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path d="m16.2 16.2 2.9 2.9" /><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path d="m4.9 4.9 2.9 2.9" />
    </svg>
)

export default GameView;
