import React, { useState } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { RaffleScreen } from './components/RaffleScreen';
import { useRaffle } from './hooks/useRaffle';

function App() {
  const [view, setView] = useState('setup'); // setup | raffle
  const {
    availableNumbers,
    drawnNumbers,
    initializeRaffle,
    drawNumber,
    isFinished
  } = useRaffle();

  const handleStartRaffle = (start, end) => {
    initializeRaffle(start, end, 1);
    setView('raffle');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the raffle? All history will be lost.')) {
      setView('setup');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500 selection:text-black">
      {view === 'setup' ? (
        <SetupScreen onStart={handleStartRaffle} />
      ) : (
        <RaffleScreen
          availableNumbers={availableNumbers}
          drawnNumbers={drawnNumbers}
          onDraw={drawNumber}
          onReset={handleReset}
          isFinished={isFinished}
        />
      )}
    </div>
  );
}

export default App;
