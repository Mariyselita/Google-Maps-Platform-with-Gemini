import React, { useState } from 'react';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  History,
  Landmark,
  Loader2,
  Palette,
  RefreshCw,
  Sparkles,
  Trophy,
  UtensilsCrossed,
  X,
  XCircle,
} from 'lucide-react';
import { fetchQuiz } from '../services/quiz';
import { QuizCategory, QuizData } from '../types';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationName: string;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  locationName,
}) => {
  const [stage, setStage] = useState<'category' | 'loading' | 'quiz' | 'results'>('category');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartCategory = async (category: QuizCategory) => {
    setSelectedCategory(category);
    setStage('loading');
    setIsLoading(true);
    setError(null);

    const result = await fetchQuiz(locationName, category);

    setIsLoading(false);
    if (result.success && result.quiz && result.quiz.questions.length > 0) {
      setQuizData(result.quiz);
      setCurrentIndex(0);
      setSelectedAnswers([]);
      setStage('quiz');
    } else {
      setError(result.error || 'Failed to generate trivia questions. Please try again.');
      setStage('category');
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleNextOrSubmit = () => {
    if (!quizData) return;
    if (currentIndex < quizData.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate score & show results
      setStage('results');
    }
  };

  const handleResetGame = () => {
    setStage('category');
    setSelectedCategory(null);
    setQuizData(null);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setError(null);
  };

  // Compute Score
  const currentQuestion = quizData?.questions[currentIndex];
  const totalQuestions = quizData?.questions.length || 3;
  const score =
    quizData?.questions.reduce((acc, q, idx) => {
      return selectedAnswers[idx] === q.correctAnswerIndex ? acc + 1 : acc;
    }, 0) || 0;

  const getScoreTitle = (s: number) => {
    if (s === 3) return { title: 'Master Urban Explorer!', color: 'text-amber-300', emoji: '🏆' };
    if (s === 2) return { title: 'Knowledgeable Local!', color: 'text-sky-300', emoji: '🌟' };
    if (s === 1) return { title: 'Apprentice Sightseer', color: 'text-indigo-300', emoji: '🧭' };
    return { title: 'Curious Wanderer', color: 'text-slate-300', emoji: '🗺️' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Local Knowledge Challenge
              </h2>
              <p className="text-xs text-slate-400">
                AI Trivia for <span className="text-sky-400 font-semibold">{locationName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Close quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Error Banner if generation failed */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold text-rose-300">Generation Error: </span>
                {error}
              </div>
            </div>
          )}

          {/* STAGE 1: CATEGORY SELECTION */}
          {stage === 'category' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-200">
                  Choose a Trivia Category
                </h3>
                <p className="text-xs text-slate-400">
                  Select which aspect of {locationName} you would like to test your knowledge on:
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-1">
                {/* Option 1: Local cuisine */}
                <button
                  onClick={() => handleStartCategory('Local cuisine')}
                  className="group p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-500/50 text-left transition-all duration-150 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-amber-500/10"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
                        Local cuisine
                      </div>
                      <p className="text-xs text-slate-400">
                        Signature delicacies, culinary traditions, street food & famous flavors
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </button>

                {/* Option 2: Art and culture */}
                <button
                  onClick={() => handleStartCategory('Art and culture')}
                  className="group p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/70 hover:border-sky-500/50 text-left transition-all duration-150 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-sky-500/10"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">
                        Art and culture
                      </div>
                      <p className="text-xs text-slate-400">
                        Architecture, folklore, music, festivals, galleries & creative heritage
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
                </button>

                {/* Option 3: Local history */}
                <button
                  onClick={() => handleStartCategory('Local history')}
                  className="group p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/70 hover:border-indigo-500/50 text-left transition-all duration-150 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-indigo-500/10"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        Local history
                      </div>
                      <p className="text-xs text-slate-400">
                        Founding stories, monumental events, historic figures & urban evolution
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: LOADING */}
          {stage === 'loading' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xl animate-pulse">
                  <Sparkles className="w-6 h-6 animate-spin-slow" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                  Generating 3-Question Quiz...
                </h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Gemini AI is crafting questions about{' '}
                  <span className="text-sky-300 font-medium">{selectedCategory}</span> for{' '}
                  <span className="text-slate-200 font-medium">{locationName}</span>.
                </p>
              </div>
            </div>
          )}

          {/* STAGE 3: TAKING THE QUIZ */}
          {stage === 'quiz' && currentQuestion && (
            <div className="space-y-5">
              {/* Progress and Category Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {selectedCategory}
                  </span>
                  <span className="font-mono text-slate-300">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300"
                    style={{
                      width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl">
                <h3 className="text-sm font-semibold text-slate-100 leading-relaxed">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all duration-150 flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500/15 border-sky-500 text-sky-100 shadow-sm ring-1 ring-sky-500/40'
                          : 'bg-slate-800/30 hover:bg-slate-800/70 border-slate-700/70 text-slate-200'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg font-mono text-xs flex items-center justify-center shrink-0 font-bold transition-colors ${
                          isSelected
                            ? 'bg-sky-500 text-slate-950'
                            : 'bg-slate-700/60 text-slate-400'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STAGE 4: RESULTS AND REVIEW */}
          {stage === 'results' && quizData && (
            <div className="space-y-6">
              {/* Score Showcase Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900 border border-slate-700 text-center space-y-2">
                <div className="text-3xl">{getScoreTitle(score).emoji}</div>
                <h3 className={`text-lg font-bold ${getScoreTitle(score).color}`}>
                  {getScoreTitle(score).title}
                </h3>
                <div className="text-xs text-slate-400">
                  You answered <span className="font-bold text-white text-sm">{score}</span> out of{' '}
                  <span className="font-bold text-white text-sm">{totalQuestions}</span> correctly in{' '}
                  <span className="text-sky-300 font-semibold">{selectedCategory}</span>.
                </div>
              </div>

              {/* Review of Questions & Answers */}
              <div className="space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Quiz Review & Answers
                </div>

                {quizData.questions.map((q, idx) => {
                  const userAnswerIdx = selectedAnswers[idx];
                  const isCorrect = userAnswerIdx === q.correctAnswerIndex;
                  const correctOptionText = q.options[q.correctAnswerIndex];
                  const userOptionText =
                    userAnswerIdx !== undefined ? q.options[userAnswerIdx] : 'None selected';

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border space-y-2.5 text-xs ${
                        isCorrect
                          ? 'bg-emerald-950/20 border-emerald-800/40'
                          : 'bg-rose-950/20 border-rose-800/40'
                      }`}
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-slate-200">
                          {idx + 1}. {q.question}
                        </div>
                        <span
                          className={`shrink-0 flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isCorrect
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Correct
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Incorrect
                            </>
                          )}
                        </span>
                      </div>

                      {/* Answers Breakdown */}
                      <div className="space-y-1.5 pt-1 text-[11px]">
                        {!isCorrect && (
                          <div className="text-rose-300 flex items-center gap-1.5">
                            <span className="text-slate-400">Your Answer:</span>
                            <span className="line-through">{userOptionText}</span>
                          </div>
                        )}
                        <div className="text-emerald-300 flex items-center gap-1.5 font-medium">
                          <span className="text-slate-400">Correct Answer:</span>
                          <span>{correctOptionText}</span>
                        </div>
                      </div>

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg">
                          <span className="font-semibold text-sky-400">Did you know? </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          {stage === 'quiz' && (
            <>
              <button
                onClick={handleResetGame}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Change Category
              </button>

              <button
                onClick={handleNextOrSubmit}
                disabled={selectedAnswers[currentIndex] === undefined}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed shadow-md"
              >
                {currentIndex < totalQuestions - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  'Submit Quiz'
                )}
              </button>
            </>
          )}

          {stage === 'results' && (
            <>
              <button
                onClick={handleResetGame}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg transition-colors border border-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                Play Another Category
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
              >
                Done
              </button>
            </>
          )}

          {stage === 'category' && (
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] text-slate-500">3 questions · Multiple choice</span>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {stage === 'loading' && (
            <div className="w-full flex justify-end">
              <button
                onClick={handleResetGame}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
