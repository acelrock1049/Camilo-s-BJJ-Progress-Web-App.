import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterKey = 'bjj' | 'kids' | 'other';

interface ModeConfig {
  label: string;
  a1: string;
  a2: string;
  bg: string;
  particles: string[];
  textAccent: string;
  badgeBg: string;
  badgeColor: string;
  modeBg: string;
  modeColor: string;
}

interface ClassEntry {
  start: string;
  end: string;
  name: string;
  type: FilterKey;
}

interface DayEntry {
  label: string;
  name: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const MODES: Record<FilterKey, ModeConfig> = {
  bjj: {
    label: 'Adult BJJ',
    a1: '#e63946', a2: '#f4a261',
    bg: 'linear-gradient(135deg,#fff8f5 0%,#fff3ee 50%,#fff8f0 100%)',
    particles: ['#e63946','#f4a261','#ff8a65','#ffd3b6','#e85d04'],
    textAccent: '#c1121f',
    badgeBg: 'rgba(230,57,70,0.12)', badgeColor: '#c1121f',
    modeBg: 'rgba(230,57,70,0.12)', modeColor: '#c1121f',
  },
  kids: {
    label: 'Kids Program',
    a1: '#2dc653', a2: '#ffd60a',
    bg: 'linear-gradient(135deg,#f0fff4 0%,#fffef0 50%,#f4fff6 100%)',
    particles: ['#2dc653','#ffd60a','#52b788','#ffe566','#38b000'],
    textAccent: '#1a7a36',
    badgeBg: 'rgba(45,198,83,0.12)', badgeColor: '#1a7a36',
    modeBg: 'rgba(45,198,83,0.12)', modeColor: '#1a7a36',
  },
  other: {
    label: 'Other Classes',
    a1: '#7209b7', a2: '#4cc9f0',
    bg: 'linear-gradient(135deg,#f8f0ff 0%,#f0faff 50%,#f5f0ff 100%)',
    particles: ['#7209b7','#4cc9f0','#b5179e','#4361ee','#3a0ca3'],
    textAccent: '#560bad',
    badgeBg: 'rgba(114,9,183,0.12)', badgeColor: '#560bad',
    modeBg: 'rgba(114,9,183,0.1)', modeColor: '#560bad',
  },
};

const DAYS: DayEntry[] = [
  { label: 'MON', name: 'Monday' },
  { label: 'TUE', name: 'Tuesday' },
  { label: 'WED', name: 'Wednesday' },
  { label: 'THU', name: 'Thursday' },
  { label: 'FRI', name: 'Friday' },
  { label: 'SAT', name: 'Saturday' },
  { label: 'SUN', name: 'Sunday' },
];

const ALL_CLASSES: Record<number, ClassEntry[]> = {
  0: [
    { start: '6:00',  end: '6:45am',  name: 'Boxing',                   type: 'other' },
    { start: '12:00', end: '12:30pm', name: 'HIIT',                     type: 'other' },
    { start: '6:30',  end: '7:30pm',  name: 'Adult Kung Fu',             type: 'other' },
  ],
  1: [
    { start: '6:00',  end: '6:45am',  name: 'Boxing',                    type: 'other' },
    { start: '12:00', end: '12:30pm', name: 'HIIT',                      type: 'other' },
    { start: '5:00',  end: '5:50pm',  name: 'Kids BJJ',                  type: 'kids'  },
    { start: '6:00',  end: '7:00pm',  name: 'Adult BJJ Beginners',       type: 'bjj'   },
    { start: '7:00',  end: '8:00pm',  name: 'Adult BJJ Intermediate',    type: 'bjj'   },
  ],
  2: [
    { start: '12:00', end: '12:30pm', name: 'HIIT',                      type: 'other' },
    { start: '5:30',  end: '6:20pm',  name: 'Kung Fu Kids',              type: 'kids'  },
    { start: '6:30',  end: '7:45pm',  name: 'Adult Kung Fu',             type: 'other' },
  ],
  3: [
    { start: '6:00',  end: '7:00pm',  name: 'Fight Choreography',        type: 'other' },
  ],
  4: [
    { start: '6:00',  end: '7:00pm',  name: 'Adult BJJ Beginners',       type: 'bjj'   },
    { start: '7:00',  end: '8:00pm',  name: 'Adult BJJ Intermediate',    type: 'bjj'   },
  ],
  5: [
    { start: '1:00',  end: '3:00pm',  name: 'Adult BJJ Fundamental',     type: 'bjj'   },
  ],
  6: [
    { start: '9:00',  end: '9:50am',  name: 'Kids BJJ',                  type: 'kids'  },
    { start: '10:00', end: '10:50am', name: 'Kung Fu Kids',              type: 'kids'  },
    { start: '11:00', end: '12:00pm', name: 'Adult Kung Fu',             type: 'other' },
  ],
};

// ─── Particle Canvas ──────────────────────────────────────────────────────────

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  color: string;
  alpha: number;
}

function useParticleCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>, colors: string[]) {
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const colorsRef = useRef(colors);

  useEffect(() => { colorsRef.current = colors; }, [colors]);

  const spawnParticle = useCallback((w: number, h: number): Particle => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: 1 + Math.random() * 3,
    color: colorsRef.current[Math.floor(Math.random() * colorsRef.current.length)],
    alpha: 0.15 + Math.random() * 0.35,
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const COUNT = 55;
    particlesRef.current = Array.from({ length: COUNT }, () =>
      spawnParticle(canvas.offsetWidth, canvas.offsetHeight)
    );

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) {
          const fresh = spawnParticle(w, h);
          Object.assign(p, fresh);
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [canvasRef, spawnParticle]);
}

// ─── Mobile Class Card ────────────────────────────────────────────────────────

function ClassCard({ cls, index }: { cls: ClassEntry; index: number }) {
  const cardMode = MODES[cls.type];
  const barGradient = `linear-gradient(to bottom, ${cardMode.a1}, ${cardMode.a2})`;

  return (
    <div
      className="tt-card"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 4, borderRadius: '18px 0 0 18px',
        background: barGradient, transition: 'background 0.5s',
      }} />
      <div className="tt-card-time">
        <div className="tt-card-start">{cls.start}</div>
        <div className="tt-card-end">{cls.end}</div>
      </div>
      <div className="tt-card-divider" />
      <div className="tt-card-info">
        <div className="tt-card-name">{cls.name}</div>
        <span className="tt-card-badge" style={{ background: cardMode.badgeBg, color: cardMode.badgeColor }}>
          {cardMode.label}
        </span>
      </div>
      <div className="tt-card-arrow">›</div>
    </div>
  );
}

// ─── Desktop Compact Card ─────────────────────────────────────────────────────

function DesktopCard({ cls }: { cls: ClassEntry }) {
  const cardMode = MODES[cls.type];
  const barGradient = `linear-gradient(to bottom, ${cardMode.a1}, ${cardMode.a2})`;

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.9)',
      borderRadius: 14,
      padding: '10px 12px 10px 18px',
      cursor: 'pointer',
      transition: 'transform 0.15s, box-shadow 0.15s',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 18px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '';
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 3, borderRadius: '12px 0 0 12px',
        background: barGradient,
      }} />
      <div style={{ fontSize: 13, fontWeight: 900, color: '#111', lineHeight: 1.2 }}>
        {cls.start}
        <span style={{ fontWeight: 400, color: '#aaa', marginLeft: 3, fontSize: 11 }}>{cls.end}</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#222', marginTop: 3, lineHeight: 1.3 }}>
        {cls.name}
      </div>
      <span style={{
        display: 'inline-block', marginTop: 5,
        fontSize: 10, fontWeight: 700,
        padding: '2px 8px', borderRadius: 20,
        background: cardMode.badgeBg, color: cardMode.badgeColor,
        letterSpacing: '0.04em',
      }}>
        {cardMode.label}
      </span>
    </div>
  );
}

// ─── Desktop 7-Column Calendar ────────────────────────────────────────────────

function DesktopCalendar({ filter, mode, accentGradient, onBook }: {
  filter: FilterKey;
  mode: ModeConfig;
  accentGradient: string;
  onBook?: () => void;
}) {
  return (
    <div style={{ position: 'relative', zIndex: 2, padding: '0 36px 0' }}>
      {/* 7-col grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 12,
      }}>
        {DAYS.map((day, i) => {
          const allDayClasses = ALL_CLASSES[i] ?? [];
          const filteredClasses = allDayClasses.filter(c => c.type === filter);
          const hasMatch = filteredClasses.length > 0;

          return (
            <div
              key={i}
              style={{
                opacity: hasMatch ? 1 : 0.35,
                transition: 'opacity 0.4s',
              }}
            >
              {/* Day header */}
              <div style={{
                textAlign: 'center',
                marginBottom: 8,
                paddingBottom: 8,
                borderBottom: `2px solid ${hasMatch ? mode.a1 : 'rgba(0,0,0,0.08)'}`,
                transition: 'border-color 0.4s',
              }}>
                <div style={{
                  fontSize: 13, fontWeight: 900,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: hasMatch ? mode.textAccent : '#bbb',
                  transition: 'color 0.4s',
                }}>
                  {day.label}
                </div>
                {hasMatch && (
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: mode.a1, margin: '4px auto 0',
                    transition: 'background 0.4s',
                  }} />
                )}
              </div>

              {/* Class cards for this day */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {filteredClasses.length > 0
                  ? filteredClasses.map((cls, j) => (
                    <DesktopCard key={`${cls.name}-${j}`} cls={cls} />
                  ))
                  : (
                    <div style={{
                      textAlign: 'center', padding: '12px 4px',
                      fontSize: 10, color: '#ccc', fontStyle: 'italic',
                    }}>
                      —
                    </div>
                  )
                }
              </div>
            </div>
          );
        })}
      </div>

      {/* Book button */}
      <button
        onClick={onBook}
        style={{
          marginTop: 24,
          display: 'block', width: '100%',
          padding: 16, borderRadius: 16, border: 'none',
          cursor: 'pointer', color: '#fff',
          fontSize: 15, fontWeight: 900,
          letterSpacing: '0.05em', textTransform: 'uppercase',
          background: accentGradient, transition: 'all 0.4s',
          minHeight: 44,
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        Book a Trial Class
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export interface WeeklyTimetableProps {
  onBook?: () => void;
  className?: string;
}

export function WeeklyTimetable({ onBook, className = '' }: WeeklyTimetableProps) {
  const [filter, setFilter] = useState<FilterKey>('bjj');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [cardKey, setCardKey] = useState(0);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mode = MODES[filter];

  useParticleCanvas(canvasRef, mode.particles);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);

  const daysWithFilter = DAYS.map((_, i) =>
    (ALL_CLASSES[i] ?? []).some(c => c.type === filter)
  );

  const handleFilterChange = (newFilter: FilterKey) => {
    setFilter(newFilter);
    const firstValid = DAYS.findIndex((_, i) =>
      (ALL_CLASSES[i] ?? []).some(c => c.type === newFilter)
    );
    setSelectedDay(firstValid >= 0 ? firstValid : 0);
    setCardKey(k => k + 1);
  };

  const handleDayChange = (idx: number) => {
    if (idx === selectedDay) return;
    setSelectedDay(idx);
    setCardKey(k => k + 1);
  };

  const visibleClasses = (ALL_CLASSES[selectedDay] ?? []).filter(c => c.type === filter);
  const accentGradient = `linear-gradient(135deg, ${mode.a1}, ${mode.a2})`;

  return (
    <>
      <style>{`
        .tt-card{background:rgba(255,255,255,0.55);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.9);border-radius:18px;padding:16px 18px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;position:relative;overflow:hidden;}
        .tt-card:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,0.1);}
        .tt-card:active{transform:scale(0.98);}
        @keyframes cardIn{from{opacity:0;transform:translateY(16px) scale(0.97);}to{opacity:1;transform:translateY(0) scale(1);}}
        .tt-card{animation:cardIn 0.32s cubic-bezier(0.34,1.2,0.64,1) both;}
        .tt-card-time{min-width:60px;}
        .tt-card-start{font-size:16px;font-weight:900;color:#111;line-height:1;}
        .tt-card-end{font-size:11px;color:#aaa;margin-top:2px;}
        .tt-card-divider{width:1px;height:36px;background:rgba(0,0,0,0.08);flex-shrink:0;}
        .tt-card-info{flex:1;}
        .tt-card-name{font-size:14px;font-weight:800;color:#111;line-height:1.2;}
        .tt-card-badge{display:inline-block;margin-top:4px;font-size:10px;font-weight:700;padding:2px 10px;border-radius:20px;letter-spacing:0.04em;}
        .tt-card-arrow{font-size:20px;color:rgba(0,0,0,0.12);font-weight:300;}
        @keyframes fadeLabel{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}
        .tt-mode-label{animation:fadeLabel 0.35s ease both;}
      `}</style>

      <div
        className={className}
        style={{
          position: 'relative',
          minHeight: isDesktop ? 'auto' : 680,
          overflow: 'hidden',
          borderRadius: isDesktop ? 24 : 20,
          fontFamily: 'system-ui, sans-serif',
          padding: '0 0 32px',
          transition: 'background 0.6s ease',
          background: mode.bg,
        }}
      >
        {/* Particle canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 0,
          }}
        />

        {/* Header */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column',
          alignItems: isDesktop ? 'center' : 'center',
          justifyContent: isDesktop ? 'space-between' : 'center',
          padding: isDesktop ? '36px 36px 24px' : '32px 20px 16px',
          textAlign: isDesktop ? 'left' : 'center',
          gap: isDesktop ? 16 : 0,
        }}>
          {/* Title block */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', marginBottom: 4,
              color: mode.textAccent, transition: 'color 0.5s',
            }}>
              Weekly Schedule
            </div>
            <h2 style={{
              fontSize: isDesktop ? 34 : 30, fontWeight: 900, color: '#111',
              lineHeight: 1.1, letterSpacing: -1, margin: 0,
            }}>
              Find your{' '}
              <span style={{ color: mode.a1, transition: 'color 0.5s' }}>class</span>
            </h2>
          </div>

          {/* Filter pills — inline on desktop */}
          <div style={{
            display: 'flex', gap: 8,
            justifyContent: isDesktop ? 'flex-end' : 'center',
            flexWrap: 'wrap',
            marginTop: isDesktop ? 0 : 12,
          }}>
            {(['bjj', 'kids', 'other'] as FilterKey[]).map(key => {
              const isActive = filter === key;
              return (
                <button
                  key={key}
                  onClick={() => handleFilterChange(key)}
                  style={{
                    padding: isDesktop ? '7px 16px' : '8px 18px',
                    borderRadius: 30, fontSize: 12, fontWeight: 700,
                    border: isActive ? '2px solid transparent' : '2px solid rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    background: isActive ? accentGradient : 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(12px)',
                    color: isActive ? '#fff' : '#666',
                    transition: 'all 0.3s',
                    letterSpacing: '0.02em',
                    minHeight: 36,
                  }}
                >
                  {MODES[key].label}
                </button>
              );
            })}

            {/* Mode badge — only on mobile */}
            {!isDesktop && (
              <span
                className="tt-mode-label"
                key={filter}
                style={{
                  display: 'inline-block', marginTop: 2,
                  fontSize: 11, fontWeight: 800, letterSpacing: '0.12em',
                  textTransform: 'uppercase', padding: '4px 14px',
                  borderRadius: 20,
                  background: mode.modeBg, color: mode.modeColor,
                  transition: 'background 0.5s,color 0.5s',
                  alignSelf: 'center',
                }}
              >
                {mode.label}
              </span>
            )}
          </div>
        </div>

        {/* ── DESKTOP: 7-column calendar ── */}
        {isDesktop && (
          <DesktopCalendar
            filter={filter}
            mode={mode}
            accentGradient={accentGradient}
            onBook={onBook}
          />
        )}

        {/* ── MOBILE: Day selector + panel ── */}
        {!isDesktop && (
          <>
            {/* Day selector */}
            <div style={{
              display: 'flex', gap: 6, padding: '4px 16px 20px',
              position: 'relative', zIndex: 2,
              overflowX: 'auto', scrollbarWidth: 'none',
            }}>
              {DAYS.map((day, i) => {
                const hasClass = daysWithFilter[i];
                const isSelected = selectedDay === i;
                return (
                  <button
                    key={i}
                    onClick={() => hasClass && handleDayChange(i)}
                    style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: 4,
                      minWidth: 48, cursor: hasClass ? 'pointer' : 'default',
                      flexShrink: 0, paddingTop: 8,
                      background: 'none', border: 'none',
                    }}
                  >
                    <div style={{
                      width: 46, height: 46, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 800,
                      background: isSelected ? accentGradient : hasClass ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.5)',
                      border: isSelected ? '1.5px solid transparent' : '1.5px solid rgba(0,0,0,0.08)',
                      backdropFilter: 'blur(10px)',
                      color: isSelected ? '#fff' : hasClass ? '#555' : '#aaa',
                      opacity: hasClass || isSelected ? 1 : 0.3,
                      transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                      flexShrink: 0,
                    }}>
                      {day.label.charAt(0) + day.label.slice(1, 2).toLowerCase()}
                    </div>
                    <span style={{
                      fontSize: 9, fontWeight: isSelected ? 900 : 700,
                      letterSpacing: '0.08em',
                      color: isSelected ? mode.textAccent : hasClass ? '#888' : '#bbb',
                      textTransform: 'uppercase', transition: 'color 0.4s',
                    }}>
                      {day.label}
                    </span>
                    <div style={{
                      width: 5, height: 5, borderRadius: '50%', marginTop: 1,
                      background: hasClass ? (isSelected ? mode.a1 : 'rgba(0,0,0,0.15)') : 'transparent',
                      transition: 'background 0.5s',
                    }} />
                  </button>
                );
              })}
            </div>

            {/* Classes panel */}
            <div style={{ padding: '0 16px', position: 'relative', zIndex: 2 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', marginBottom: 12,
                color: mode.textAccent, transition: 'color 0.4s',
              }}>
                {DAYS[selectedDay].name}
              </div>

              <div key={cardKey} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {visibleClasses.length === 0 ? (
                  <div style={{
                    textAlign: 'center', padding: '48px 20px',
                    background: 'rgba(255,255,255,0.4)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: 18,
                    border: '1px dashed rgba(0,0,0,0.1)',
                  }}>
                    <span style={{ fontSize: 14, color: '#bbb', fontWeight: 600 }}>
                      No classes this day
                    </span>
                  </div>
                ) : (
                  visibleClasses.map((cls, i) => (
                    <ClassCard key={`${cls.name}-${i}`} cls={cls} index={i} />
                  ))
                )}
              </div>
            </div>

            {/* Book button — mobile */}
            <button
              onClick={onBook}
              style={{
                margin: '24px 16px 0',
                display: 'block', width: 'calc(100% - 32px)',
                padding: 16, borderRadius: 16, border: 'none',
                cursor: 'pointer', color: '#fff',
                fontSize: 15, fontWeight: 900,
                letterSpacing: '0.05em', textTransform: 'uppercase',
                background: accentGradient, transition: 'all 0.5s',
                position: 'relative', zIndex: 2, minHeight: 44,
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Book a Trial Class
            </button>
          </>
        )}
      </div>
    </>
  );
}
