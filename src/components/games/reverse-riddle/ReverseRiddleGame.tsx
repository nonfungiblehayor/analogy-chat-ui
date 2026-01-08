import React, { useState, useEffect } from 'react';
import { GameState, PlayerStats, RiddleQuestion } from '@/types/gameTypes';
import { MOCK_RIDDLES } from '@/lib/mockData';
import IntroModal from './IntroModal';
import SetupScreen from './SetupScreen';
import GameArena from './GameArena';
import ResultsDashboard from './ResultsDashboard';
import { useGame } from '@/context/GameContext';
import { cn } from '@/lib/utils';
import { supabase } from '@/hooks/supabase';

const ReverseRiddleGame = () => {
    const { setActiveGame } = useGame();
    const [gameState, setGameState] = useState<GameState>('INTRO');

    // Consolidated Game Configuration State
    const [gameConfig, setGameConfig] = useState<{
        topic: string;
        subTopics: string[];
        difficulty: 'Easy' | 'Medium' | 'Hard';
    }>({
        topic: 'General',
        subTopics: [],
        difficulty: 'Medium'
    });

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
        // Simple Shuffle logic for now
        const shuffled = [...MOCK_RIDDLES].sort(() => 0.5 - Math.random()).slice(0, 10);
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

    const handleSetupComplete = (selectedTopic: string, subTopics: string[], selectedDiff: 'Easy' | 'Medium' | 'Hard') => {
        setGameConfig({
            topic: selectedTopic,
            subTopics: subTopics,
            difficulty: selectedDiff
        });
        setGameState('PLAYING');
    };

    useEffect(() => {
        const saveGameSession = async () => {
            if (gameState === 'FINISHED') {
                try {
                    const { data: { user } } = await supabase.auth.getUser();

                    if (!user) {
                        console.error('No authenticated user found');
                        return;
                    }

                    const { error } = await supabase
                        .from('normal_games')
                        .insert({
                            user_id: user.id,
                            game_type: 'riddle_game',
                            topic: gameConfig.topic,
                            sub_topic: gameConfig.subTopics.length > 0 ? gameConfig.subTopics.join(', ') : 'General',
                            difficulty_level: gameConfig.difficulty.toLowerCase(),
                            user_score: stats.score, // Use the current final score
                            created_at: new Date().toISOString()
                        });

                    if (error) {
                        console.error('Error saving game session:', error);
                    } else {
                        console.log('Game session saved successfully');
                    }
                } catch (err) {
                    console.error('Unexpected error saving game:', err);
                }
            }
        };

        saveGameSession();
    }, [gameState]); // Run only when gameState changes

    const handleAnswer = (isCorrect: boolean, timeTaken: number) => {
        if (!questions[currentQuestionIndex]) return;

        // New Scoring Logic: 10 points for correct, 0 for incorrect. 
        // Ignoring previous complexity of streaks/time for now based on user request "10 points for correct answer"
        const scoreToAdd = isCorrect ? 10 : 0;

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
            "relative w-full flex flex-col items-center justify-center min-h-[600px] overflow-hidden p-4 transition-colors duration-1000"
        )}>
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,47,167,0.05),transparent_70%)] pointer-events-none" />

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

export default ReverseRiddleGame;
