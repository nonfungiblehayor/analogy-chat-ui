import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import { ArrowLeft, Sparkles, Trophy, Gamepad2, Brain, Puzzle, Target, Medal, Star, Flame, RefreshCcw, CheckCircle2, AlertCircle } from "lucide-react";
import { generateGameContent, evaluateAnalogy } from "@/lib/utils";

// Game Skeletons (to be implemented fully later)
const SelectionView = () => {
    const { setActiveGame, userStats, gameTopic, setGameTopic } = useGame();

    return (
        <div className="relative z-10 flex flex-col items-center max-w-5xl w-full px-6 text-center space-y-8 animate-in zoom-in-95 fade-in duration-700 pb-10">
            {/* User Stats - Compacted */}
            <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-[2rem] p-4 backdrop-blur-md shadow-2xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-analogyai-primary to-analogyai-secondary p-0.5">
                            <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center">
                                <Trophy className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="text-left">
                            <h2 className="text-xl font-black text-white leading-none">Arena Profile</h2>
                            <p className="text-zinc-500 text-xs font-medium">Rank #{userStats.rank} Overall</p>
                        </div>
                    </div>

                    <div className="flex gap-8 items-center bg-white/5 rounded-2xl px-8 py-3 border border-white/5">
                        <div className="text-center">
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Points</p>
                            <p className="text-xl font-black text-analogyai-primary">{userStats.points}</p>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Solved</p>
                            <p className="text-xl font-black text-analogyai-secondary">{userStats.gamesPlayed}</p>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Streak</p>
                            <div className="flex items-center gap-1 justify-center">
                                <Flame className="h-4 w-4 text-orange-500" />
                                <p className="text-xl font-black text-white">5</p>
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
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                    <span className="bg-gradient-to-r from-analogyai-primary to-analogyai-secondary bg-clip-text text-transparent uppercase">
                        Select Your Challenge
                    </span>
                </h1>

                {/* Topic Indicator/Input - Compacted */}
                <div className="max-w-xs mx-auto w-full space-y-2">
                    <div className="relative group">
                        <input
                            type="text"
                            value={gameTopic}
                            onChange={(e) => setGameTopic(e.target.value)}
                            placeholder="Enter a topic..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-analogyai-primary/50 transition-all text-center text-sm font-medium placeholder:text-zinc-600 shadow-inner"
                        />
                        {gameTopic && (
                            <div className="absolute -top-2 -right-2 bg-analogyai-primary text-[#0a0a0a] text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter transform rotate-3 shadow-lg">
                                Active
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {/* Mode 1: Reverse Riddle */}
                <div
                    onClick={() => setActiveGame('reverse-riddle')}
                    className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all cursor-pointer group hover:border-analogyai-primary/50 hover:-translate-y-1 shadow-xl"
                >
                    <div className="h-14 w-14 rounded-2xl bg-analogyai-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Puzzle className="h-8 w-8 text-analogyai-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-left mb-2 text-white">Reverse Riddle</h3>
                    <p className="text-sm text-zinc-400 text-left leading-relaxed">
                        The AI describes a concept. You guess the word.
                    </p>
                </div>

                {/* Mode 2: Context Challenge */}
                <div
                    onClick={() => setActiveGame('context-challenge')}
                    className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all cursor-pointer group hover:border-analogyai-secondary/50 hover:-translate-y-1 shadow-xl"
                >
                    <div className="h-14 w-14 rounded-2xl bg-analogyai-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Brain className="h-8 w-8 text-analogyai-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold text-left mb-2 text-white">Context Challenge</h3>
                    <p className="text-sm text-zinc-400 text-left leading-relaxed">
                        AI gives you a word. You explain it with an analogy.
                    </p>
                </div>

                {/* Mode 3: Wordle */}
                <div
                    onClick={() => setActiveGame('wordle')}
                    className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all cursor-pointer group hover:border-purple-500/50 hover:-translate-y-1 shadow-xl"
                >
                    <div className="h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Target className="h-8 w-8 text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-left mb-2 text-white">Analogy Wordle</h3>
                    <p className="text-sm text-zinc-400 text-left leading-relaxed">
                        Guess the daily cryptic word based on an AI analogy. 3 attempts.
                    </p>
                </div>
            </div>
        </div>
    );
};

const ReverseRiddleGame = () => {
    const { setActiveGame, gameTopic, updateStats } = useGame();
    const [gameState, setGameState] = useState<{ riddle: string, answer: string } | null>(null);
    const [userGuess, setUserGuess] = useState("");
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'neutral', message: string }>({ type: 'neutral', message: "" });
    const [isLoading, setIsLoading] = useState(true);

    const loadRiddle = async () => {
        setIsLoading(true);
        setFeedback({ type: 'neutral', message: "" });
        setUserGuess("");
        const data = await generateGameContent('reverse-riddle', gameTopic);
        if (data) setGameState(data);
        setIsLoading(false);
    };

    useEffect(() => { loadRiddle(); }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!gameState) return;

        const isCorrect = userGuess.toLowerCase().trim() === gameState.answer.toLowerCase().trim();
        if (isCorrect) {
            setFeedback({ type: 'success', message: `Correct! The answer was: ${gameState.answer}` });
            updateStats(50);
            setTimeout(loadRiddle, 3000);
        } else {
            setFeedback({ type: 'error', message: "Not quite! Try again or get a new riddle." });
        }
    };

    return (
        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl animate-in slide-in-from-bottom-8 duration-500">
            <Button variant="ghost" onClick={() => setActiveGame('selection')} className="self-start mb-8 text-zinc-400 hover:text-white bg-white/5 rounded-full px-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Choice
            </Button>

            <div className="w-full bg-white/5 border border-white/10 p-10 md:p-14 rounded-[3rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Puzzle className="h-24 w-24 text-analogyai-primary" />
                </div>

                {isLoading ? (
                    <div className="py-20 text-center space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-analogyai-primary mx-auto" />
                        <p className="text-zinc-500 font-medium tracking-wide">AI is weaving a cryptic riddle...</p>
                    </div>
                ) : (
                    <div className="space-y-10 text-center">
                        <div className="space-y-2">
                            <h2 className="text-sm font-black text-analogyai-primary uppercase tracking-[0.3em]">Reverse Riddle</h2>
                            <p className="text-zinc-500 text-xs">Guess the concept based on the description below</p>
                        </div>

                        <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed italic border-x-4 border-analogyai-primary/20 px-8">
                            "{gameState?.riddle}"
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                value={userGuess}
                                onChange={(e) => setUserGuess(e.target.value)}
                                placeholder="What is it?"
                                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 outline-none focus:border-analogyai-primary/50 transition-all text-center text-xl font-bold"
                            />
                            {feedback.message && (
                                <p className={`text-sm font-bold ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'} animate-in fade-in zoom-in-95`}>
                                    {feedback.message}
                                </p>
                            )}
                            <div className="flex gap-3">
                                <Button type="submit" className="flex-1 h-14 rounded-2xl bg-analogyai-primary hover:bg-analogyai-secondary text-white font-bold shadow-lg shadow-analogyai-primary/20">
                                    Reveal Truth
                                </Button>
                                <Button type="button" onClick={loadRiddle} variant="outline" className="h-14 w-14 rounded-2xl border-white/10 hover:bg-white/5">
                                    <RefreshCcw className="h-5 w-5" />
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

const ContextChallengeGame = () => {
    const { setActiveGame, updateStats } = useGame();
    const [wordData, setWordData] = useState<{ word: string, hint: string } | null>(null);
    const [userAnalogy, setUserAnalogy] = useState("");
    const [result, setResult] = useState<{ score: number, feedback: string, isCorrect: boolean } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEvaluating, setIsEvaluating] = useState(false);

    const loadWord = async () => {
        setIsLoading(true);
        setWordData(null);
        setResult(null);
        setUserAnalogy("");
        const data = await generateGameContent('context-challenge');
        if (data) setWordData(data);
        setIsLoading(false);
    };

    useEffect(() => { loadWord(); }, []);

    const handleEvaluate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wordData || !userAnalogy) return;

        setIsEvaluating(true);
        const evaluation = await evaluateAnalogy(wordData.word, userAnalogy);
        if (evaluation) {
            setResult(evaluation);
            updateStats(evaluation.score);
        }
        setIsEvaluating(false);
    };

    return (
        <div className="relative z-10 flex flex-col items-center w-full max-w-3xl animate-in slide-in-from-bottom-8 duration-500">
            <Button variant="ghost" onClick={() => setActiveGame('selection')} className="self-start mb-8 text-zinc-400 hover:text-white bg-white/5 rounded-full px-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Choice
            </Button>

            <div className="w-full bg-white/5 border border-white/10 p-10 md:p-14 rounded-[3rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Brain className="h-24 w-24 text-analogyai-secondary" />
                </div>

                {isLoading ? (
                    <div className="py-20 text-center space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-analogyai-secondary mx-auto" />
                        <p className="text-zinc-500 font-medium tracking-wide">AI is looking for a intriguing word...</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        <div className="text-center space-y-2">
                            <h2 className="text-sm font-black text-analogyai-secondary uppercase tracking-[0.3em]">Context Challenge</h2>
                            {!result && <p className="text-zinc-500 text-xs">Explain this concept using a creative analogy</p>}
                        </div>

                        {!result ? (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h3 className="text-5xl font-black text-white tracking-tighter mb-2">{wordData?.word?.toUpperCase()}</h3>
                                    <p className="text-analogyai-secondary font-medium italic">"{wordData?.hint}"</p>
                                </div>

                                <form onSubmit={handleEvaluate} className="space-y-6">
                                    <textarea
                                        value={userAnalogy}
                                        onChange={(e) => setUserAnalogy(e.target.value)}
                                        placeholder="Type your analogy here..."
                                        className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 outline-none focus:border-analogyai-secondary/50 transition-all text-lg leading-relaxed resize-none"
                                    />
                                    <Button
                                        disabled={isEvaluating || !userAnalogy}
                                        className="w-full h-16 rounded-2xl bg-analogyai-secondary hover:brightness-110 text-white font-bold text-xl shadow-lg shadow-analogyai-secondary/20 transition-all"
                                    >
                                        {isEvaluating ? <Loader2 className="h-6 w-6 animate-spin" /> : "Submit for Evaluation"}
                                    </Button>
                                </form>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in zoom-in-95 duration-500">
                                <div className="flex flex-col items-center gap-6">
                                    <div className={`h-24 w-24 rounded-full flex items-center justify-center p-1 ${result.score > 70 ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                        <div className="w-full h-full rounded-full bg-[#0a0a0a] flex flex-col items-center justify-center">
                                            <span className="text-2xl font-black">{result.score}</span>
                                            <span className="text-[10px] uppercase opacity-50 font-bold">Points</span>
                                        </div>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                                            {result.score > 70 ? <CheckCircle2 className="text-green-500" /> : <AlertCircle className="text-yellow-500" />}
                                            {result.score > 70 ? "Brilliant Analogy!" : "Good Effort!"}
                                        </h3>
                                        <p className="text-zinc-400 leading-relaxed italic max-w-sm mx-auto">
                                            "{result.feedback}"
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button onClick={loadWord} className="flex-1 h-16 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold">
                                        Next Word
                                    </Button>
                                    <Button onClick={() => setActiveGame('selection')} variant="outline" className="flex-1 h-16 rounded-2xl border-white/10 font-bold">
                                        Main Menu
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const WordleGame = () => {
    const { setActiveGame, updateStats } = useGame();
    const [wordleData, setWordleData] = useState<{ analogy: string, answer: string } | null>(null);
    const [userGuess, setUserGuess] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
    const [isLoading, setIsLoading] = useState(true);

    const loadWordle = async () => {
        setIsLoading(true);
        setStatus('playing');
        setAttempts(0);
        setUserGuess("");
        const data = await generateGameContent('wordle');
        if (data) setWordleData(data);
        setIsLoading(false);
    };

    useEffect(() => { loadWordle(); }, []);

    const handleGuess = (e: React.FormEvent) => {
        e.preventDefault();
        if (!wordleData || status !== 'playing') return;

        const isCorrect = userGuess.toLowerCase().trim() === wordleData.answer.toLowerCase().trim();
        if (isCorrect) {
            setStatus('won');
            updateStats(100);
        } else {
            const nextAttempts = attempts + 1;
            setAttempts(nextAttempts);
            if (nextAttempts >= 3) {
                setStatus('lost');
            }
            setUserGuess("");
        }
    };

    return (
        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl animate-in slide-in-from-bottom-8 duration-500">
            <Button variant="ghost" onClick={() => setActiveGame('selection')} className="self-start mb-8 text-zinc-400 hover:text-white bg-white/5 rounded-full px-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Choice
            </Button>

            <div className="w-full bg-white/5 border border-white/10 p-10 md:p-14 rounded-[3rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Target className="h-24 w-24 text-purple-500" />
                </div>

                {isLoading ? (
                    <div className="py-20 text-center space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto" />
                        <p className="text-zinc-500 font-medium tracking-wide">Decrypting the daily analogy...</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        <div className="text-center space-y-2">
                            <h2 className="text-sm font-black text-purple-500 uppercase tracking-[0.3em]">Analogy Wordle</h2>
                            <p className="text-zinc-500 text-xs text-opacity-70">Decipher the cryptic clue. 3 attempts left.</p>
                        </div>

                        {status === 'playing' ? (
                            <div className="space-y-8">
                                <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed text-center px-4">
                                    "{wordleData?.analogy}"
                                </p>

                                <div className="flex justify-center gap-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className={`h-2 w-12 rounded-full ${i < attempts ? 'bg-zinc-800' : 'bg-purple-500/30'}`} />
                                    ))}
                                </div>

                                <form onSubmit={handleGuess} className="space-y-4">
                                    <input
                                        value={userGuess}
                                        onChange={(e) => setUserGuess(e.target.value)}
                                        placeholder="Enter target word..."
                                        className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 outline-none focus:border-purple-500/50 transition-all text-center text-xl font-bold uppercase tracking-widest"
                                    />
                                    <Button
                                        disabled={!userGuess}
                                        className="w-full h-16 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xl shadow-lg shadow-purple-500/20"
                                    >
                                        Submit Guess
                                    </Button>
                                </form>
                            </div>
                        ) : (
                            <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
                                <div className="space-y-4">
                                    {status === 'won' ? (
                                        <div className="h-24 w-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Trophy className="h-12 w-12 text-green-500" />
                                        </div>
                                    ) : (
                                        <div className="h-24 w-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <AlertCircle className="h-12 w-12 text-red-500" />
                                        </div>
                                    )}
                                    <h3 className="text-4xl font-black text-white">
                                        {status === 'won' ? "ACCESS GRANTED" : "SYSTEM LOCKED"}
                                    </h3>
                                    <p className="text-zinc-400">
                                        The answer was <span className="text-white font-bold uppercase tracking-widest">{wordleData?.answer}</span>
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <Button onClick={loadWordle} className="flex-1 h-16 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold">
                                        New Puzzle
                                    </Button>
                                    <Button onClick={() => setActiveGame('selection')} variant="outline" className="flex-1 h-16 rounded-2xl border-white/10 font-bold">
                                        Main Menu
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


const GameView = () => {
    const { setGameMode, activeGame } = useGame();

    const renderActiveGame = () => {
        switch (activeGame) {
            case 'reverse-riddle': return <ReverseRiddleGame />;
            case 'context-challenge': return <ContextChallengeGame />;
            case 'wordle': return <WordleGame />;
            default: return <SelectionView />;
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-start bg-[#0a0a0a] text-white overflow-hidden pt-6 md:pt-12 pb-5 scroll-smooth">
            {/* Background Vibe: Animated Gradients + Dot Grid */}
            <div className="fixed inset-0 bg-dot-grid pointer-events-none opacity-80" />
            <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-analogyai-primary/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-analogyai-secondary/10 rounded-full blur-[150px] animate-pulse delay-700 pointer-events-none" />

            {/* Top Navigation - Repositioned for fixed layout */}
            <div className="sticky top-4 left-6 z-50 self-start ml-6 mb-4">
                <Button
                    variant="ghost"
                    onClick={() => setGameMode(false)}
                    className="group gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-xl transition-all rounded-full px-4 py-4 h-10 shadow-2xl"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium text-sm">Exit Arena</span>
                </Button>
            </div>

            {renderActiveGame()}

            {/* Bottom Footer Decor */}
            <div className="fixed bottom-8 text-zinc-700 text-[10px] uppercase tracking-[0.4em] font-bold">
                v1.1.0 // Neural Nexus Engaged
            </div>
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
