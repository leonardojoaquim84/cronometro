
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lap, StopwatchStatus } from './types';
import { formatTime } from './utils/timeFormatter';
import Button from './components/Button';
import LapItem from './components/LapItem';

const App: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [status, setStatus] = useState<StopwatchStatus>('idle');
  const [laps, setLaps] = useState<Lap[]>([]);
  
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastLapTimeRef = useRef<number>(0);

  const startTimer = useCallback(() => {
    setStatus('running');
    startTimeRef.current = Date.now() - time;
    
    timerRef.current = window.setInterval(() => {
      setTime(Date.now() - startTimeRef.current);
    }, 10);
  }, [time]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStatus('paused');
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTime(0);
    setStatus('idle');
    setLaps([]);
    lastLapTimeRef.current = 0;
  }, []);

  const addLap = useCallback(() => {
    const currentLapTime = time - lastLapTimeRef.current;
    const newLap: Lap = {
      id: laps.length + 1,
      time: currentLapTime,
      overallTime: time
    };
    setLaps(prev => [newLap, ...prev]);
    lastLapTimeRef.current = time;
  }, [laps.length, time]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const { hours, minutes, seconds, milliseconds } = formatTime(time);

  // Find fastest and slowest laps for highlighting
  const fastestLap = laps.length > 1 ? [...laps].sort((a, b) => a.time - b.time)[0] : null;
  const slowestLap = laps.length > 1 ? [...laps].sort((a, b) => b.time - a.time)[0] : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a0a0a]">
      <div className="w-full max-w-md flex flex-col">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-sm font-semibold tracking-[0.2em] text-neutral-500 uppercase mb-2">ZenTime</h1>
          <div className="h-1 w-12 bg-white/10 mx-auto rounded-full"></div>
        </div>

        {/* Stopwatch Display */}
        <div className="relative mb-16 flex flex-col items-center justify-center">
          <div className="text-8xl font-light mono tracking-tighter text-white flex items-baseline gap-1">
            {hours !== '00' && (
              <>
                <span>{hours}</span>
                <span className="text-4xl text-neutral-600">:</span>
              </>
            )}
            <span>{minutes}</span>
            <span className="text-4xl text-neutral-600">:</span>
            <span>{seconds}</span>
          </div>
          <div className="mt-4 text-3xl mono font-medium text-neutral-500">
            {milliseconds}
          </div>
          
          {/* Subtle progress ring-like background */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-3xl opacity-20 scale-150"></div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          {status === 'idle' ? (
            <Button onClick={startTimer} variant="primary" className="col-span-2 py-4 text-lg">
              <PlayIcon /> Start
            </Button>
          ) : status === 'running' ? (
            <>
              <Button onClick={addLap} variant="secondary">
                <LapIcon /> Lap
              </Button>
              <Button onClick={pauseTimer} variant="danger">
                <PauseIcon /> Stop
              </Button>
            </>
          ) : (
            <>
              <Button onClick={resetTimer} variant="ghost">
                <ResetIcon /> Reset
              </Button>
              <Button onClick={startTimer} variant="success">
                <PlayIcon /> Resume
              </Button>
            </>
          )}
        </div>

        {/* Laps List */}
        <div className="flex-1 overflow-hidden">
          {laps.length > 0 && (
            <div className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-neutral-800">
                <h2 className="text-neutral-400 text-xs font-bold uppercase tracking-widest">Laps</h2>
                <span className="text-neutral-600 text-xs mono">{laps.length} recorded</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {laps.map((lap) => (
                  <LapItem 
                    key={lap.id} 
                    lap={lap} 
                    isFastest={fastestLap?.id === lap.id}
                    isSlowest={slowestLap?.id === lap.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-auto py-8 text-neutral-600 text-[10px] uppercase tracking-widest text-center">
        Precision Timing &bull; Minimal Design
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
      `}</style>
    </div>
  );
};

// Simple SVG Icons
const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M5 3l14 9-14 9V3z"/></svg>
);
const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
);
const ResetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);
const LapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
);

export default App;
