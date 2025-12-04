import React, { useState } from 'react';
import { Settings } from 'lucide-react';

export const SetupScreen = ({ onStart }) => {
    const [start, setStart] = useState(1);
    const [end, setEnd] = useState(100);

    const handleSubmit = (e) => {
        e.preventDefault();
        onStart(parseInt(start), parseInt(end));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-8">
            <div className="w-full bg-neutral-800 p-8 rounded-2xl shadow-2xl border border-neutral-700" style={{ width: '90%', maxWidth: '600px' }}>
                <div className="flex items-center justify-center mb-8 text-yellow-500">
                    <Settings size={48} />
                </div>
                <h1 className="text-3xl font-bold text-center mb-8 tracking-wider">RAFFLE SETUP</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-neutral-400">START NUMBER</label>
                            <input
                                type="number"
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all text-center font-bold"
                                style={{
                                    fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                                    padding: 'clamp(0.5rem, 2vw, 1.5rem)'
                                }}
                                min="1"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-neutral-400">END NUMBER</label>
                            <input
                                type="number"
                                value={end}
                                onChange={(e) => setEnd(e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all text-center font-bold"
                                style={{
                                    fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                                    padding: 'clamp(0.5rem, 2vw, 1.5rem)'
                                }}
                                min={start}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98]"
                            style={{ fontSize: '2.5rem', padding: '1.5rem' }}
                        >
                            START RAFFLE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
