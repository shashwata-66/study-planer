import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Briefcase, Clock } from 'lucide-react';

export default function PomodoroTimer({ onComplete }) {
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;
  
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      if (!isBreak) {
        onComplete(25);
        setIsBreak(true);
        setTimeLeft(BREAK_TIME);
        // HTML5 Audio notification could go here
      } else {
        setIsBreak(false);
        setTimeLeft(WORK_TIME);
      }
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, onComplete]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? BREAK_TIME : WORK_TIME);
  };

  const switchMode = (toBreak) => {
    if (isActive) return; // Prevent switching while running
    setIsBreak(toBreak);
    setTimeLeft(toBreak ? BREAK_TIME : WORK_TIME);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100 
    : ((WORK_TIME - timeLeft) / WORK_TIME) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col h-full relative overflow-hidden transition-all group">
      {/* Background progress indicator */}
      <div 
        className={`absolute top-0 left-0 h-1 transition-all duration-1000 ease-linear ${isBreak ? 'bg-emerald-400' : 'bg-indigo-500'}`}
        style={{ width: `${progress}%` }}
      />
      
      <div className="flex items-center justify-between mb-8 z-10">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <Clock className="w-5 h-5 text-indigo-500" />
          Focus Timer
        </h2>
        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-full">
          <button 
            onClick={() => switchMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              !isBreak 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Briefcase className="w-3 h-3" />
            25m
          </button>
          <button 
            onClick={() => switchMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              isBreak 
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Coffee className="w-3 h-3" />
            5m
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-10">
        <div className={`text-6xl lg:text-7xl font-black tabular-nums tracking-tighter mb-8 transition-colors ${
          isActive 
            ? (isBreak ? 'text-emerald-500' : 'text-indigo-600 dark:text-indigo-400') 
            : 'text-slate-800 dark:text-slate-100'
        }`}>
          {formatTime(timeLeft)}
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={resetTimer}
            className="p-3 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <button 
            onClick={toggleTimer}
            className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 ${
              isActive 
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200' 
                : isBreak ? 'bg-emerald-500 hover:bg-emerald-400 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}
