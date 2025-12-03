import { useState, useCallback } from 'react';

export const useRaffle = () => {
    const [config, setConfig] = useState({
        start: 1,
        end: 100,
        winnerCount: 1,
    });

    const [availableNumbers, setAvailableNumbers] = useState([]);
    const [drawnNumbers, setDrawnNumbers] = useState([]);
    const [currentNumber, setCurrentNumber] = useState(null);
    const [isRolling, setIsRolling] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Initialize the raffle with a range
    const initializeRaffle = useCallback((start, end, count) => {
        const numbers = [];
        for (let i = start; i <= end; i++) {
            numbers.push(i);
        }
        setConfig({ start, end, winnerCount: count });
        setAvailableNumbers(numbers);
        setDrawnNumbers([]);
        setCurrentNumber(null);
        setIsFinished(false);
        setIsRolling(false);
    }, []);

    // Draw a random number
    const drawNumber = useCallback(() => {
        if (availableNumbers.length === 0) {
            setIsFinished(true);
            return null;
        }

        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const winner = availableNumbers[randomIndex];

        // Remove winner from available and add to drawn
        const newAvailable = [...availableNumbers];
        newAvailable.splice(randomIndex, 1);

        setAvailableNumbers(newAvailable);
        setDrawnNumbers(prev => [winner, ...prev]);
        setCurrentNumber(winner);

        if (newAvailable.length === 0) {
            setIsFinished(true);
        }

        return winner;
    }, [availableNumbers]);

    return {
        config,
        availableNumbers,
        drawnNumbers,
        currentNumber,
        isRolling,
        isFinished,
        setIsRolling,
        initializeRaffle,
        drawNumber,
        reset: () => initializeRaffle(config.start, config.end, config.winnerCount)
    };
};
