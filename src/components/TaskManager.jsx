import { useState } from 'react';
import { CheckSquare, Plus, Trash2, Edit2, Tag } from 'lucide-react';

const TAG_COLORS = {
  Urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  Revision: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  Project: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  Default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
};

const PREDEFINED_TAGS = ['Urgent', 'Revision', 'Project', 'General'];

export default function TaskManager({ tasks, setTasks }) {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskTag, setNewTaskTag] = useState('General');
  const [editingId, setEditingId] = useState(null);
  const [editPrompt, setEditPrompt] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      tag: newTaskTag,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskText('');
    setNewTaskTag('General');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditPrompt(task.text);
  };

  const saveEdit = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, text: editPrompt.trim() || t.text } : t
    ));
    setEditingId(null);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <CheckSquare className="w-5 h-5 text-indigo-500" />
          Task Manager
        </h2>
        <span className="text-sm font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full">
          {tasks.filter(t => !t.completed).length} pending
        </span>
      </div>

      <form onSubmit={handleAddTask} className="mb-6 flex gap-2">
        <div className="flex-1 flex bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
          <input 
            type="text" 
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="What needs to be done?" 
            className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400"
          />
          <div className="border-l border-slate-200 dark:border-slate-700 relative flex items-center">
            <select 
              value={newTaskTag}
              onChange={(e) => setNewTaskTag(e.target.value)}
              className="appearance-none bg-transparent pl-3 pr-8 py-3 outline-none text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              {PREDEFINED_TAGS.map(tag => (
                <option key={tag} value={tag} className="dark:bg-slate-800">{tag}</option>
              ))}
            </select>
            <Tag className="w-4 h-4 absolute right-3 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <button 
          type="submit"
          disabled={!newTaskText.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl transition-colors flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <CheckSquare className="w-12 h-12 mb-3 opacity-20" />
            <p>All caught up!</p>
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${
                task.completed 
                  ? 'bg-slate-50/50 dark:bg-slate-800/50 border-transparent opacity-60' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-sm hover:border-indigo-200 dark:hover:border-indigo-900/50'
              }`}
            >
              <button 
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  task.completed 
                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                    : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 text-transparent'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
              </button>
              
              <div className="flex-1 min-w-0">
                {editingId === task.id ? (
                  <input
                    type="text"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    onBlur={() => saveEdit(task.id)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                    autoFocus
                    className="w-full bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className={`truncate transition-all ${task.completed ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {task.text}
                  </p>
                )}
              </div>
              
              <span className={`text-xs px-2 py-1 rounded-md border ${TAG_COLORS[task.tag] || TAG_COLORS.Default}`}>
                {task.tag}
              </span>
              
              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => startEditing(task)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
