export interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface RiddleQuestion {
    id: string;
    riddle: string;
    options: Option[];
    correctAnswer: string;
    hints: string[];
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topic: string;
}

export interface PlayerStats {
    score: number;
    streak: number;
    hintsUsed: number;
    totalQuestions: number;
    correctAnswers: number;
    history: { questionId: string; isCorrect: boolean; timeTaken: number }[];
}

export type GameState = 'INTRO' | 'SETUP' | 'PLAYING' | 'FINISHED';
