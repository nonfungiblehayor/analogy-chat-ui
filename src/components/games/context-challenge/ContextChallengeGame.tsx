import React, { useState } from 'react';
import { GameState, PlayerStats, RiddleQuestion } from '@/types/gameTypes';
import { MOCK_CONTEXT_CHALLENGES } from '@/lib/mockData';
import IntroModal from './IntroModal';
import SetupScreen from './SetupScreen';
import GameArena from './GameArena';
import ResultsDashboard from './ResultsDashboard';
import { useGame } from '@/context/GameContext';
import { cn } from '@/lib/utils';

const ContextChallengeGame = () => {
    const { setActiveGame } = useGame();
    const [gameState, setGameState] = useState<GameState>('INTRO');
    const [gameTopic, setGameTopic] = useState<string>('General');
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
    const [questions, setQuestions] = useState<RiddleQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [stats, setStats] = useState<PlayerStats>({
        score: 0,
        streak: 0,
        hintsUsed: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        history: []
    });

    const startGame = () => {
        // Simple Shuffle and Select
        // In a real app, this would filter by Topic/Difficulty
        const shuffled = [...MOCK_CONTEXT_CHALLENGES].sort(() => 0.5 - Math.random()).slice(0, 5);
        setQuestions(shuffled);
        setCurrentQuestionIndex(0);
        setStats({
            score: 0,
            streak: 0,
            hintsUsed: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            history: []
        });
        setGameState('SETUP');
    };

    const handleSetupComplete = (selectedTopic: string, selectedDiff: 'Easy' | 'Medium' | 'Hard') => {
        setGameTopic(selectedTopic);
        setDifficulty(selectedDiff);
        setGameState('PLAYING');
    };

    const handleAnswer = (isCorrect: boolean, timeTaken: number) => {
        if (!questions[currentQuestionIndex]) return;

        const baseScore = 100;
        const streakBonus = isCorrect ? stats.streak * 10 : 0;
        const scoreToAdd = isCorrect ? baseScore + streakBonus : 0;

        setStats(prev => ({
            ...prev,
            score: prev.score + scoreToAdd,
            streak: isCorrect ? prev.streak + 1 : 0,
            totalQuestions: prev.totalQuestions + 1,
            correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
            history: [...prev.history, {
                questionId: questions[currentQuestionIndex]?.id || "unknown",
                isCorrect,
                timeTaken
            }]
        }));

        if (currentQuestionIndex + 1 >= questions.length) {
            setGameState('FINISHED');
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handleHintUse = () => {
        if (stats.hintsUsed < 5) {
            setStats(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
            return true;
        }
        return false;
    };

    const returnToSetup = () => {
        setGameState('SETUP');
    };

    const exitToMainMenu = () => {
        setActiveGame('selection');
    };

    return (
        <div className={cn(
            "relative w-full flex flex-col items-center justify-center min-h-[600px] p-4 transition-colors duration-1000"
        )}>
            {/* Background Atmosphere - Cyan Tint */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.05),transparent_70%)] pointer-events-none" />

            {gameState === 'INTRO' && (
                <IntroModal
                    onStart={startGame}
                    onExit={exitToMainMenu}
                />
            )}

            {gameState === 'SETUP' && (
                <SetupScreen
                    onComplete={handleSetupComplete}
                    onBack={exitToMainMenu}
                />
            )}

            {gameState === 'PLAYING' && questions.length > 0 && questions[currentQuestionIndex] && (
                <GameArena
                    question={questions[currentQuestionIndex]}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={questions.length}
                    stats={stats}
                    onAnswer={handleAnswer}
                    onUseHint={handleHintUse}
                    onExit={returnToSetup}
                />
            )}

            {gameState === 'FINISHED' && (
                <ResultsDashboard
                    stats={stats}
                    onPlayAgain={startGame}
                    onExit={exitToMainMenu}
                />
            )}
        </div>
    );
};

export default ContextChallengeGame;
