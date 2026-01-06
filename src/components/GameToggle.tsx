import { Button } from "@/components/ui/button";
import { Gamepad } from "lucide-react";
import { useGame } from "@/context/GameContext";

const GameToggle = () => {
    const { setGameMode, isGameMode } = useGame();

    if (isGameMode) return null;

    return (
        <div className="fixed bottom-6 right-6 z-40 group">
            <div className="absolute inset-0 bg-analogyai-primary/20 blur-xl rounded-full group-hover:bg-analogyai-primary/40 transition-all duration-500 scale-150" />
            <Button
                onClick={() => setGameMode(true)}
                className="relative h-14 w-14 rounded-full shadow-2xl bg-analogyai-primary hover:bg-analogyai-secondary text-white border-2 border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center p-0"
            >
                <Gamepad className="h-6 w-6" />
                <span className="absolute -top-12 right-0 bg-zinc-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 shadow-xl">
                    Quick Play Game
                </span>
            </Button>
        </div>
    );
};

export default GameToggle;
