import React from 'react';
import { PlayerStats } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, RefreshCcw, Home, Share2, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsDashboardProps {
    stats: PlayerStats;
    onPlayAgain: () => void;
    onExit: () => void;
}

// Mock Leaderboard Data
const LEADERBOARD_DATA = [
    { rank: 1, name: "NeuralKnight", score: 2500, avatar: "bg-purple-500" },
    { rank: 2, name: "LogicMaster", score: 2350, avatar: "bg-cyan-500" },
    { rank: 3, name: "RiddleSolver", score: 2100, avatar: "bg-rose-500" },
    { rank: 4, name: "CognitiveFlow", score: 1980, avatar: "bg-amber-500" },
];

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ stats, onPlayAgain, onExit }) => {

    // Transform history for the graph
    let runningScore = 0;
    const graphData = stats.history.map((h, i) => {
        if (h.isCorrect) runningScore += 100;
        return { index: i + 1, score: runningScore, correct: h.isCorrect ? 1 : 0 };
    });

    // Ensure at least some points for the graph if empty
    if (graphData.length === 0) graphData.push({ index: 0, score: 0, correct: 0 });

    const percentage = stats.totalQuestions > 0 ? (stats.correctAnswers / stats.totalQuestions) * 100 : 0;

    let performanceTitle = "Logician";
    if (percentage === 100) performanceTitle = "Omniscient";
    else if (percentage >= 80) performanceTitle = "Visionary";
    else if (percentage >= 60) performanceTitle = "Strategist";

    return (
        <div className="w-full h-full max-w-4xl mx-auto flex flex-col items-center justify-start md:justify-center animate-in zoom-in-95 duration-700 py-8 overflow-y-auto px-4">

            {/* Main Result Card */}
            <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">

                {/* Left: Score & Verdict */}
                <div className="md:col-span-7 bg-[#18181b] rounded-[2rem] p-8 border border-white/5 relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[400px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-klein-blue/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-5 w-5 text-klein-blue animate-pulse" />
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Assessment Complete</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-1">
                            {stats.score}
                        </h2>
                        <p className="font-mono text-sm text-klein-blue font-bold">Total Score.</p>
                    </div>

                    <div className="relative z-10 py-8">
                        <p className="text-zinc-500 text-sm font-medium mb-2">Reasoning Level</p>
                        <h3 className="text-3xl md:text-4xl font-serif italic text-white leading-tight">
                            "Analytical <span className="text-transparent bg-clip-text bg-gradient-to-r from-klein-blue to-purple-500">{performanceTitle}</span>"
                        </h3>
                        <div className="h-1 w-24 bg-zinc-800 mt-4 rounded-full overflow-hidden">
                            <div className="h-full bg-klein-blue" style={{ width: `${percentage}%` }} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 relative z-10">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                            <div className="text-2xl font-bold text-white">{stats.streak}</div>
                            <div className="text-[10px] text-zinc-500 uppercase font-bold">Streak</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                            <div className="text-2xl font-bold text-white">{stats.correctAnswers}/{stats.totalQuestions}</div>
                            <div className="text-[10px] text-zinc-500 uppercase font-bold">Accuracy</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                            <div className="text-2xl font-bold text-white">{stats.hintsUsed}</div>
                            <div className="text-[10px] text-zinc-500 uppercase font-bold">Hints</div>
                        </div>
                    </div>
                </div>

                {/* Right: Graph & Rank */}
                <div className="md:col-span-5 flex flex-col gap-6">
                    {/* Graph Card */}
                    <div className="bg-[#18181b] rounded-[2rem] p-6 border border-white/5 shadow-xl flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            <span className="text-xs font-bold text-zinc-400 uppercase">Flow State</span>
                        </div>
                        <div className="flex-1 w-full min-h-[120px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={graphData}>
                                    <defs>
                                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#002FA7" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#002FA7" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="index" hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ stroke: '#555', strokeWidth: 1 }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#002FA7" strokeWidth={3} fill="url(#scoreGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Ticket Style Leaderboard */}
                    <div className="bg-[#EFEFEF] dark:bg-[#000] rounded-[2rem] p-6 border border-zinc-200 dark:border-zinc-800 relative">
                        {/* Perforation Effect */}
                        <div className="absolute -top-[1px] left-8 right-8 border-t-2 border-dashed border-zinc-400/30" />

                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-black uppercase text-zinc-500 tracking-widest">+50 PTS ADDED</span>
                            <span className="text-xs font-mono font-bold text-klein-blue">RANK #124</span>
                        </div>

                        <div className="space-y-3">
                            {LEADERBOARD_DATA.slice(0, 3).map((user) => (
                                <div key={user.rank} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white", user.avatar)}>
                                            {user.rank}
                                        </div>
                                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{user.name}</span>
                                    </div>
                                    <span className="font-mono text-xs text-zinc-400">{user.score}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pb-8 w-full justify-center">
                <Button
                    onClick={onPlayAgain}
                    className="h-12 md:h-14 px-6 md:px-8 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-sm md:text-lg shadow-xl hover:scale-105 transition-all"
                >
                    <RefreshCcw className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Play Again
                </Button>
                <Button
                    onClick={onExit}
                    variant="outline"
                    className="h-12 md:h-14 px-6 md:px-8 rounded-full border-white/10 hover:bg-white/5 text-zinc-400 font-bold text-sm md:text-lg hover:text-white transition-all"
                >
                    <Home className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Main Menu
                </Button>
            </div>
        </div>
    );
};

export default ResultsDashboard;
