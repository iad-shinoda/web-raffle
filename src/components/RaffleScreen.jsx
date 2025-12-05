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

        // Play fanfare
        // Use BASE_URL to ensure correct path in production (GitHub Pages)
        const audioPath = `${import.meta.env.BASE_URL}fanfare.mp3`;
        const audio = new Audio(audioPath);
        audio.volume = 0.5;
        audio.play().catch(e => console.error('Audio play failed:', e));

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

    // Banner animation loop
    const [bannerVisible, setBannerVisible] = useState(true);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const bannerTexts = [
        { text: "アイアンドディー", color: "text-neutral-600" },
        { text: "忘年会ビンゴ", color: "text-yellow-500" }
    ];

    useEffect(() => {
        let isMounted = true;
        const cycleAnimation = async () => {
            if (!isMounted) return;

            // Show
            setBannerVisible(true);
            // Wait for display + reading time
            await new Promise(resolve => setTimeout(resolve, 5000));

            if (!isMounted) return;

            // Hide
            setBannerVisible(false);
            // Wait for exit animation
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (!isMounted) return;

            // Switch text and loop
            setCurrentTextIndex(prev => (prev + 1) % bannerTexts.length);
            cycleAnimation();
        };
        cycleAnimation();

        return () => { isMounted = false; };
    }, []);

    const bannerContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.2
            }
        }
    };

    const bannerChildVariants = {
        hidden: { opacity: 0, scale: 0.5, filter: "blur(10px)" },
        visible: {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        }
    };

    return (
        <div className="flex flex-col landscape:flex-row h-screen bg-black text-white overflow-hidden">
            {/* Left Banner Area (Hidden on Portrait, Visible on Landscape) */}
            <div className="hidden landscape:flex w-[150px] lg:w-[300px] bg-neutral-900 border-r border-neutral-800 items-center justify-center overflow-hidden relative transition-all duration-300">
                <div className="flex h-full items-center justify-center select-none" style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>

                    <motion.div
                        key={currentTextIndex} // Re-mount on text change to ensure clean animation
                        className="flex items-center justify-center"
                        variants={bannerContainerVariants}
                        initial="hidden"
                        animate={bannerVisible ? "visible" : "hidden"}
                    >
                        {bannerTexts[currentTextIndex].text.split('').map((char, index) => (
                            <motion.span
                                key={index}
                                variants={bannerChildVariants}
                                className={`font-black leading-none py-2 lg:py-4 ${bannerTexts[currentTextIndex].color}`}
                                style={{
                                    fontSize: 'min(11vh, 11vw)',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                    fontWeight: 900
                                }}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Main Display Area */}
            <div className="flex-1 flex flex-col relative min-w-0 h-full">
                <div className="absolute top-4 left-4 lg:top-8 lg:left-8 text-neutral-500 font-mono z-10 text-sm lg:text-base">
                    REMAINING: {availableNumbers.length}
                </div>

                {/* Center Container */}
                <div className="flex-1 flex justify-center items-center">
                    <div className="relative flex justify-center items-center w-full h-full">
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={isRolling ? 'rolling' : displayNumber}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className={`absolute inset-0 flex justify-center items-center font-bold tabular-nums tracking-tighter ${showWinner ? 'text-yellow-500 scale-125' : 'text-white'
                                    }`}
                                style={{
                                    lineHeight: 1,
                                    textShadow: '0 0 50px rgba(0,0,0,0.5)'
                                }}
                            >
                                {/* Dynamic Font Size: Fit within width and height */}
                                <span style={{ fontSize: 'min(35vw, 55vh)' }}>
                                    {displayNumber}
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="h-[20vh] flex justify-center items-start z-10">
                    {!isFinished ? (
                        <button
                            onClick={handleAction}
                            disabled={isRolling}
                            className={`rounded-full font-bold tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_60px_rgba(255,215,0,0.5)] ${isRolling
                                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                : 'bg-yellow-500 hover:bg-yellow-400 text-black'
                                }`}
                            style={{
                                padding: 'clamp(0.8rem, 2vh, 1.5rem) clamp(2rem, 4vw, 4rem)',
                                fontSize: 'clamp(1.2rem, 3vh, 2.5rem)'
                            }}
                        >
                            {isRolling ? 'ROLLING...' : 'DRAW'}
                        </button>
                    ) : (
                        <div className="text-2xl lg:text-4xl text-neutral-400 font-bold">
                            ALL NUMBERS DRAWN
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar History (Bottom on Portrait, Right on Landscape) */}
            <div className="w-full landscape:w-[300px] h-[250px] landscape:h-auto bg-neutral-900 border-t landscape:border-t-0 landscape:border-l border-neutral-800 p-4 flex flex-col flex-shrink-0 transition-all duration-300">
                <div className="flex items-center justify-between mb-2 landscape:mb-6">
                    <h2 className="text-base landscape:text-xl font-bold text-neutral-400 flex items-center gap-2">
                        <Trophy className="w-5 h-5 landscape:w-7 landscape:h-7" />
                        WINNERS
                    </h2>
                    <button
                        onClick={onReset}
                        className="p-2 hover:bg-neutral-800 rounded-full text-neutral-500 hover:text-white transition-colors"
                        title="Reset Raffle"
                    >
                        <RotateCcw className="w-5 h-5 landscape:w-7 landscape:h-7" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-3 gap-2 landscape:flex landscape:flex-col landscape:space-y-4">
                        {drawnNumbers.map((num, index) => (
                            <motion.div
                                key={`${num}-${index}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-neutral-800 p-2 landscape:p-4 rounded-xl border border-neutral-700 flex flex-col items-center justify-center gap-1 landscape:gap-2"
                            >
                                <span className="text-neutral-500 font-mono text-xs landscape:text-lg self-start">#{drawnNumbers.length - index}</span>
                                <span className="font-bold text-yellow-500 text-4xl landscape:text-[5rem] leading-none">{num}</span>
                            </motion.div>
                        ))}
                    </div>
                    {drawnNumbers.length === 0 && (
                        <div className="text-neutral-600 text-center py-4 landscape:py-8 italic text-xs landscape:text-base">
                            No winners yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
