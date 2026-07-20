import React, { useState } from 'react';
import { Module, UserProgress, Achievement } from '../types';
import { Search, Compass, BookOpen, Star, Sparkles, Filter, CheckCircle2, ChevronRight, Play, Trophy, Calendar, Zap, AlertTriangle, ArrowRight } from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  modules: Module[];
  achievements: (Achievement & { unlockedAt?: string })[];
  onSelectModule: (id: string) => void;
  onSelectLab: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ progress, modules, achievements, onSelectModule, onSelectLab, setActiveTab }: DashboardProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  // Daily Challenge Trivia
  const [dailyAnswered, setDailyAnswered] = useState(false);
  const [dailyCorrect, setDailyCorrect] = useState<boolean | null>(null);
  const [selectedDailyOption, setSelectedDailyOption] = useState<string | null>(null);

  const dailyQuestion = {
    question: 'Which cyber threat vector specifically manipulates human behavior to extract passwords or access privileges?',
    options: ['Brute Force attack', 'Social Engineering', 'Buffer Overflow', 'SQL Injection'],
    correct: 'Social Engineering',
    explanation: 'Social Engineering (such as phishing, baiting, or tailgating) uses psychological manipulation rather than pure code exploit vulnerabilities.'
  };

  const handleDailySubmit = (option: string) => {
    setSelectedDailyOption(option);
    const isCorrect = option === dailyQuestion.correct;
    setDailyCorrect(isCorrect);
    setDailyAnswered(true);
  };

  // Filtered modules
  const categories = ['All', 'Infrastructure', 'Securing Data', 'Securing Code', 'Attack & Defense'];
  const filteredModules = modules.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'All' || m.difficulty === difficultyFilter;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Calculate stats
  const totalLessonsCount = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessonsCount = progress.completedLessons.length;
  const lessonPercentage = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

  const totalQuizzesCount = modules.length;
  const completedQuizzesCount = progress.completedQuizzes.length;
  const quizPercentage = totalQuizzesCount > 0 ? Math.round((completedQuizzesCount / totalQuizzesCount) * 100) : 0;

  // Custom SVG Heatmap Generator (Last 12 weeks representation)
  const renderHeatmap = () => {
    const today = new Date();
    const columns = 14; // 14 weeks representation
    const grid: number[][] = Array.from({ length: 7 }, () => Array(columns).fill(0));

    // Fill grid based on progress.activityLog
    const dates = Object.keys(progress.activityLog);
    dates.forEach((dateStr) => {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const dayDiff = Math.floor((today.getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24));
        if (dayDiff >= 0 && dayDiff < columns * 7) {
          const col = columns - 1 - Math.floor(dayDiff / 7);
          const row = dayDiff % 7;
          if (row >= 0 && row < 7 && col >= 0 && col < columns) {
            grid[row][col] += progress.activityLog[dateStr] || 0;
          }
        }
      }
    });

    const getIntensityColor = (val: number) => {
      if (val === 0) return 'fill-slate-900 border-slate-950';
      if (val === 1) return 'fill-cyan-900/60';
      if (val === 2) return 'fill-cyan-700/80';
      return 'fill-cyan-400';
    };

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="bg-slate-950/60 p-4 border border-slate-900 rounded-xl">
        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-3 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Progression Activity Heatmap
        </span>

        <div className="flex gap-2">
          {/* Day tags */}
          <div className="flex flex-col justify-between text-[8px] font-mono text-slate-600 pr-1 select-none">
            <span>M</span>
            <span>W</span>
            <span>F</span>
          </div>

          <svg className="w-full max-w-sm h-16" viewBox="0 0 170 80">
            {grid.map((rowArr, rowIdx) =>
              rowArr.map((cellVal, colIdx) => (
                <rect
                  key={`${rowIdx}-${colIdx}`}
                  x={colIdx * 11 + 5}
                  y={rowIdx * 10}
                  width="8"
                  height="8"
                  rx="1.5"
                  className={`${getIntensityColor(cellVal)} transition-colors duration-300`}
                />
              ))
            )}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-2 border-t border-slate-900/40 pt-1.5">
          <span>Last 14 weeks of studies</span>
          <div className="flex gap-1 items-center">
            <span>Less</span>
            <span className="w-2 h-2 rounded-sm bg-slate-900"></span>
            <span className="w-2 h-2 rounded-sm bg-cyan-900/60"></span>
            <span className="w-2 h-2 rounded-sm bg-cyan-700/80"></span>
            <span className="w-2 h-2 rounded-sm bg-cyan-400"></span>
            <span>More</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="dashboard-root" className="space-y-6">
      {/* Welcome Top Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Security Command Center</h2>
          <p className="text-xs text-slate-400 mt-1">
            Analyze your diagnostic results, complete pending training pathways, and solve daily challenges.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">System Status:</span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> SECURE_SYS_LIVE
          </span>
        </div>
      </div>

      {/* Main Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (Stats, Heatmap, Achievements) */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Quick Metrics Bento Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Metric 1 */}
            <div className="p-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl relative overflow-hidden flex justify-between items-center">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest block">Theory Lessons</span>
                <span className="text-2xl font-black font-mono text-cyan-400 mt-1 block">
                  {completedLessonsCount} <span className="text-xs font-normal text-slate-500">/ {totalLessonsCount}</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-1.5 font-mono">{lessonPercentage}% Finished</span>
              </div>
              <div className="w-14 h-14 bg-cyan-500/5 border border-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-4 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl relative overflow-hidden flex justify-between items-center">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest block">Quizzes Cleared</span>
                <span className="text-2xl font-black font-mono text-violet-400 mt-1 block">
                  {completedQuizzesCount} <span className="text-xs font-normal text-slate-500">/ {totalQuizzesCount}</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-1.5 font-mono">{quizPercentage}% Finished</span>
              </div>
              <div className="w-14 h-14 bg-violet-500/5 border border-violet-500/10 rounded-full flex items-center justify-center text-violet-400">
                <Trophy className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Activity Heatmap Grid */}
          {renderHeatmap()}

          {/* Achievements badge showcase */}
          <div className="bg-slate-900/60 p-5 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Earned Achievement Medals
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {achievements.map((ach) => {
                const isUnlocked = !!ach.unlockedAt;
                return (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                      isUnlocked
                        ? 'bg-slate-950/80 border-cyan-500/20 text-slate-200'
                        : 'bg-slate-950/20 border-slate-900/50 text-slate-600'
                    }`}
                  >
                    <div>
                      <span className={`text-[9px] font-mono font-bold uppercase ${isUnlocked ? 'text-cyan-400' : 'text-slate-700'}`}>
                        {ach.category}
                      </span>
                      <h4 className={`text-xs font-bold mt-1 ${isUnlocked ? 'text-slate-200' : 'text-slate-600'}`}>
                        {ach.title}
                      </h4>
                      <p className="text-[9px] text-slate-500 leading-normal mt-1">{ach.description}</p>
                    </div>
                    {isUnlocked && (
                      <span className="text-[8px] font-mono font-black text-cyan-500 text-right uppercase mt-2.5 block">
                        ★ UNLOCKED
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column (Resume Path, Daily Challenge) */}
        <div className="col-span-1 space-y-6">
          {/* Resume learning helper card */}
          <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/10 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">Active Pathway Recommendation</span>
            <h3 className="font-bold text-slate-100 text-base mt-2">Resume: Networking</h3>
            <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
              Continue your study on the TCP Three-Way Handshake or test yourself in the Phishing Detection sandbox.
            </p>
            <button
              onClick={() => onSelectModule('networking')}
              className="mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all"
            >
              Resume Study <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Daily trivia challenge */}
          <div className="p-5 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
              <Zap className="w-4.5 h-4.5 text-yellow-400 animate-bounce" />
              <h3 className="font-semibold text-slate-100 text-sm">Daily Intelligence Challenge</h3>
            </div>

            <p className="text-slate-300 text-[11px] font-mono leading-normal bg-slate-950 p-2.5 rounded-lg border border-slate-850">
              {dailyQuestion.question}
            </p>

            <div className="space-y-1.5 text-xs font-mono">
              {dailyQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={dailyAnswered}
                  onClick={() => handleDailySubmit(opt)}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-[11px] transition-all flex justify-between items-center ${
                    dailyAnswered
                      ? opt === dailyQuestion.correct
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                        : opt === selectedDailyOption
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                        : 'bg-slate-950/20 border-slate-900 text-slate-500'
                      : 'bg-slate-950/60 border-slate-850 hover:border-slate-800 text-slate-300'
                  }`}
                >
                  <span>{opt}</span>
                  {!dailyAnswered && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                </button>
              ))}
            </div>

            {dailyAnswered && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-[10px] leading-relaxed">
                <span className={`font-bold block ${dailyCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {dailyCorrect ? '✓ Correct Option Selected! (+10 pts)' : '✗ Incorrect Answer'}
                </span>
                <p className="text-slate-400 mt-1">{dailyQuestion.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum Module Search and Catalog Row */}
      <div className="border-t border-slate-900 pt-8 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            <Compass className="w-4.5 h-4.5 text-cyan-400" /> Interactive Curriculum Catalog
          </h3>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search concepts, modules, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-850 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Filter categories tags */}
        <div className="flex flex-wrap gap-2 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all border ${
                categoryFilter === cat
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                  : 'bg-slate-950/40 border-slate-900 hover:border-slate-850 text-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Catalog list grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((m) => {
            const isCompleted = progress.completedQuizzes.includes(m.id);
            const finishedLessons = m.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
            const progressPercent = Math.round((finishedLessons / m.lessons.length) * 100);

            return (
              <div
                key={m.id}
                onClick={() => onSelectModule(m.id)}
                className="p-5 bg-slate-900/40 hover:bg-slate-900/70 border border-slate-900 hover:border-slate-800 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono font-bold text-cyan-500 uppercase tracking-widest">
                      {m.category}
                    </span>
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                      m.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' : m.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {m.difficulty}
                    </span>
                  </div>

                  <h4 className="text-slate-100 font-bold text-sm mt-2 group-hover:text-cyan-300 transition-colors">
                    {m.title}
                  </h4>
                  <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {m.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {m.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-slate-950/70 text-slate-500 border border-slate-900 rounded text-[8px] font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="border-t border-slate-950 pt-4 mt-4 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Lessons Complete</span>
                    <span>{finishedLessons} / {m.lessons.length}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredModules.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-900 rounded-2xl">
              No learning modules found matching: "{search}". Try searching category filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
