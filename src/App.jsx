import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import PomodoroTimer from './components/PomodoroTimer';

const SEED_TASKS = [
  { id: '1', text: 'Revise Java Exception Handling for Exams', tag: 'Urgent', completed: false },
  { id: '2', text: 'Practice C++ Graph Algorithms', tag: 'Revision', completed: false },
  { id: '3', text: 'Finish React.js Portfolio UI', tag: 'Project', completed: false },
];

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : SEED_TASKS;
  });

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('stats');
    return saved ? JSON.parse(saved) : { totalStudyMinutes: 0, currentStreak: 0 };
  });

  // Persist dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Persist tasks
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Persist stats
  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats]);

  const handlePomodoroComplete = (minutes) => {
    setStats(prev => ({
      totalStudyMinutes: prev.totalStudyMinutes + minutes,
      currentStreak: prev.currentStreak + 1
    }));
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="container mx-auto px-4 pt-8 pb-16 max-w-6xl">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              Study Planer
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Conquer procrastination and focus on what matters.</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 text-slate-600 dark:text-slate-300"
            aria-label="Toggle dark mode"
          >
            {darkMode ? 
              <Sun className="w-6 h-6 text-emerald-400" /> : 
              <Moon className="w-6 h-6 text-indigo-600" />
            }
          </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            <TaskManager tasks={tasks} setTasks={setTasks} />
          </div>
          
          <div className="space-y-6 flex flex-col">
            <Dashboard stats={stats} tasks={tasks} />
            <div className="flex-1">
              <PomodoroTimer onComplete={handlePomodoroComplete} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;