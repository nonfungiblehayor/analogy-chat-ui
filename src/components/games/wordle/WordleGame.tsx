import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import Scoreboard from './Scoreboard';
import GameArena from './GameArena';
import ResultScreen from './ResultScreen';
import { toast } from 'sonner';

type WordleGameState = 'SCOREBOARD' | 'PLAYING' | 'RESULT';

const WordleGame = () => {
    const { setActiveGame, updateStats } = useGame();
    const [gameState, setGameState] = useState<WordleGameState>('SCOREBOARD');

    // Game Data State
    const [wordleData, setWordleData] = useState<{ analogy: string, answer: string } | null>(null);
    const [attempts, setAttempts] = useState(0);
    const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
    const [isShake, setIsShake] = useState(false);
    const maxAttempts = 3;

    // Load Data Helper
    const loadDailyChallenge = async () => {
        // Mock data for now as per user request
        const data = {
            analogy: "A window to the world that fits in your pocket, connecting minds across the silent void.",
            answer: "Phone"
        };
        // Simulate network delay for real-feel
        await new Promise(resolve => setTimeout(resolve, 800));
        setWordleData(data);
    };

    const handleStartGame = async () => {
        await loadDailyChallenge();
        setAttempts(0);
        setStatus('playing');
        setGameState('PLAYING');
    };

    const handleGuess = (guess: string) => {
        if (!wordleData || status !== 'playing') return;

        const normalizedGuess = guess.toLowerCase().trim();
        const normalizedAnswer = wordleData.answer.toLowerCase().trim();

        if (normalizedGuess === normalizedAnswer) {
            // Correct
            setStatus('won');
            // Scoring: 1st try = 10, 2nd = 5, 3rd = 3
            // attempts is 0-indexed, so attempts=0 is 1st try
            const points = attempts === 0 ? 10 : attempts === 1 ? 5 : 3;
            updateStats(points);

            // Short delay for visual success state in Arena before moving to Result
            setTimeout(() => setGameState('RESULT'), 1500);
        } else {
            // Incorrect
            setIsShake(true);
            setTimeout(() => setIsShake(false), 500);

            const nextAttempts = attempts + 1;
            setAttempts(nextAttempts);

            if (nextAttempts >= maxAttempts) {
                setStatus('lost');
                setTimeout(() => setGameState('RESULT'), 1500);
            } else {
                toast.error(`${maxAttempts - nextAttempts} attempts remaining`, {
                    classNames: {
                        toast: 'bg-red-500/10 text-red-500 border-red-500/20 font-mono text-center'
                    },
                    position: 'bottom-center'
                });
            }
        }
    };

    const handleBackToScoreboard = () => {
        setGameState('SCOREBOARD');
        // Reset game state? Or keep last result? 
        // Logic says Scoreboard is the "Lobby". 
        // If we want to prevent replay, we'd check stats, but for now allow Replay from Scoreboard if user wants.
    };

    const handleExitGame = () => {
        setActiveGame('selection');
    };


    return (
        <div className="w-full h-full flex flex-col items-center">

            <div className="fixed inset-0 pointer-events-none">
                {/* Atmosphere for Wordle Mode */}
                <div className="absolute top-[-20%] left-[20%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            {gameState === 'SCOREBOARD' && (
                <Scoreboard
                    onPlay={handleStartGame}
                    onBack={handleExitGame}
                />
            )}

            {gameState === 'PLAYING' && wordleData && (
                <GameArena
                    analogy={wordleData.analogy}
                    attempts={attempts}
                    maxAttempts={maxAttempts}
                    onGuess={handleGuess}
                    onExit={() => setGameState('SCOREBOARD')} // Allow aborting to Scoreboard
                    isShake={isShake}
                />
            )}

            {gameState === 'RESULT' && wordleData && (
                <ResultScreen
                    status={status as 'won' | 'lost'}
                    analogy={wordleData.analogy}
                    answer={wordleData.answer}
                    attempts={attempts} // If lost, attempts equals maxAttempts usually, or whatever they reached.
                    onBack={handleBackToScoreboard}
                />
            )}
        </div>
    );
};

export default WordleGame;
