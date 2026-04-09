import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { surveyQuestions, type SdColor } from '../data/surveyQuestions';

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SurveyModal: React.FC<SurveyModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0); // 0: Intro, 1-8: Questions, 10: Results
  const [scores, setScores] = useState<Record<SdColor, number>>({
    white: 0,
    red: 0,
    blue: 0,
    orange: 0,
    green: 0,
    yellow: 0
  });

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAnswer = (color: SdColor) => {
    const newScores = { ...scores, [color]: scores[color] + 1 };
    setScores(newScores);
    // After last question, jump straight to results (skip lead gate)
    if (step === surveyQuestions.length) {
      setStep(10);
    } else {
      setStep(prev => prev + 1);
    }
  };

  // Calculate the dominant belt color
  const getDominantBeltColor = (): SdColor => {
    return Object.entries(scores).reduce((a, b) => 
      b[1] > a[1] ? b : a
    )[0] as SdColor;
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    setSubmitError('');

    const dominantBeltColor = getDominantBeltColor();

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/ingest-survey-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: email.toLowerCase().trim(),
          dominant_belt_color: dominantBeltColor,
          scores,
          survey_completed_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(err.error || 'Failed to save results');
      }

      setLeadSubmitted(true);
    } catch (err) {
      console.error('Survey submission error:', err);
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      // Graceful degradation — still mark as submitted so user isn't stuck
      setLeadSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatePercentages = () => {
    const totalQuestions = surveyQuestions.length;
    return {
      white: Math.round((scores.white / totalQuestions) * 100),
      red: Math.round((scores.red / totalQuestions) * 100),
      blue: Math.round((scores.blue / totalQuestions) * 100),
      orange: Math.round((scores.orange / totalQuestions) * 100),
      green: Math.round((scores.green / totalQuestions) * 100),
      yellow: Math.round((scores.yellow / totalQuestions) * 100),
    };
  };

  const renderIntro = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto px-6"
    >
      <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 mb-6 drop-shadow-sm font-editorial">
        Discover your Psychological Belt
      </h2>
      <p className="text-lg md:text-xl text-neutral-600 font-light mb-12 max-w-lg leading-relaxed">
        Jiu-Jitsu is a physical language, but how you learn it depends on your mind. This short survey will map your current mental framework to a psychological BJJ belt.
      </p>
      <button
        onClick={() => setStep(1)}
        className="px-10 py-4 bg-neutral-900 text-white rounded-full font-medium text-lg tracking-wide hover:bg-neutral-800 transition-colors shadow-xl"
      >
        Start the Journey
      </button>
    </motion.div>
  );

  const renderQuestion = () => {
    const qIndex = step - 1;
    const question = surveyQuestions[qIndex];

    return (
      <motion.div
        key={`q-${qIndex}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col h-full max-w-3xl mx-auto"
      >
        {/* Fixed header — progress + question text, never scrolls */}
        <div className="flex-shrink-0 px-6 pt-10 pb-4">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm font-semibold tracking-widest text-neutral-400 uppercase whitespace-nowrap">
              {step} / {surveyQuestions.length}
            </span>
            <div className="flex-1 bg-neutral-200 h-1 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-neutral-900"
                initial={{ width: `${((step - 1) / surveyQuestions.length) * 100}%` }}
                animate={{ width: `${(step / surveyQuestions.length) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-semibold text-neutral-900 leading-tight font-editorial">
            {question.text}
          </h3>

          {question.context && (
            <p className="text-sm text-neutral-500 italic mt-2">
              {question.context}
            </p>
          )}
        </div>

        {/* Scrollable answers — fills remaining height, scrollbar always visible */}
        <div
          className="survey-scroll flex-1 min-h-0 overflow-y-auto px-6 pb-8 space-y-3"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.18) transparent' }}
        >
          {question.answers.map((ans) => (
            <motion.button
              key={ans.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleAnswer(ans.color)}
              className="w-full text-left p-4 md:p-5 bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-5 h-5 rounded-full border-2 border-neutral-300 flex-shrink-0 mt-0.5 group-hover:border-neutral-900 transition-colors" />
                <span className="text-base md:text-lg text-neutral-800 font-light leading-snug group-hover:text-neutral-900">
                  {ans.text}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  };


  const getBeltLabel = (color: string) => {
    switch(color) {
      case 'white': return { name: 'White / Beige Mode', desc: 'Instinct, survival, safety.' };
      case 'red': return { name: 'Red Mode', desc: 'Power, challenge, ego validation.' };
      case 'blue': return { name: 'Blue Mode', desc: 'Order, system, absolute rules.' };
      case 'orange': return { name: 'Orange Mode', desc: 'Achievement, optimization, success.' };
      case 'green': return { name: 'Green Mode', desc: 'Community, connection, empathy.' };
      case 'yellow': return { name: 'Yellow Mode', desc: 'Systemic thinking, flow, big picture.' };
      default: return { name: 'Belt', desc: '' };
    }
  };

  const getColorHex = (color: string) => {
    switch(color) {
      case 'white': return '#E5E7EB'; // gray-200 for visibility
      case 'red': return '#EF4444';
      case 'blue': return '#3B82F6';
      case 'orange': return '#F97316';
      case 'green': return '#10B981';
      case 'yellow': return '#EAB308';
      default: return '#000000';
    }
  };

  const renderResults = () => {
    const percentages = calculatePercentages();
    // Sort colors by percentage descending
    const sortedResults = Object.entries(percentages)
      .filter(([_, val]) => val > 0)
      .sort((a, b) => b[1] - a[1]);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col h-full max-w-4xl mx-auto"
      >
        {/* Fixed results header */}
        <div className="flex-shrink-0 text-center px-6 pt-10 pb-6">
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-3 tracking-tight drop-shadow-sm font-editorial">
            Your Mindset Map
          </h2>
          <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto">
            Your psychological breakdown based on instinctual responses — and how it maps to learning on the mats.
          </p>
        </div>

        {/* Scrollable results body */}
        <div
          className="survey-scroll flex-1 min-h-0 overflow-y-auto px-6 pb-10"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.18) transparent' }}
        >
        <div className="w-full max-w-2xl mx-auto space-y-5">
          {sortedResults.map(([color, percentage], index) => (
            <div key={color} className="relative">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h4 className="text-xl font-bold text-neutral-900">{getBeltLabel(color).name}</h4>
                  <p className="text-sm text-neutral-500">{getBeltLabel(color).desc}</p>
                </div>
                <span className="text-2xl font-light text-neutral-900">{percentage}%</span>
              </div>
              <div className="h-4 w-full bg-neutral-200 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: getColorHex(color) }}
                />
              </div>
            </div>
          ))}
        </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-10 max-w-md mx-auto w-full"
          >
            {leadSubmitted ? (
              <div className="text-center space-y-3 py-6">
                <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="white" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-neutral-900 font-semibold text-lg">Analysis sent!</p>
                <p className="text-neutral-500 text-sm">Check your inbox — your mindset breakdown is on its way.</p>
              </div>
            ) : (
              <>
                <p className="text-center text-neutral-500 text-sm mb-4">
                  Enter your details to receive your mindset analysis by email.
                </p>
                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-3 bg-white/80 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-base shadow-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-3 bg-white/80 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-base shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-neutral-900 text-white font-medium text-base rounded-xl hover:bg-neutral-800 transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : 'Send my analysis'}
                  </button>
                  {submitError && (
                    <p className="text-red-500 text-sm text-center">{submitError}</p>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </div>{/* end scrollable results body */}
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[100] bg-neutral-50/95 backdrop-blur-3xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 bg-white/50 backdrop-blur-md border border-neutral-200 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-white transition-colors z-50 shadow-sm"
        >
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-full h-full relative z-10">
          <AnimatePresence mode="wait">
            {step === 0 && <React.Fragment key="intro">{renderIntro()}</React.Fragment>}
            {step > 0 && step <= surveyQuestions.length && <React.Fragment key={`q-${step}`}>{renderQuestion()}</React.Fragment>}
            {step === 10 && <React.Fragment key="results">{renderResults()}</React.Fragment>}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
