import React, { useState } from 'react';
import { Module, UserProgress, QuizQuestion, ExternalResource } from '../types';
import { ArrowLeft, BookOpen, Play, CheckCircle, ShieldCheck, Trophy, HelpCircle, FileText, ChevronRight, Bookmark, Activity, Globe, ExternalLink } from 'lucide-react';
import TerminalSimulator from '../components/TerminalSimulator';
import { PasswordStrengthChecker, HashGenerator, CaesarCipherTool, PortScanner, FirewallBuilder } from '../components/Simulators';
import { CyberThreatMap, CyberKillChain, TcpHandshakeSimulation, OsiLayerJourney } from '../components/Visualizations';

interface ModuleViewProps {
  module: Module;
  progress: UserProgress;
  onBack: () => void;
  onCompleteLesson: (id: string) => void;
  onCompleteQuiz: (id: string) => void;
  toggleBookmark: (id: string) => void;
}

export default function ModuleView({
  module,
  progress,
  onBack,
  onCompleteLesson,
  onCompleteQuiz,
  toggleBookmark
}: ModuleViewProps) {
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: string }>({});
  const [matchingSelections, setMatchingSelections] = useState<{ [key: string]: string }>({});
  const [fillBlankAnswer, setFillBlankAnswer] = useState('');
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<'simulation' | 'global_pathways'>('simulation');
  const [redirectingResource, setRedirectingResource] = useState<any | null>(null);
  const [redirectProgress, setRedirectProgress] = useState(0);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (redirectingResource) {
      setRedirectProgress(0);
      const interval = setInterval(() => {
        setRedirectProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            window.open(redirectingResource.url, '_blank', 'noopener,noreferrer');
            timer = setTimeout(() => {
              setRedirectingResource(null);
            }, 800);
            return 100;
          }
          return prev + 12.5;
        });
      }, 250);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [redirectingResource]);

  const activeLesson = module.lessons[activeLessonIdx];
  const isLessonCompleted = activeLesson ? progress.completedLessons.includes(activeLesson.id) : false;
  const isQuizCompleted = progress.completedQuizzes.includes(module.id);
  const isBookmarked = progress.bookmarks.includes(module.id);

  // Match and render module-specific interactive simulations
  const renderModuleSimulator = () => {
    switch (module.id) {
      case 'networking':
        return (
          <div className="space-y-6">
            <OsiLayerJourney />
            <TcpHandshakeSimulation />
          </div>
        );
      case 'cryptography':
        return (
          <div className="space-y-6">
            <CaesarCipherTool />
            <HashGenerator />
          </div>
        );
      case 'web-security':
        return (
          <div className="space-y-6">
            <FirewallBuilder />
          </div>
        );
      case 'linux':
        return (
          <div className="space-y-4">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
              <span className="font-semibold text-cyan-400 block mb-1">Interactive Sandbox Goal:</span>
              <span className="text-slate-400">Explore files and configuration logs! Try commands like: <code className="text-white bg-slate-900 px-1 py-0.5 rounded">ls</code>, <code className="text-white bg-slate-900 px-1 py-0.5 rounded">cd var/log</code>, and <code className="text-white bg-slate-900 px-1 py-0.5 rounded">cat welcome.txt</code>.</span>
            </div>
            <TerminalSimulator />
          </div>
        );
      case 'hacking':
        return (
          <div className="space-y-6">
            <PortScanner />
          </div>
        );
      case 'malware':
        return (
          <div className="space-y-6">
            <FirewallBuilder />
            <CyberKillChain />
          </div>
        );
      case 'forensics':
        return (
          <div className="space-y-6">
            <CyberThreatMap />
            <CyberKillChain />
          </div>
        );
      case 'cloud-security':
        return (
          <div className="space-y-6">
            <FirewallBuilder />
          </div>
        );
      case 'mobile-security':
        return (
          <div className="space-y-6">
            <PasswordStrengthChecker />
          </div>
        );
      case 'ai-security':
        return (
          <div className="space-y-6">
            <HashGenerator />
          </div>
        );
      default:
        return <PasswordStrengthChecker />;
    }
  };

  const renderGlobalPathways = () => {
    const resources = module.externalResources || [];

    return (
      <div id="global-pathways-root" className="space-y-4">
        <div className="bg-slate-950/80 p-4 border border-slate-900 rounded-xl space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-widest block">🌐 Global Resource Catalog</span>
          <p className="text-slate-400 text-xs leading-relaxed">
            There is no user account or login lock. Anyone can learn and become an expert directly from top open-web platforms, cyber classrooms, and Google programs. Click any path to launch safe interactive training.
          </p>
        </div>

        <div className="space-y-3">
          {resources.length > 0 ? (
            resources.map((res, i) => (
              <div
                key={i}
                id={`pathway-card-${i}`}
                className="bg-slate-900/40 border border-slate-800/85 rounded-xl p-4 space-y-3 hover:border-slate-700/60 transition-all group"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[9px] font-mono font-bold bg-violet-500/10 border border-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full uppercase shrink-0">
                        {res.platform}
                      </span>
                      {res.isFree && (
                        <span className="text-[9px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase shrink-0">
                          Free
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-200 text-xs group-hover:text-cyan-400 transition-colors mt-2">
                      {res.title}
                    </h4>
                  </div>

                  <span className="text-[9px] font-mono font-semibold text-slate-400 capitalize bg-slate-950 border border-slate-850 px-2 py-0.5 rounded-lg shrink-0">
                    {res.type}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {res.description}
                </p>

                <div className="pt-2 border-t border-slate-850/40 flex justify-between items-center">
                  <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-600" />
                    Open Learning Route
                  </span>

                  <button
                    onClick={() => setRedirectingResource(res)}
                    className="px-3 py-1.5 bg-violet-500/10 hover:bg-violet-500 text-violet-300 hover:text-slate-950 border border-violet-500/20 hover:border-transparent rounded-lg text-[9px] font-mono font-bold transition-all flex items-center gap-1"
                  >
                    Launch Platform
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-500 text-xs font-mono">
              No global resources cataloged for this module yet.
            </div>
          )}
        </div>
      </div>
    );
  };

  // QUIZ ENGINE CONTROLS
  const handleAnswerSelect = (qId: string, value: string) => {
    setSelectedAnswers({ ...selectedAnswers, [qId]: value });
  };

  const handleMatchingSelect = (left: string, right: string) => {
    setMatchingSelections({ ...matchingSelections, [left]: right });
  };

  const submitQuestion = () => {
    const question = module.quiz.questions[currentQuestionIdx];
    let isCorrect = false;

    if (question.type === 'mcq') {
      isCorrect = selectedAnswers[question.id] === question.correctAnswer;
    } else if (question.type === 'fill-blank') {
      isCorrect = fillBlankAnswer.trim().toLowerCase() === (question.correctAnswer as string).trim().toLowerCase();
    } else if (question.type === 'matching') {
      // Check matching pairs
      const keys = Object.keys(matchingSelections);
      let matchCount = 0;
      question.matchingPairs?.forEach((pair) => {
        if (matchingSelections[pair.left] === pair.right) {
          matchCount++;
        }
      });
      isCorrect = matchCount === (question.matchingPairs?.length || 0);
    }

    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setFillBlankAnswer('');
    setMatchingSelections({});

    if (currentQuestionIdx < module.quiz.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // Finished
      const isPerfect = quizScore + (showExplanation ? 1 : 0) === module.quiz.questions.length; // Approximate final tally check
      if (isPerfect || quizScore >= module.quiz.questions.length * 0.7) {
        onCompleteQuiz(module.id);
      }
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setMatchingSelections({});
    setFillBlankAnswer('');
    setQuizScore(0);
    setQuizFinished(false);
    setShowExplanation(false);
  };

  return (
    <div id="module-view-root" className="space-y-6">
      {/* Module Title Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-4 border border-slate-900 rounded-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest">{module.category}</span>
            <h2 className="text-base font-bold text-white tracking-tight">{module.title}</h2>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => toggleBookmark(module.id)}
            className={`p-2 border rounded-xl text-xs flex items-center gap-1.5 font-mono transition-colors ${
              isBookmarked
                ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                : 'border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Navigation Rails - Lessons list */}
        <div className="col-span-1 space-y-4">
          <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-2">Lesson Pathway</span>

            <div className="space-y-1">
              {module.lessons.map((lesson, idx) => {
                const isFinished = progress.completedLessons.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLessonIdx(idx);
                      setQuizStarted(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      activeLessonIdx === idx && !quizStarted
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950/40 border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[130px]">{lesson.title}</span>
                    </div>
                    {isFinished && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}

              {/* Module Quiz link at the bottom of rail */}
              <button
                onClick={() => {
                  setQuizStarted(true);
                  resetQuiz();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all mt-3 ${
                  quizStarted
                    ? 'bg-violet-500/10 border-violet-500 text-violet-300'
                    : 'bg-slate-950/40 border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Module Assessment</span>
                </div>
                {isQuizCompleted && <CheckCircle className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
              </button>
            </div>
          </div>
        </div>

        {/* Center / Right - Content viewer and active interactive labs */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          {!quizStarted ? (
            /* ACTIVE THEORY LESSON */
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              {/* Theory article */}
              <div className="xl:col-span-3 p-6 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-slate-200 text-base">{activeLesson?.title}</h3>
                  <span className="text-[10px] font-mono text-slate-500">{module.duration} reading</span>
                </div>

                <article className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed space-y-3 whitespace-pre-wrap font-sans">
                  {activeLesson?.content}
                </article>

                <div className="pt-6 border-t border-slate-850 flex justify-between items-center">
                  <button
                    onClick={() => onCompleteLesson(activeLesson.id)}
                    disabled={isLessonCompleted}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                      isLessonCompleted
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {isLessonCompleted ? 'Lesson Complete (+10 pts)' : 'Complete Lesson & Earn'}
                  </button>
                </div>
              </div>

              {/* Dynamic Interactive Visual Panel */}
              <div className="xl:col-span-2 space-y-4">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Interactive Simulation Sandbox</span>
                {renderModuleSimulator()}
              </div>
            </div>
          ) : (
            /* QUIZ INTERFACE MODULE */
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl max-w-xl mx-auto space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-violet-400" />
                  <h3 className="font-bold text-slate-200 text-base">Concept Certification Assessment</h3>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Question {currentQuestionIdx + 1} of {module.quiz.questions.length}
                </span>
              </div>

              {!quizFinished ? (
                /* ACTIVE QUESTION */
                <div className="space-y-4">
                  <p className="text-slate-200 text-xs font-mono leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-850">
                    {module.quiz.questions[currentQuestionIdx].question}
                  </p>

                  {/* Rendering options based on question type */}
                  {module.quiz.questions[currentQuestionIdx].type === 'mcq' && (
                    <div className="space-y-2">
                      {module.quiz.questions[currentQuestionIdx].options?.map((opt, i) => {
                        const qId = module.quiz.questions[currentQuestionIdx].id;
                        const isSelected = selectedAnswers[qId] === opt;
                        return (
                          <button
                            key={i}
                            onClick={() => handleAnswerSelect(qId, opt)}
                            disabled={showExplanation}
                            className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all flex justify-between items-center ${
                              isSelected
                                ? 'bg-violet-500/10 border-violet-500 text-violet-300'
                                : 'bg-slate-950/40 border-slate-850 hover:border-slate-800 text-slate-400'
                            }`}
                          >
                            <span>{opt}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {module.quiz.questions[currentQuestionIdx].type === 'fill-blank' && (
                    <input
                      type="text"
                      placeholder="Type correct parameter term..."
                      value={fillBlankAnswer}
                      onChange={(e) => setFillBlankAnswer(e.target.value)}
                      disabled={showExplanation}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono text-xs"
                    />
                  )}

                  {/* Submit / Next Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-850">
                    {!showExplanation ? (
                      <button
                        onClick={submitQuestion}
                        className="px-4 py-2 bg-violet-500 hover:bg-violet-400 text-slate-950 rounded-xl text-xs font-bold font-mono transition-all"
                      >
                        Verify Code Answer
                      </button>
                    ) : (
                      <button
                        onClick={nextQuestion}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1"
                      >
                        Next Question <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {showExplanation && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1.5">
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">Explanation Review</span>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {module.quiz.questions[currentQuestionIdx].explanation}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* QUIZ FINISHED RESULTS CARD */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-400 mx-auto animate-bounce">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-slate-200 font-bold text-base">Assessment Finished!</h4>
                    <p className="text-slate-400 text-xs mt-1.5 max-w-sm mx-auto">
                      You scored {quizScore} out of {module.quiz.questions.length} correct. Passing requires 70% accuracy.
                    </p>
                  </div>

                  {quizScore >= module.quiz.questions.length * 0.7 ? (
                    <div className="bg-emerald-500/5 p-4 border border-emerald-500/10 rounded-xl">
                      <span className="text-emerald-400 text-xs font-bold font-mono uppercase block">★ Certificate of Achievement Unlocked</span>
                      <span className="text-[10px] text-slate-500 block mt-1 font-mono">Module fully certified under standard regulations.</span>
                    </div>
                  ) : (
                    <div className="bg-rose-500/5 p-4 border border-rose-500/10 rounded-xl">
                      <span className="text-rose-400 text-xs font-bold font-mono uppercase block">✗ Certification Denied</span>
                      <span className="text-[10px] text-slate-500 block mt-1 font-mono">Requires at least 70% pass rate. Retake test anytime.</span>
                    </div>
                  )}

                  <div className="flex justify-center gap-3 pt-4">
                    <button
                      onClick={resetQuiz}
                      className="px-4 py-2 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs font-semibold text-slate-300"
                    >
                      Retry Assessment
                    </button>
                    <button
                      onClick={onBack}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Back to Command Center
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Immersive SECURE NETWORK REDIRECT SIMULATION OVERLAY */}
      {redirectingResource && (
        <div id="redirect-overlay" className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl relative overflow-hidden">
            {/* Ambient secure background scanning lines */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

            <div className="text-center space-y-2">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400">
                <Globe className="w-8 h-8 animate-pulse text-cyan-400" />
                <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping" style={{ animationDuration: '3s' }} />
              </div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                Establishing Secure Link
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">
                No local tracking | Open Education Connection
              </p>
            </div>

            {/* Network handshake terminal simulation */}
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-2 font-mono text-[10px]">
              <div className="flex justify-between text-slate-500 border-b border-slate-850 pb-1.5 mb-2">
                <span>CONNECTION STATUS</span>
                <span className="text-cyan-400 font-bold animate-pulse">ACTIVE</span>
              </div>

              <div className="space-y-1 text-slate-300 text-left">
                <div className={`transition-opacity duration-300 ${redirectProgress >= 0 ? 'opacity-100' : 'opacity-20'}`}>
                  <span className="text-emerald-400">✔</span> [DNS] Resolved <span className="text-cyan-300">{new URL(redirectingResource.url).hostname}</span>
                </div>
                <div className={`transition-opacity duration-300 ${redirectProgress >= 25 ? 'opacity-100' : 'opacity-20'}`}>
                  <span className={redirectProgress >= 25 ? 'text-emerald-400' : 'text-slate-600'}>{redirectProgress >= 25 ? '✔' : '◷'}</span> [TCP] Port 443 Handshake SYN/ACK established
                </div>
                <div className={`transition-opacity duration-300 ${redirectProgress >= 50 ? 'opacity-100' : 'opacity-20'}`}>
                  <span className={redirectProgress >= 50 ? 'text-emerald-400' : 'text-slate-600'}>{redirectProgress >= 50 ? '✔' : '◷'}</span> [TLS] TLS_AES_256_GCM_SHA384 active
                </div>
                <div className={`transition-opacity duration-300 ${redirectProgress >= 75 ? 'opacity-100' : 'opacity-20'}`}>
                  <span className={redirectProgress >= 75 ? 'text-emerald-400' : 'text-slate-600'}>{redirectProgress >= 75 ? '✔' : '◷'}</span> [ROUTER] Safe sandbox routing tunnel initiated
                </div>
                <div className={`transition-opacity duration-300 ${redirectProgress >= 100 ? 'opacity-100' : 'opacity-20'}`}>
                  <span className={redirectProgress >= 100 ? 'text-emerald-400' : 'text-slate-600'}>{redirectProgress >= 100 ? '✔' : '◷'}</span> [COMPLETED] Forwarding to {redirectingResource.platform}...
                </div>
              </div>
            </div>

            {/* Custom Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>PACKETS TRANSFERRED</span>
                <span>{Math.round(redirectProgress)}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 border border-slate-850 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-violet-500 h-full transition-all duration-300"
                  style={{ width: `${redirectProgress}%` }}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-between gap-3">
              <button
                onClick={() => setRedirectingResource(null)}
                className="flex-1 py-2 bg-slate-950 border border-slate-850 text-slate-400 hover:text-white rounded-xl text-[10px] font-mono transition-colors"
              >
                Cancel Sandbox Request
              </button>
              <a
                href={redirectingResource.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setRedirectingResource(null)}
                className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-slate-950 hover:brightness-110 font-bold text-center rounded-xl text-[10px] font-mono transition-all flex items-center justify-center gap-1"
              >
                Launch Instantly
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
