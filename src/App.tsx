/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ModuleView from './pages/ModuleView';
import LabsView from './pages/LabsView';
import ToolsView from './pages/ToolsView';
import { modulesData } from './data/modules';
import { labsData } from './data/labs';
import { useProgress } from './hooks/useProgress';

export default function App() {
  const [screen, setScreen] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const {
    progress,
    completeLesson,
    completeQuiz,
    completeLab,
    toggleBookmark,
    achievementsList
  } = useProgress();

  const handleSelectModule = (id: string) => {
    setSelectedModuleId(id);
    setActiveTab('modules');
  };

  const handleSelectLab = (id: string) => {
    setActiveTab('labs');
  };

  // Content area routing
  const renderContent = () => {
    if (activeTab === 'modules' && selectedModuleId) {
      const activeModule = modulesData.find((m) => m.id === selectedModuleId);
      if (activeModule) {
        return (
          <ModuleView
            module={activeModule}
            progress={progress}
            onBack={() => setSelectedModuleId(null)}
            onCompleteLesson={completeLesson}
            onCompleteQuiz={completeQuiz}
            toggleBookmark={toggleBookmark}
          />
        );
      }
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            progress={progress}
            modules={modulesData}
            achievements={achievementsList}
            onSelectModule={handleSelectModule}
            onSelectLab={handleSelectLab}
            setActiveTab={setActiveTab}
          />
        );
      case 'modules':
        return (
          <div className="space-y-6">
            <div className="border-b border-slate-900 pb-4">
              <h2 className="text-xl font-bold text-white tracking-tight">Security Training Curriculum</h2>
              <p className="text-xs text-slate-400 mt-1">
                Explore structured modules designed to teach foundational security practices step-by-step.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modulesData.map((m) => {
                const finishedLessons = m.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
                const progressPercent = Math.round((finishedLessons / m.lessons.length) * 100);
                return (
                  <div
                    key={m.id}
                    onClick={() => handleSelectModule(m.id)}
                    className="p-5 bg-slate-900/40 hover:bg-slate-900/70 border border-slate-900 hover:border-slate-800 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-[9px] font-mono font-bold text-cyan-500 uppercase tracking-widest">{m.category}</span>
                      <h3 className="font-bold text-slate-100 text-sm mt-2 group-hover:text-cyan-300 transition-colors">{m.title}</h3>
                      <p className="text-slate-400 text-xs mt-1.5 leading-relaxed line-clamp-2">{m.description}</p>
                    </div>
                    <div className="border-t border-slate-950 pt-4 mt-4 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-500">
                        <span>Lessons Complete</span>
                        <span>{finishedLessons} / {m.lessons.length}</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'labs':
        return (
          <LabsView
            labs={labsData}
            progress={progress}
            onBack={() => setActiveTab('dashboard')}
            onCompleteLab={completeLab}
          />
        );
      case 'tools':
        return <ToolsView />;
      default:
        return <Dashboard progress={progress} modules={modulesData} achievements={achievementsList} onSelectModule={handleSelectModule} onSelectLab={handleSelectLab} setActiveTab={setActiveTab} />;
    }
  };

  if (screen === 'landing') {
    return <LandingPage onEnterPlatform={() => setScreen('app')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex relative overflow-hidden">
      {/* Background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(8,47,73,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(8,47,73,0.1)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Futuristic Sidebar Navigation Panel */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} score={progress.score} />

      {/* Main Workspace Frame panel content area */}
      <div className="flex-1 min-h-screen md:pl-64 flex flex-col overflow-y-auto selection:bg-cyan-500/20 selection:text-cyan-200">
        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
