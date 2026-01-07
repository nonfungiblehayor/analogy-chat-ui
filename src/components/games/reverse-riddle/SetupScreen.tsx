import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, Check, Aperture } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SetupScreenProps {
    onComplete: (topic: string, difficulty: 'Easy' | 'Medium' | 'Hard') => void;
    onBack: () => void;
}

// Data Handling
const TOPICS = [
    { id: "General", label: "General Knowledge", span: "col-span-2 row-span-2", image: "/images/reverse-riddle/topic_general.png" },
    { id: "Science", label: "Science", span: "col-span-1 row-span-1", image: "/images/reverse-riddle/topic_science.png" },
    { id: "History", label: "History", span: "col-span-1 row-span-1", image: "/images/reverse-riddle/topic_history.png" },
    { id: "Pop Culture", label: "Pop Culture", span: "col-span-1 row-span-1", image: "/images/reverse-riddle/topic_culture.png" },
    { id: "Technology", label: "Technology", span: "col-span-1 row-span-1", image: "/images/reverse-riddle/topic_tech.png" },
];

const SUB_TOPICS: Record<string, string[]> = {
    "General": ["Geography", "Literature", "Sports", "Food", "Animals"],
    "Science": ["Physics", "Biology", "Chemistry", "Astronomy", "Geology"],
    "History": ["Ancient", "Medieval", "Modern", "Warfare", "Inventions"],
    "Pop Culture": ["Movies", "Music", "Celebrities", "Memes", "TV Shows"],
    "Technology": ["Computers", "AI", "Space", "Gadgets", "Internet"]
};

const DIFFICULTIES = [
    { id: "Easy", label: "Easy", desc: "Literal" },
    { id: "Medium", label: "Abstract", desc: "Vague" },
    { id: "Hard", label: "Esoteric", desc: "Metaphor" }
] as const;

const SetupScreen: React.FC<SetupScreenProps> = ({ onComplete, onBack }) => {
    const [viewMode, setViewMode] = useState<'MACRO' | 'MICRO'>('MACRO');
    const [selectedTopic, setSelectedTopic] = useState("General");
    const [subTopicSelection, setSubTopicSelection] = useState<string[]>([]);
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>("Medium");

    const activeTopicData = TOPICS.find(t => t.id === selectedTopic);

    const handleTopicSelect = (topicId: string) => {
        setSelectedTopic(topicId);
        setSubTopicSelection([]); // Reset sub-topics
        setViewMode('MICRO');
    };

    const handleSubTopicToggle = (sub: string) => {
        if (sub === 'ALL') {
            setSubTopicSelection([]);
            return;
        }

        setSubTopicSelection(prev => {
            if (prev.includes(sub)) {
                const updated = prev.filter(s => s !== sub);
                return updated;
            } else {
                return [...prev, sub];
            }
        });
    };

    const getButtonText = () => {
        if (viewMode === 'MACRO') return "Configure Game"; // Should not really be seen if we force flow

        const count = subTopicSelection.length;
        if (count === 0) return `Start ${selectedTopic} Game`;
        if (count === 1) return `Start ${subTopicSelection[0]} Game`;
        if (count === 2) return `Start ${subTopicSelection[0]} & ${subTopicSelection[1]}`;
        return `Start ${subTopicSelection[0]} & ${count - 1} others`;
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col h-full max-h-[700px] py-2 relative overflow-hidden group/container">

            {/* Background Image Effect for Micro View */}
            <div
                className={cn(
                    "absolute inset-0 bg-cover bg-center transition-opacity duration-700 pointer-events-none opacity-0",
                    viewMode === 'MICRO' ? "opacity-20 blur-xl scale-110" : "opacity-0"
                )}
                style={{ backgroundImage: `url(${activeTopicData?.image})` }}
            />

            {/* Header Area */}
            <div className="mb-4 shrink-0 px-1 flex items-center h-14 relative z-10 animate-in fade-in slide-in-from-top-2 duration-500">
                <Button
                    variant="ghost"
                    onClick={() => viewMode === 'MICRO' ? setViewMode('MACRO') : onBack()}
                    className="mr-3 h-10 w-10 p-0 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 shadow-md transition-all hover:scale-105"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>

                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none drop-shadow-md">
                        {viewMode === 'MACRO' ? 'Configure Challenge' : selectedTopic}
                    </h1>
                    <p className="text-slate-grey text-xs sm:text-sm font-medium mt-1">
                        {viewMode === 'MACRO' ? 'Select your prism of thought.' : 'Refine your focus area.'}
                    </p>
                </div>
            </div>

            {/* Content Area - Swift Switch */}
            <div className="flex-1 relative z-10">

                {/* MACRO VIEW: Bento Grid */}
                {viewMode === 'MACRO' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 h-[300px] animate-in slide-in-from-left-8 fade-in duration-500">
                        {TOPICS.map((topic) => (
                            <button
                                key={topic.id}
                                onClick={() => handleTopicSelect(topic.id)}
                                className={cn(
                                    "relative rounded-2xl flex flex-col justify-end text-left transition-all duration-300 border border-white/5 hover:border-purple-500/50 group overflow-hidden outline-none focus:ring-2 focus:ring-purple-500/50",
                                    topic.span
                                )}
                            >
                                <div className="absolute inset-0">
                                    <img
                                        src={topic.image}
                                        alt={topic.label}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                                </div>
                                <div className="relative z-10 p-3">
                                    <span className="block font-bold text-sm text-zinc-200 group-hover:text-white transition-colors">
                                        {topic.label}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* MICRO VIEW: Holographic Tiles */}
                {viewMode === 'MICRO' && (
                    <div className="flex flex-col h-full animate-in slide-in-from-right-12 fade-in duration-700">

                        {/* Shard Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {/* ALL Tile - Spans Full Width */}
                            <button
                                onClick={() => handleSubTopicToggle('ALL')}
                                className={cn(
                                    "relative col-span-2 h-16 rounded-xl overflow-hidden border transition-all duration-300 group outline-none",
                                    subTopicSelection.length === 0
                                        ? "border-purple-500 shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)] scale-[1.01]"
                                        : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
                                )}
                            >
                                {/* Background Image (Unblurred slice) */}
                                <div className="absolute inset-0">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-black/80 z-10" />
                                    <img
                                        src={activeTopicData?.image}
                                        className="w-full h-full object-cover opacity-50 blur-[1px]"
                                    />
                                </div>

                                <div className="relative z-20 flex items-center justify-between px-6 h-full">
                                    <div className="flex items-center gap-3">
                                        <Aperture className={cn("h-5 w-5", subTopicSelection.length === 0 ? "text-purple-300" : "text-zinc-500")} />
                                        <span className="font-bold text-white text-lg tracking-tight">All {selectedTopic}</span>
                                    </div>
                                    {subTopicSelection.length === 0 && (
                                        <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse" />
                                    )}
                                </div>
                            </button>

                            {/* Specific Sub-topic Tiles */}
                            {SUB_TOPICS[selectedTopic]?.map((sub, idx) => {
                                const active = subTopicSelection.includes(sub);
                                return (
                                    <button
                                        key={sub}
                                        onClick={() => handleSubTopicToggle(sub)}
                                        className={cn(
                                            "relative h-24 rounded-xl overflow-hidden border transition-all duration-300 group outline-none flex items-end p-3",
                                            active
                                                ? "border-purple-400 shadow-lg scale-[1.02] z-10"
                                                : "border-white/5 opacity-70 hover:opacity-100 hover:border-white/20 hover:-translate-y-1"
                                        )}
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <div className="absolute inset-0">
                                            {/* Each tile reveals a part of the image */}
                                            <img
                                                src={activeTopicData?.image}
                                                className={cn(
                                                    "w-full h-full object-cover transition-all duration-500",
                                                    active ? "grayscale-0 scale-110" : "grayscale blur-[0.5px] scale-100"
                                                )}
                                            />
                                            <div className={cn(
                                                "absolute inset-0 transition-colors duration-300",
                                                active ? "bg-purple-900/30" : "bg-black/60"
                                            )} />
                                        </div>

                                        <div className="relative z-20 flex justify-between items-center w-full">
                                            <span className={cn(
                                                "font-bold text-sm leading-tight",
                                                active ? "text-white" : "text-zinc-300"
                                            )}>{sub}</span>
                                            {active && <Check className="h-4 w-4 text-purple-300" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Complexity (Inline Segmented Control) */}
                        <div className="bg-black/20 backdrop-blur-md rounded-xl p-2 border border-white/5 flex gap-1 mt-auto">
                            {DIFFICULTIES.map((diff) => {
                                const isSelected = difficulty === diff.id;
                                return (
                                    <button
                                        key={diff.id}
                                        onClick={() => setDifficulty(diff.id)}
                                        className={cn(
                                            "flex-1 h-10 rounded-lg flex items-center justify-center transition-all text-xs font-bold",
                                            isSelected
                                                ? "bg-purple-600 text-white shadow-md"
                                                : "bg-transparent text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                                        )}
                                    >
                                        {diff.label}
                                    </button>
                                );
                            })}
                        </div>

                    </div>
                )}

            </div>

            {/* Action Button - Dynamic & Minimal */}
            <div className={`mt-4 transition-all duration-500 transform ${viewMode === 'MACRO' ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                <Button
                    onClick={() => onComplete(selectedTopic, difficulty)}
                    className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-lg shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                    <span>{getButtonText()}</span>
                    <Sparkles className="h-5 w-5 fill-black/20" />
                </Button>
            </div>
        </div>
    );
};

export default SetupScreen;
