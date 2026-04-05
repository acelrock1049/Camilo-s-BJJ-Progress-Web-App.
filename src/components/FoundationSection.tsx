import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// GLOBAL CSS — injected once via <style> tag
// Pure CSS hover + .sq-active class for mobile tap support
// ─────────────────────────────────────────────────────────────

const CSS = `
  /* Squircle ring pulse on hover */
  .sq-squircle {
    transition: background-color .35s ease, border-color .35s ease, box-shadow .35s ease;
  }
  .sq-card:hover .sq-squircle,
  .sq-card.sq-active .sq-squircle {
    background-color: rgba(255,255,255,.88) !important;
    border-color: var(--sq-accent) !important;
    box-shadow: 0 0 0 5px var(--sq-glow);
  }

  /* ── SVG lines: draw from squircle right edge ── */
  .sq-line {
    stroke-dasharray: 300;
    stroke-dashoffset: 300;
    transition: stroke-dashoffset .42s cubic-bezier(.25,1,.5,1);
  }
  .sq-card:hover .sq-l0, .sq-card.sq-active .sq-l0 { stroke-dashoffset: 0; transition-delay: .04s; }
  .sq-card:hover .sq-l1, .sq-card.sq-active .sq-l1 { stroke-dashoffset: 0; transition-delay: .11s; }
  .sq-card:hover .sq-l2, .sq-card.sq-active .sq-l2 { stroke-dashoffset: 0; transition-delay: .18s; }

  /* ── SVG endpoint dots ── */
  .sq-dot {
    opacity: 0;
    transition: opacity .22s ease;
  }
  .sq-card:hover .sq-d0, .sq-card.sq-active .sq-d0 { opacity: 1; transition-delay: .28s; }
  .sq-card:hover .sq-d1, .sq-card.sq-active .sq-d1 { opacity: 1; transition-delay: .33s; }
  .sq-card:hover .sq-d2, .sq-card.sq-active .sq-d2 { opacity: 1; transition-delay: .38s; }

  /* ── Bullet rows: slide in ── */
  .sq-brow {
    opacity: 0;
    transform: translateX(-8px);
    transition: opacity .28s ease, transform .28s ease;
  }
  .sq-card:hover .sq-br0, .sq-card.sq-active .sq-br0 { opacity:1; transform:translateX(0); transition-delay:.07s; }
  .sq-card:hover .sq-br1, .sq-card.sq-active .sq-br1 { opacity:1; transform:translateX(0); transition-delay:.14s; }
  .sq-card:hover .sq-br2, .sq-card.sq-active .sq-br2 { opacity:1; transform:translateX(0); transition-delay:.21s; }

  /* ── Bullet text: expand max-width ── */
  .sq-btxt {
    max-width: 0;
    overflow: hidden;
    white-space: nowrap;
    display: block;
    transition: max-width .5s cubic-bezier(.25,1,.5,1);
  }
  .sq-card:hover .sq-bt0, .sq-card.sq-active .sq-bt0 { max-width: 200px; transition-delay: .10s; }
  .sq-card:hover .sq-bt1, .sq-card.sq-active .sq-bt1 { max-width: 200px; transition-delay: .18s; }
  .sq-card:hover .sq-bt2, .sq-card.sq-active .sq-bt2 { max-width: 200px; transition-delay: .26s; }

  /* Card border + shadow transition */
  .sq-card { transition: box-shadow .35s ease, border-color .35s ease; }
`;

// ─────────────────────────────────────────────────────────────
// ICONS — preserve existing, always rendered neutral/active via prop
// ─────────────────────────────────────────────────────────────

const HolisticIcon = ({ active }: { active: boolean }) => (
    <svg viewBox="0 0 80 80" fill="none" className="w-8 h-8" aria-hidden="true">
        <polygon points="40,4 62,14 76,36 76,44 62,66 40,76 18,66 4,44 4,36 18,14"
            stroke={active ? 'url(#hG)' : 'currentColor'} strokeWidth="1.5" fill="none"
            style={{ filter: active ? 'drop-shadow(0 0 5px #eab308)' : 'none', transition: 'filter .4s' }} />
        <polygon points="40,20 58,40 40,60 22,40"
            stroke={active ? 'url(#hG)' : 'currentColor'} strokeWidth="1.5" fill="none" />
        <line x1="40" y1="28" x2="40" y2="52" stroke={active ? '#06b6d4' : 'currentColor'} strokeWidth="1.5" />
        <line x1="28" y1="40" x2="52" y2="40" stroke={active ? '#eab308' : 'currentColor'} strokeWidth="1.5" />
        <circle cx="40" cy="40" r="4" fill={active ? '#eab308' : 'currentColor'} />
        <defs>
            <linearGradient id="hG" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#eab308" /><stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
        </defs>
    </svg>
);

const CommunityIcon = ({ active }: { active: boolean }) => (
    <svg viewBox="0 0 80 80" fill="none" className="w-8 h-8" aria-hidden="true">
        <circle cx="40" cy="16" r="8" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="1.5"
            fill={active ? 'rgba(22,163,74,.15)' : 'none'}
            style={{ filter: active ? 'drop-shadow(0 0 5px #16a34a)' : 'none', transition: 'filter .4s' }} />
        <circle cx="18" cy="62" r="8" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="1.5" fill={active ? 'rgba(22,163,74,.15)' : 'none'} />
        <circle cx="62" cy="62" r="8" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="1.5" fill={active ? 'rgba(22,163,74,.15)' : 'none'} />
        <line x1="34" y1="22" x2="23" y2="55" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="1.2" strokeDasharray={active ? '0' : '3 2'} />
        <line x1="46" y1="22" x2="57" y2="55" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="1.2" strokeDasharray={active ? '0' : '3 2'} />
        <line x1="26" y1="62" x2="54" y2="62" stroke={active ? '#16a34a' : 'currentColor'} strokeWidth="1.2" strokeDasharray={active ? '0' : '3 2'} />
        <circle cx="40" cy="44" r="3" fill={active ? '#22c55e' : 'currentColor'} />
    </svg>
);

const ZeroLockIcon = ({ active }: { active: boolean }) => (
    <svg viewBox="0 0 80 80" fill="none" className="w-8 h-8" aria-hidden="true">
        <rect x="18" y="42" width="44" height="34" rx="6"
            stroke={active ? '#2563eb' : 'currentColor'} strokeWidth="1.5"
            fill={active ? 'rgba(37,99,235,.1)' : 'none'}
            style={{ filter: active ? 'drop-shadow(0 0 5px #2563eb)' : 'none', transition: 'filter .4s' }} />
        <path d="M28 42 V28 a12 12 0 0 1 24 0 V36"
            stroke={active ? '#3b82f6' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" fill="none"
            style={{ transform: active ? 'rotate(12deg)' : 'none', transformOrigin: '52px 36px', transition: 'transform .4s ease-in-out' }} />
        <circle cx="40" cy="57" r="5" stroke={active ? '#2563eb' : 'currentColor'} strokeWidth="1.5" fill="none" />
        <line x1="40" y1="62" x2="40" y2="69" stroke={active ? '#2563eb' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M56 26 L64 18 M60 18 L64 18 L64 22" stroke={active ? '#60a5fa' : 'transparent'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────

const CONCEPTS = [
    {
        id: 'holistic',
        icon: HolisticIcon,
        title: 'Holistic BJJ System',
        subtitle: 'Intelligence over force',
        bullets: [
            'Leverage & biomechanics beat brute force — every time',
            'Technical precision + strategy compound session by session',
            'Every belt = a real psychological and physical evolution',
        ],
        accentFrom: '#eab308',
        accentTo:   '#06b6d4',
        borderActive: 'border-yellow-400/60',
        glowColor: 'rgba(234,179,8,0.18)',
        tagColor: 'text-yellow-600',
        tagBg:    'bg-yellow-400/10 border-yellow-400/25',
    },
    {
        id: 'community',
        icon: CommunityIcon,
        title: 'Healthy Community',
        subtitle: 'Ego-free mats',
        bullets: [
            'Mutual respect — ego gets checked at the door',
            'Shared growth: the best fighters lift others first',
            "You'll actually look forward to every training session",
        ],
        accentFrom: '#16a34a',
        accentTo:   '#22c55e',
        borderActive: 'border-green-500/60',
        glowColor: 'rgba(22,163,74,0.18)',
        tagColor: 'text-green-600',
        tagBg:    'bg-green-400/10 border-green-400/25',
    },
    {
        id: 'zerolocking',
        icon: ZeroLockIcon,
        title: 'Zero Lock-In',
        subtitle: 'Freedom to evolve',
        bullets: [
            'No contracts — start and cancel with one message',
            'We earn your loyalty every week through quality',
            'Stay because you want to grow, never because you must',
        ],
        accentFrom: '#2563eb',
        accentTo:   '#3b82f6',
        borderActive: 'border-blue-500/60',
        glowColor: 'rgba(37,99,235,0.18)',
        tagColor: 'text-blue-600',
        tagBg:    'bg-blue-400/10 border-blue-400/25',
    },
];

// ─────────────────────────────────────────────────────────────
// GEOMETRY CONSTANTS
//
// Squircle: 72 × 72 px, left-padded 16px inside the card.
// SVG anchors at squircle's right-center (position:absolute, right:0, top:50%).
// Lines extend 64 px to the right; Y offsets: top ±32 px, mid 0.
// Bullet column starts at: 16(pad) + 72(sq) + 64(line) + 5(dot) + 6(gap) = 163 px
//
// Card height: 104 px — fits squircle (72) + 16 px pad each side.
// Bullet group (3 rows × 20px + 2 gaps × 12px = 84px) is vertically centered.
// Row centers relative to squircle mid: −32 px, 0, +32 px — matches Y offsets.
// ─────────────────────────────────────────────────────────────

const SQ = 72;         // squircle size
const PAD = 16;        // card left padding
const LINE = 64;       // SVG line horizontal length
const BULLET_LEFT = PAD + SQ + LINE + 5 + 6; // 163 px
const CARD_H = 104;    // fixed card height
const Y_OFF = 32;      // vertical spread of top/bottom lines

function SquircleCard({ concept }: { concept: typeof CONCEPTS[number] }) {
    const [isActive, setIsActive] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const Icon = concept.icon;

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Desktop: CSS :hover handles animations; React state only drives icon + border.
    // Mobile:  click toggles sq-active class → same CSS rules fire.
    return (
        <div
            className={`sq-card relative rounded-2xl border bg-white/50 backdrop-blur-md cursor-default select-none ${isActive ? concept.borderActive : 'border-gray-200/60'} ${isActive ? 'sq-active' : ''}`}
            style={{
                height: CARD_H,
                // CSS custom properties for the pure-CSS hover rules
                ['--sq-accent' as string]: concept.accentFrom,
                ['--sq-glow'   as string]: concept.glowColor,
                boxShadow: isActive
                    ? `0 12px 40px ${concept.glowColor}, 0 0 0 1px ${concept.glowColor}`
                    : '0 4px 20px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={() => !isMobile && setIsActive(true)}
            onMouseLeave={() => !isMobile && setIsActive(false)}
            onClick={() => isMobile && setIsActive(v => !v)}
        >
            {/* Accent gradient bar — top edge */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl pointer-events-none"
                style={{
                    background: `linear-gradient(to right, ${concept.accentFrom}, ${concept.accentTo})`,
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity .35s ease',
                }}
            />

            {/* ── SQUIRCLE ──
                position:absolute, vertically centered left.
                No overflow-hidden — the SVG must escape to the right.
            */}
            <div
                className="sq-squircle absolute flex items-center justify-center"
                style={{
                    left: PAD,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: SQ,
                    height: SQ,
                    borderRadius: '38%',
                    backgroundColor: 'rgba(255,255,255,0.62)',
                    border: `1.5px solid rgba(0,0,0,0.08)`,
                }}
            >
                {/* Icon — color driven by React state */}
                <div style={{ color: isActive ? concept.accentFrom : '#d1d5db', transition: 'color .35s ease' }}>
                    <Icon active={isActive} />
                </div>

                {/*
                  ── SVG LINES ──
                  Anchored at squircle's right-center (position:absolute right:0 top:50%).
                  Width/height: 0 + overflow:visible → lines paint in viewport space.
                  ViewBox coordinates: (0,0) = squircle right-center.
                  Top path   curves up   to (LINE, -Y_OFF)
                  Middle path goes straight to (LINE, 0)
                  Bottom path curves down to (LINE, +Y_OFF)
                */}
                <svg
                    style={{ position: 'absolute', right: 0, top: '50%', width: 0, height: 0, overflow: 'visible' }}
                    aria-hidden="true"
                >
                    {/* Top line: cubic bezier curves upward */}
                    <path
                        className={`sq-line sq-l0`}
                        d={`M 0 0 C ${LINE * 0.22} 0, ${LINE * 0.22} ${-Y_OFF}, ${LINE * 0.44} ${-Y_OFF} L ${LINE} ${-Y_OFF}`}
                        fill="none" stroke={concept.accentFrom} strokeWidth="1.5" strokeLinecap="round"
                    />
                    {/* Middle line: straight */}
                    <path
                        className={`sq-line sq-l1`}
                        d={`M 0 0 L ${LINE} 0`}
                        fill="none" stroke={concept.accentFrom} strokeWidth="1.5" strokeLinecap="round"
                    />
                    {/* Bottom line: cubic bezier curves downward */}
                    <path
                        className={`sq-line sq-l2`}
                        d={`M 0 0 C ${LINE * 0.22} 0, ${LINE * 0.22} ${Y_OFF}, ${LINE * 0.44} ${Y_OFF} L ${LINE} ${Y_OFF}`}
                        fill="none" stroke={concept.accentFrom} strokeWidth="1.5" strokeLinecap="round"
                    />
                    {/* Endpoint dots */}
                    <circle className="sq-dot sq-d0" cx={LINE} cy={-Y_OFF} r="2.5" fill={concept.accentFrom} />
                    <circle className="sq-dot sq-d1" cx={LINE} cy={0}      r="2.5" fill={concept.accentFrom} />
                    <circle className="sq-dot sq-d2" cx={LINE} cy={Y_OFF}  r="2.5" fill={concept.accentFrom} />
                </svg>
            </div>

            {/*
              ── BULLET ROWS ──
              position:absolute, vertically centered.
              Left = squircle-left + SQ + LINE + dot-diameter + gap = 163px.
              Right = 0 → fills remaining card width, naturally capping text.
              Gap 12px between rows. Each row ~20px tall.
              Total 3 rows: 84px centered → row centers at −32, 0, +32 from card mid.
              Matches SVG Y offsets exactly.
            */}
            <div
                style={{
                    position: 'absolute',
                    left: BULLET_LEFT,
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                }}
            >
                {concept.bullets.map((text, i) => (
                    <div key={i} className={`sq-brow sq-br${i} flex items-center gap-2`}>
                        {/* Accent dot */}
                        <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: concept.accentFrom }}
                        />
                        {/* Text — expands from max-width: 0 via CSS */}
                        <span className={`sq-btxt sq-bt${i} text-[13px] text-gray-700 font-light leading-tight`}>
                            {text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// SECTION
// ─────────────────────────────────────────────────────────────

export function FoundationSection() {
    return (
        <section className="relative z-20 w-full px-6 md:px-24 pt-14 pb-16 md:pt-18 md:pb-20">

            {/* Inject CSS once */}
            <style dangerouslySetInnerHTML={{ __html: CSS }} />

            {/* Section header */}
            <motion.div
                className="max-w-7xl mx-auto mb-8 md:mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
                <span className="block text-[10px] font-bold tracking-[0.35em] text-gray-400 uppercase mb-3">
                    The Foundation
                </span>
                <div className="flex flex-col">
                    <span className="font-serif italic text-3xl md:text-4xl text-gray-400 font-normal"
                        style={{ fontFamily: "'Playfair Display', serif" }}>
                        Three principles.
                    </span>
                    <span className="font-sans font-black text-3xl md:text-5xl tracking-tighter text-gray-900 uppercase leading-none mt-1">
                        One system.
                    </span>
                </div>
            </motion.div>

            {/*
              Cards grid.
              Each cell: concept label (always visible) + squircle card below.
              The squircle card has fixed height; SVG lines escape the card via overflow:visible.
              No layout shift — card height never changes.
            */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
                {CONCEPTS.map((concept, i) => (
                    <motion.div
                        key={concept.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.55, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Concept label */}
                        <div className="mb-3 px-1">
                            <span className="block text-[9px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-0.5">
                                {concept.subtitle}
                            </span>
                            <h3 className="font-black text-sm md:text-[15px] uppercase tracking-tight text-gray-900 leading-none">
                                {concept.title}
                            </h3>
                        </div>

                        <SquircleCard concept={concept} />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
