import React, { useEffect, useState } from 'react';
import { X, Trophy, Crown, Calendar, Sparkles } from 'lucide-react';
import { supabase } from '@/hooks/supabase';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface LeaderboardEntry {
    rank: number;
    username: string;
    score: number;
    gameType: string;
    date: string;
    avatar_url?: string;
    initials: string;
    isCurrentUser: boolean;
}

interface LeaderboardOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const LeaderboardOverlay: React.FC<LeaderboardOverlayProps> = ({ isOpen, onClose }) => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchLeaderboard();
        }
    }, [isOpen]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // 1. Fetch top scores from normal_games
            // Fetch significantly more to calculate accurate cumulative totals
            const { data: games, error } = await supabase
                .from('normal_games')
                .select('user_score, user_id, game_type, created_at')
                .order('created_at', { ascending: false }) // Get recent games first for metadata
                .limit(1000);

            if (error) throw error;

            if (games && games.length > 0) {
                // Deduplicate & Aggregate: Sum scores per user
                const userMap = new Map<string, { totalScore: number; lastGame: any }>();

                games.forEach(game => {
                    const current = userMap.get(game.user_id) || { totalScore: 0, lastGame: game };
                    // If this game is newer (we sorted by date desc), it should already be the 'lastGame' if we didn't have one, 
                    // but since we iterate top-down, the first one encountered is the newest.

                    userMap.set(game.user_id, {
                        totalScore: current.totalScore + (game.user_score || 0),
                        lastGame: current.lastGame // Keep the first one found (newest)
                    });
                });

                // Convert to array and sort by TOTAL Score
                const sortedUsers = Array.from(userMap.entries())
                    .map(([userId, { totalScore, lastGame }]) => ({ userId, totalScore, lastGame }))
                    .sort((a, b) => b.totalScore - a.totalScore)
                    .slice(0, 50);

                // 2. Fetch profiles
                const userIds = sortedUsers.map(u => u.userId);
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, username, avatar_url')
                    .in('id', userIds);

                // 3. Merge data
                const formattedEntries: LeaderboardEntry[] = sortedUsers.map((entry, i) => {
                    const { userId, totalScore, lastGame } = entry;
                    const profile = profiles?.find(p => p.id === userId);
                    const isCurrentUser = user ? userId === user.id : false;

                    let displayName = "Unknown Player";
                    if (isCurrentUser) displayName = "You";
                    else if (profile?.username) displayName = profile.username;
                    else displayName = `Player ${userId.slice(0, 4)}`;

                    const dateObj = new Date(lastGame.created_at);
                    const formattedDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

                    return {
                        rank: i + 1,
                        username: displayName,
                        score: totalScore,
                        gameType: lastGame.game_type === 'riddle_game' ? 'Reverse Riddle' : 'Context Challenge',
                        date: formattedDate,
                        avatar_url: profile?.avatar_url,
                        initials: (profile?.username || displayName).substring(0, 2).toUpperCase(),
                        isCurrentUser
                    };
                });

                setEntries(formattedEntries);
            }
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-[#18181b] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="p-6 border-b border-white/5 bg-gradient-to-r from-analogyai-primary/10 to-transparent flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-700 flex items-center justify-center shadow-lg">
                            <Trophy className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white leading-none">Hall of Fame</h2>
                            <p className="text-sm text-zinc-400 font-medium mt-1">Top performers across all arenas</p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <Sparkles className="h-8 w-8 text-analogyai-primary animate-spin" />
                        </div>
                    ) : entries.length > 0 ? (
                        entries.map((entry) => (
                            <div
                                key={`${entry.rank}-${entry.username}-${entry.date}`}
                                className={cn(
                                    "group flex items-center gap-4 p-3 rounded-2xl border transition-all hover:scale-[1.01]",
                                    entry.isCurrentUser
                                        ? "bg-analogyai-primary/10 border-analogyai-primary/30"
                                        : "bg-white/5 border-white/5 hover:bg-white/10"
                                )}
                            >
                                {/* Rank */}
                                <div className={cn(
                                    "flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-sm md:text-base",
                                    entry.rank === 1 ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" :
                                        entry.rank === 2 ? "bg-zinc-300 text-black" :
                                            entry.rank === 3 ? "bg-amber-700 text-white" :
                                                "bg-zinc-800 text-zinc-500"
                                )}>
                                    {entry.rank <= 3 ? <Crown className="h-4 w-4 md:h-5 md:w-5" /> : entry.rank}
                                </div>

                                {/* Avatar */}
                                <div className="flex-shrink-0 h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-white uppercase">
                                        {entry.initials}
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className={cn(
                                            "font-bold truncate",
                                            entry.isCurrentUser ? "text-analogyai-primary" : "text-white"
                                        )}>
                                            {entry.username}
                                        </h3>
                                        {entry.isCurrentUser && (
                                            <span className="text-[10px] bg-analogyai-primary/20 text-analogyai-primary px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">You</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium mt-0.5">
                                        <span className="flex items-center gap-1">
                                            {entry.gameType}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {entry.date}
                                        </span>
                                    </div>
                                </div>

                                {/* Score */}
                                <div className="flex-shrink-0 text-right">
                                    <div className="text-xl md:text-2xl font-black text-white tracking-tight leading-none">
                                        {entry.score}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 uppercase font-bold mt-0.5">Points</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-zinc-500">
                            No games played yet. Be the first!
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-[#18181b] text-center">
                    <p className="text-xs text-zinc-600">Leaderboard updates in real-time</p>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardOverlay;
