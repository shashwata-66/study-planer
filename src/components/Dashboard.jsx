import { Clock, CheckCircle2, Flame } from 'lucide-react';

export default function Dashboard({ stats, tasks }) {
  const tasksCompleted = tasks.filter(t => t.completed).length;
  // Convert minutes to hours and minutes
  const hours = Math.floor(stats.totalStudyMinutes / 60);
  const minutes = stats.totalStudyMinutes % 60;
  
  const studyTimeString = hours > 0 
    ? `${hours}h ${minutes}m` 
    : `${minutes}m`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
        <Clock className="w-5 h-5 text-indigo-500" />
        Overview
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
        {/* Study Hours Card */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Study Time</h3>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{studyTimeString}</p>
        </div>

        {/* Tasks Completed Card */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed</h3>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{tasksCompleted} / {tasks.length}</p>
        </div>

        {/* Focus Streak Card */}
        <div className="col-span-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
              <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Focus Streak</h3>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {stats.currentStreak} Pomodoros
          </p>
          {/* Visual Progress Bar for Streak (simple 4 segment max visual) */}
          <div className="mt-3 flex gap-1 h-2">
            {[...Array(getVisualStreakSize(stats.currentStreak))].map((_, i) => (
              <div key={i} className="flex-1 bg-orange-400 dark:bg-orange-500 rounded-full animate-pulse" style={{animationDelay: `${i * 100}ms`}}></div>
            ))}
            {[...Array(4 - getVisualStreakSize(stats.currentStreak))].map((_, i) => (
              <div key={i} className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getVisualStreakSize(streak) {
  // Show up to 4 segments based on the streak modulo 4 to keep the bar active
  if (streak === 0) return 0;
  const mod = streak % 4;
  return mod === 0 ? 4 : mod;
}
