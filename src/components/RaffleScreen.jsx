import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy } from 'lucide-react';

export const RaffleScreen = ({
    availableNumbers,
    drawnNumbers,
    onDraw,
    onReset,
    isFinished
}) => {
    const [displayNumber, setDisplayNumber] = useState('000');
    const [isRolling, setIsRolling] = useState(false);
    const [showWinner, setShowWinner] = useState(false);
    const intervalRef = useRef(null);

    const startRolling = () => {
        if (isFinished || isRolling) return;

        setIsRolling(true);
        setShowWinner(false);

        // Fast rolling effect
        intervalRef.current = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            setDisplayNumber(availableNumbers[randomIndex]);
        }, 50);

        // Auto stop after 3 seconds
        setTimeout(() => {
            stopRolling();
        }, 3000);
    };

    const stopRolling = () => {
        clearInterval(intervalRef.current);
        const winner = onDraw(); // Draw actual winner
        setDisplayNumber(winner);
        setIsRolling(false);
        setShowWinner(true);

        // Confetti effect
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#FFD700', '#FFA500', '#ffffff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#FFD700', '#FFA500', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    const handleAction = () => {
        if (!isRolling) {
            startRolling();
        }
    };

    // Keyboard support (Space to start)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' && !isRolling && !isFinished) {
                e.preventDefault();
                handleAction();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isRolling, isFinished, availableNumbers]);

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            {/* Left Banner Area (300px) */}
            <div className="w-[300px] bg-neutral-900 border-r border-neutral-800 flex flex-col items-center justify-center p-4 flex-shrink-0">
                <div className="w-full h-full border-2 border-dashed border-neutral-700 rounded-xl flex items-center justify-center text-neutral-500">
                    <span className="text-center">BANNER AREA<br />(300px)</span>
                </div>
            </div>

            {/* Main Display Area (Remaining width) */}
            <div className="flex-1 flex flex-col relative min-w-0">
                <div className="absolute top-8 left-8 text-neutral-500 font-mono z-10">
                    REMAINING: {availableNumbers.length}
                </div>

                {/* Center Container */}
                <div className="flex-1 flex justify-center items-center pt-20">
                    {/* Fixed Size Number Container to prevent layout shift */}
                    <div className="w-[1000px] h-[500px] relative flex justify-center items-center">
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={isRolling ? 'rolling' : displayNumber}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className={`absolute inset-0 flex justify-center items-center font-bold tabular-nums tracking-tighter ${showWinner ? 'text-yellow-500 scale-125' : 'text-white'
                                    }`}
                                style={{
                                    fontSize: '400px',
                                    lineHeight: 1,
                                    textShadow: '0 0 50px rgba(0,0,0,0.5)'
                                }}
                            >
                                {displayNumber}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="h-64 flex justify-center items-start pb-24 z-10">
                    {!isFinished ? (
                        <button
                            onClick={handleAction}
                            disabled={isRolling}
                            className={`rounded-full font-bold tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_60px_rgba(255,215,0,0.5)] ${isRolling
                                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                : 'bg-yellow-500 hover:bg-yellow-400 text-black'
                                }`}
                            style={{
                                padding: '1.5rem 4rem',
                                fontSize: '2.5rem'
                            }}
                        >
                            {isRolling ? 'ROLLING...' : 'DRAW'}
                        </button>
                    ) : (
                        <div className="text-4xl text-neutral-400 font-bold">
                            ALL NUMBERS DRAWN
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar History (300px) */}
            <div className="w-[300px] bg-neutral-900 border-l border-neutral-800 p-6 flex flex-col flex-shrink-0">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-neutral-400 flex items-center gap-2">
                        <Trophy size={24} />
                        WINNERS
                    </h2>
                    <button
                        onClick={onReset}
                        className="p-2 hover:bg-neutral-800 rounded-full text-neutral-500 hover:text-white transition-colors"
                        title="Reset Raffle"
                    >
                        <RotateCcw size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {drawnNumbers.map((num, index) => (
                        <motion.div
                            key={`${num}-${index}`}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-neutral-800 p-4 rounded-xl border border-neutral-700 flex flex-col items-center justify-center gap-2"
                        >
                            <span className="text-neutral-500 font-mono text-lg self-start">#{drawnNumbers.length - index}</span>
                            <span className="font-bold text-yellow-500" style={{ fontSize: '5rem', lineHeight: 1 }}>{num}</span>
                        </motion.div>
                    ))}
                    {drawnNumbers.length === 0 && (
                        <div className="text-neutral-600 text-center py-8 italic">
                            No winners yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
