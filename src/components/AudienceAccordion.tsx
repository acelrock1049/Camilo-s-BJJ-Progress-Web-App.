/**
 * AudienceAccordion — balanced, inline-expanding audience selector.
 *
 * Replaces the old "card → modal" pattern that left Kids dominating the page.
 * Three peer teasers (Kids / Adults / Women), permanent and equal. Clicking one
 * expands its rich content INLINE on the same page (one at a time, accordion).
 *
 *  - Kids  → full panel (KidsSection), the campaign lead.
 *  - Adults / Women → lighter panels for now (enriched in phase 2).
 *
 * Deep dives reuse existing pieces: onOpenMethod (KidsModal), onSpiralOpen
 * (SpiralExperience), onWomensModal. Booking reuses TrialBookingModal via onBookTrial.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import imgWomens from '../assets/paula-camilo.jpeg';
import imgSelfImprovement from '../assets/self-improvement.jpg';
import imgBjjKids from '../assets/bjj-kids-banner.jpg';
import KidsSection from './KidsSection';
import WomensPanel from './WomensPanel';

type Audience = 'kids' | 'adults' | 'women';

interface AudienceAccordionProps {
  onBookTrial: (interest: string) => void;
  onSpiralOpen: () => void;
}

const TEASERS: {
  id: Audience; title: string; short: string; img: string;
  rgb: string; from: string; to: string;
}[] = [
  { id: 'kids',   title: 'BJJ Kids',                short: 'Confidence and real skills, the safe way. Ages 5 to 10.',          img: imgBjjKids,         rgb: '22,163,74',  from: '#16a34a', to: '#22c55e' },
  { id: 'adults', title: 'Adults · Self-Improvement', short: 'Technique over brute force. A real challenge, in a safe space.', img: imgSelfImprovement, rgb: '234,179,8',  from: '#eab308', to: '#06b6d4' },
  { id: 'women',  title: "Women's Training",        short: 'Empowerment, real self-defence and community.',                   img: imgWomens,          rgb: '236,72,153', from: '#ec4899', to: '#f43f5e' },
];

export default function AudienceAccordion({ onBookTrial, onSpiralOpen }: AudienceAccordionProps) {
  const [selected, setSelected] = useState<Audience | null>(null);
  const toggle = (a: Audience) => setSelected((prev) => (prev === a ? null : a));

  return (
    <div className="w-full">
      {/* ── Permanent peer teasers ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {TEASERS.map((t, idx) => {
          const active = selected === t.id;
          return (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => toggle(t.id)}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-3xl border text-left cursor-pointer select-none min-h-[320px] md:min-h-[380px] flex flex-col justify-end"
              style={{
                borderColor: `rgba(${t.rgb}, ${active ? 0.6 : 0.25})`,
                boxShadow: `0 20px 56px rgba(${t.rgb}, ${active ? 0.42 : 0.22})`,
              }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                style={{ backgroundImage: `url('${t.img}')`, opacity: active ? 0.72 : 0.5, filter: 'brightness(0.85)' }}
              />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(${t.rgb},0.78), rgba(${t.rgb},0.22) 55%, rgba(0,0,0,0.1) 100%)` }} />
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, ${t.from}, ${t.to})` }} />
              <div className="relative z-10 p-7 md:p-8">
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-none drop-shadow-md mb-2">{t.title}</h3>
                <p className="text-white/90 font-light text-sm drop-shadow-sm">{t.short}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest">
                  {active ? 'Close' : 'Explore'}
                  <svg className={`w-4 h-4 transition-transform duration-300 ${active ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── Inline expanding panel (full-bleed, same page) ── */}
      <AnimatePresence initial={false}>
        {selected && (
          <motion.div
            key={selected}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
            style={{ width: '100vw', position: 'relative', left: '50%', marginLeft: '-50vw', marginTop: 28 }}
          >
            {selected === 'kids' && (
              <KidsSection onBookTrial={() => onBookTrial('Kids BJJ')} />
            )}
            {selected === 'adults' && (
              <LightPanel
                accentFrom="#eab308" accentTo="#06b6d4"
                eyebrow="Adults · Self-Improvement"
                title="Technique over brute force."
                body="A real, demanding challenge in a safe, ego-free space. The curriculum is built on progression: every belt is a new level of physical mastery and mental growth. This is where intelligence defeats size."
                points={['A real challenge, in a safe environment', 'Technique and problem-solving over strength', 'Small groups, direct coaching', 'Beginner-friendly, never beginner-easy']}
                primaryLabel="Book a free trial" onPrimary={() => onBookTrial('Adult BJJ')}
                secondaryLabel="Explore the method" onSecondary={onSpiralOpen}
              />
            )}
            {selected === 'women' && (
              <WomensPanel onBookTrial={() => onBookTrial("Women's Training")} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LightPanel({ accentFrom, accentTo, eyebrow, title, body, points, primaryLabel, onPrimary, secondaryLabel, onSecondary }: {
  accentFrom: string; accentTo: string; eyebrow: string; title: string; body: string;
  points: string[]; primaryLabel: string; onPrimary: () => void; secondaryLabel: string; onSecondary: () => void;
}) {
  return (
    <div className="bg-gray-900 text-white px-6 md:px-12 lg:px-20 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">
        <div className="h-[3px] w-16 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${accentFrom}, ${accentTo})` }} />
        <div className="text-[11px] font-bold tracking-[0.28em] uppercase mb-3" style={{ color: accentFrom }}>{eyebrow}</div>
        <h3 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tighter">{title}</h3>
        <p className="mt-5 max-w-2xl text-gray-300 font-light leading-relaxed">{body}</p>
        <ul className="mt-7 grid sm:grid-cols-2 gap-3 max-w-2xl">
          {points.map((p) => (
            <li key={p} className="flex gap-3 text-gray-200">
              <span className="mt-2 w-2 h-2 rounded-full shrink-0" style={{ background: accentFrom }} />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <div className="mt-9 flex flex-col sm:flex-row gap-4">
          <button onClick={onPrimary} className="px-8 py-4 text-gray-900 text-sm font-black uppercase tracking-widest rounded-full transition-transform hover:scale-[1.03]" style={{ background: accentFrom }}>
            {primaryLabel}
          </button>
          <button onClick={onSecondary} className="px-8 py-4 bg-white/10 text-white text-sm font-bold uppercase tracking-widest rounded-full border border-white/20 hover:bg-white/20 transition-colors">
            {secondaryLabel}
          </button>
        </div>
        <p className="mt-6 text-xs text-gray-500 italic">More for this program is coming in the next phase.</p>
      </div>
    </div>
  );
}
