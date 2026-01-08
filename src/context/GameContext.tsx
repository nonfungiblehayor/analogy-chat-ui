import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { supabase } from '@/hooks/supabase';

interface UserStats {
    rank: number;
    points: number;
    achievements: string[];
    gamesPlayed: number;
    streak: number;
    winningStreak: number;
}

interface GameContextType {
    isGameMode: boolean;
    gameTopic: string;
    activeGame: 'selection' | 'reverse-riddle' | 'context-challenge' | 'wordle';
    userStats: UserStats;
    setGameMode: (isGame: boolean) => void;
    setGameTopic: (topic: string) => void;
    setActiveGame: (game: 'selection' | 'reverse-riddle' | 'context-challenge' | 'wordle') => void;
    updateStats: (points: number) => void;
    toggleGameMode: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [isGameMode, setIsGameMode] = useState(false);
    const [gameTopic, setGameTopic] = useState("");
    const [activeGame, setActiveGame] = useState<'selection' | 'reverse-riddle' | 'context-challenge' | 'wordle'>('selection');
    const [userStats, setUserStats] = useState<UserStats>({
        rank: 0,
        points: 0,
        achievements: ["Novice", "Analogy Master"],
        gamesPlayed: 0,
        streak: 0,
        winningStreak: 0
    });

    const fetchUserStats = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch all games for this user to calc stats
            const { data: games, error } = await supabase
                .from('normal_games')
                .select('user_score, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (!games) return;

            // 1. Total Points
            const totalPoints = games.reduce((acc, game) => acc + (game.user_score || 0), 0);

            // 2. Games Played
            const gamesPlayed = games.length;

            // 3. Streak Calculation
            // simplify dates to YYYY-MM-DD
            const uniqueDates = Array.from(new Set(games.map(g => g.created_at.split('T')[0]))).sort().reverse();
            let currentStreak = 0;
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

            // Check if played today or yesterday to start streak
            if (uniqueDates.includes(today)) {
                currentStreak = 1;
                let checkDate = new Date(Date.now() - 86400000); // start checking from yesterday
                while (uniqueDates.includes(checkDate.toISOString().split('T')[0])) {
                    currentStreak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                }
            } else if (uniqueDates.includes(yesterday)) {
                currentStreak = 1;
                let checkDate = new Date(Date.now() - 86400000 * 2); // start checking from day before yesterday
                while (uniqueDates.includes(checkDate.toISOString().split('T')[0])) {
                    currentStreak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                }
            }

            // 4. Rank Calculation (Mock: Rank is based on points / 100 for now, or fetch global count)
            // Real implementation would require fetching all users' scores which might be heavy.
            // For now, let's derive a "Level" or logic based Rank
            const rank = Math.floor(totalPoints / 100) + 1;

            // 5. Winning Streak Calculation
            let winningStreak = 0;
            for (const game of games) {
                if ((game.user_score || 0) >= 10) {
                    winningStreak++;
                } else {
                    break;
                }
            }

            setUserStats(prev => ({
                ...prev,
                points: totalPoints,
                gamesPlayed: gamesPlayed,
                streak: currentStreak,
                winningStreak: winningStreak,
                rank: rank
            }));

        } catch (error) {
            console.error("Error fetching user stats:", error);
        }
    };

    useEffect(() => {
        fetchUserStats();
    }, []);

    const toggleGameMode = () => {
        setIsGameMode((prev) => !prev);
        if (isGameMode) setActiveGame('selection');
    };

    const setGameMode = (isGame: boolean) => {
        setIsGameMode(isGame);
        if (!isGame) setActiveGame('selection');
    };

    const updateStats = (newPoints: number) => {
        // Optimistic update, but ideally re-fetch or add to local state
        setUserStats(prev => ({
            ...prev,
            points: prev.points + newPoints,
            gamesPlayed: prev.gamesPlayed + 1
        }));
        // Re-fetch to be safe and get accurate streak/rank
        setTimeout(fetchUserStats, 1000);
    };

    return (
        <GameContext.Provider value={{
            isGameMode,
            gameTopic,
            activeGame,
            userStats,
            setGameMode,
            setGameTopic,
            setActiveGame,
            updateStats,
            toggleGameMode
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
