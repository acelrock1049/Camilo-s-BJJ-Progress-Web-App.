import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { surveyQuestions, type SdColor } from '../data/surveyQuestions';

type Question = (typeof surveyQuestions)[number];

/* ── WebGL2 Belt Wave Canvas ── */
const VERT_SRC = `#version 300 es
in vec2 a_position;
void main(){gl_Position=vec4(a_position,0,1);}`;

const FRAG_SRC = `#version 300 es
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
out vec4 fragColor;
void main(){
  vec2 p=(gl_FragCoord.xy*2.0-u_resolution)/min(u_resolution.x,u_resolution.y);
  float t=u_time*0.8;
  float wave=sin(p.y*3.0+t)*0.15+sin(p.y*5.5-t*1.3)*0.08;
  float dist=abs(p.x-wave);
  float core=smoothstep(0.012,0.003,dist);
  float glow=0.015/(dist+0.008);
  vec3 mainColor=vec3(0.08)*core+vec3(0.9,0.1,0.05)*glow*0.3;
  vec3 aberr=vec3(0.0);
  vec3 colors[4];
  colors[0]=vec3(1.0);
  colors[1]=vec3(0.133,0.333,1.0);
  colors[2]=vec3(0.5,0.0,0.5);
  colors[3]=vec3(0.396,0.263,0.129);
  for(int i=0;i<4;i++){
    float fi=float(i);
    float off=(fi+1.0)*0.025+sin(t*0.5+fi)*0.01;
    float bw=sin(p.y*3.0+t+fi*0.7)*0.15+sin(p.y*5.5-t*1.3+fi*0.5)*0.08;
    float bx=bw+off*(mod(fi,2.0)*2.0-1.0);
    float bd=abs(p.x-bx);
    aberr+=colors[i]*(0.004/(bd+0.006))*0.4;
  }
  vec3 color=vec3(0.082)+mainColor+aberr;
  float vignette=1.0-length(p*vec2(0.5,0.4))*0.3;
  fragColor=vec4(color*vignette,1.0);
}`;

function BeltWaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERT_SRC);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAG_SRC);
    gl.compileShader(fs);

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');

    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let t = 0;
    let raf: number;
    const draw = () => {
      t += 0.01;
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
      gl.deleteVertexArray(vao);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleQuestions(qs: Question[]): Question[] {
  return shuffle(qs).map(q => ({ ...q, answers: shuffle(q.answers) }));
}

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SurveyModal: React.FC<SurveyModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0); // 0: Intro, 1-8: Questions, 9: Reveal, 10: Results
  const [shuffledQuestions, setShuffledQuestions] = useState(() => shuffleQuestions(surveyQuestions));
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

  // Lock body scroll when modal is open & re-shuffle on each open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setShuffledQuestions(shuffleQuestions(surveyQuestions));
      setStep(0);
      setScores({ white: 0, red: 0, blue: 0, orange: 0, green: 0, yellow: 0 });
      setEmail('');
      setName('');
      setLeadSubmitted(false);
      setSubmitError('');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Auto-transition from reveal to results
  useEffect(() => {
    if (step === 9) {
      const timer = setTimeout(() => setStep(10), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (!isOpen) return null;

  const handleAnswer = (color: SdColor) => {
    const newScores = { ...scores, [color]: scores[color] + 1 };
    setScores(newScores);
    // After last question, go to reveal animation before results
    if (step === surveyQuestions.length) {
      setStep(9);
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
        Discover your true Jiu-Jitsu psychological rank.
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
    const question = shuffledQuestions[qIndex];

    return (
      <motion.div
        key={`q-${qIndex}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
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
          {question.answers.map((ans, i) => (
            <motion.button
              key={ans.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06, duration: 0.35 }}
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

  const renderReveal = () => (
    <motion.div
      key="reveal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 flex flex-col items-center justify-center z-20"
      style={{ backgroundColor: '#151515' }}
    >
      <BeltWaveCanvas />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-white/70 text-xl md:text-2xl font-editorial tracking-wide z-10"
      >
        Calculating your mindset...
      </motion.p>
    </motion.div>
  );

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
        className={`fixed inset-0 z-[100] overflow-hidden ${
          step === 9 ? 'bg-[#151515]' : 'bg-neutral-50/95 backdrop-blur-3xl'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-6 right-6 w-12 h-12 backdrop-blur-md rounded-full flex items-center justify-center transition-colors z-50 shadow-sm ${
            step === 9
              ? 'bg-white/10 border border-white/20 text-white/60 hover:text-white hover:bg-white/20'
              : 'bg-white/50 border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-white'
          }`}
        >
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-full h-full relative z-10">
          <AnimatePresence mode="wait">
            {step === 0 && <React.Fragment key="intro">{renderIntro()}</React.Fragment>}
            {step > 0 && step <= surveyQuestions.length && <React.Fragment key={`q-${step}`}>{renderQuestion()}</React.Fragment>}
            {step === 9 && <React.Fragment key="reveal">{renderReveal()}</React.Fragment>}
            {step === 10 && <React.Fragment key="results">{renderResults()}</React.Fragment>}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
