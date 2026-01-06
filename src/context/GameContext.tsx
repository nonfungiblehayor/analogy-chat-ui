import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserStats {
    rank: number;
    points: number;
    achievements: string[];
    gamesPlayed: number;
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
        rank: 124,
        points: 450,
        achievements: ["Novice", "Analogy Master"],
        gamesPlayed: 12
    });

    const toggleGameMode = () => {
        setIsGameMode((prev) => !prev);
        if (isGameMode) setActiveGame('selection');
    };

    const setGameMode = (isGame: boolean) => {
        setIsGameMode(isGame);
        if (!isGame) setActiveGame('selection');
    };

    const updateStats = (newPoints: number) => {
        setUserStats(prev => ({
            ...prev,
            points: prev.points + newPoints,
            gamesPlayed: prev.gamesPlayed + 1
        }));
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
