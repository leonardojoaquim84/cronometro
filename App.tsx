
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lap, StopwatchStatus } from './types';
import { formatTime } from './utils/timeFormatter';
import Button from './components/Button';
import LapItem from './components/LapItem';

const App: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [status, setStatus] = useState<StopwatchStatus>('idle');
  const [laps, setLaps] = useState<Lap[]>([]);
  const [localTime, setLocalTime] = useState<string>(new Date().toLocaleTimeString());
  
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastLapTimeRef = useRef<number>(0);

  // Update local clock every second
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setLocalTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

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

  const fastestLap = laps.length > 1 ? [...laps].sort((a, b) => a.time - b.time)[0] : null;
  const slowestLap = laps.length > 1 ? [...laps].sort((a, b) => b.time - a.time)[0] : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-orange-500">
      <div className="w-full max-w-md flex flex-col">
        
        {/* Header - Now displaying local time */}
        <div className="text-center mb-12">
          <h1 className="text-sm font-bold tracking-[0.2em] text-black/60 uppercase mb-2 mono">
            {localTime}
          </h1>
          <div className="h-1 w-12 bg-black/10 mx-auto rounded-full"></div>
        </div>

        {/* Stopwatch Display */}
        <div className="relative mb-16 flex flex-col items-center justify-center">
          <div className="text-8xl font-light mono tracking-tighter text-black flex items-baseline gap-1">
            {hours !== '00' && (
              <>
                <span>{hours}</span>
                <span className="text-4xl text-black/40">:</span>
              </>
            )}
            <span>{minutes}</span>
            <span className="text-4xl text-black/40">:</span>
            <span>{seconds}</span>
          </div>
          <div className="mt-4 text-3xl mono font-bold text-black/70">
            {milliseconds}
          </div>
          
          <div className="absolute inset-0 -z-10 bg-white/30 rounded-full blur-3xl opacity-30 scale-150"></div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          {status === 'idle' ? (
            <Button onClick={startTimer} variant="success" className="col-span-2 py-4 text-lg shadow-lg">
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
            <div className="bg-white/20 border border-white/30 rounded-2xl p-6 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-black/10">
                <h2 className="text-black/60 text-xs font-bold uppercase tracking-widest">Laps</h2>
                <span className="text-black/50 text-xs mono">{laps.length} recorded</span>
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

      <footer className="mt-auto py-8 text-black/40 text-[10px] uppercase tracking-widest text-center font-bold">
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
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

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
