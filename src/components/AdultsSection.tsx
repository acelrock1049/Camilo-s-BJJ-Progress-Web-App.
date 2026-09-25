/**
 * AdultsSection — the Adults · Self-Improvement panel, rendered inline by
 * AudienceAccordion. Built to the same level as KidsSection.
 *
 * Messaging (from product-marketing-context, adults track):
 *  - Who: professionals who want out of the desk-and-screen routine and into a
 *    real challenge, mental and physical. Not casual — they want to be pushed.
 *  - How we teach: the coach's pedagogy, Concept + Movement → constrained game →
 *    emergent technique (an ecological approach). Never teach the move directly.
 *  - Culture with rigour: ego-free, respectful, friendly — and still a sport.
 *
 * Reviews are real Google reviews, quoted verbatim (trimmed with an ellipsis only).
 */
import { motion } from 'framer-motion';
import imgAdultsTeam from '../assets/testimonials/adults-team.jpg';
import imgAdultsMixed from '../assets/testimonials/adults-mixed.jpg';
import imgAdultsSelfie from '../assets/testimonials/adults-selfie.jpg';

interface AdultsSectionProps {
  onBookTrial: () => void;
  onExploreMethod: () => void;
}

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

const SERIF = { fontFamily: "'Playfair Display', serif" };

const REASSURANCE = [
  { title: 'Ego-free mats', desc: 'Nobody here is trying to prove a point.' },
  { title: 'Small groups', desc: 'Close to one-on-one attention.' },
  { title: 'Beginner-friendly', desc: 'Never beginner-easy.' },
  { title: 'Zero lock-in', desc: 'Stay because you want to.' },
];

// The coach's pedagogy, in the order the student lives it.
const METHOD_STEPS = [
  { tag: 'Concept', title: 'The why', desc: 'Leverage, frames, base, connection. The few ideas that explain everything else.' },
  { tag: 'Movement', title: 'The how', desc: 'Hip escapes, bridges, level changes. The body mechanics every technique is built from.' },
  { tag: 'Game', title: 'A goal and a rule', desc: 'A focused game against real resistance. You solve the problem live.' },
  { tag: 'Your technique', title: 'The answer you found', desc: 'It fits your body, not someone else’s. That’s why it sticks.' },
];

const LIGHTER_LOAD = [
  {
    title: 'Principles, not a playlist',
    desc: 'A handful of fundamental concepts explain hundreds of techniques. Learn those, and the rest starts to make sense on its own.',
    d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  },
  {
    title: 'Strategy before strength',
    desc: 'Every position has a plan: where you are, what you want, what comes next. You stop guessing and start deciding.',
    d: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  },
  {
    title: 'Room to get it wrong',
    desc: 'Mistakes are information, not failure. You learn to stay calm when it gets hard, on the mats and off them.',
    d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
];

const CULTURE = [
  'Mutual respect: the ego stays at the door',
  'Partners who look after each other',
  'A friendly, healthy community',
  'People from every background and level',
];

const RIGOUR = [
  'A structured curriculum that builds session by session',
  'Clear belt criteria and honest feedback',
  'Live rounds, with rules that keep them safe',
  'A coach in your corner, and on your case',
];

const REVIEWS = [
  {
    name: 'Raphael Suh',
    text: 'I have trained at all the top schools that Brisbane has to offer… Camilo’s teaching is genuinely unmatched. He teaches with structure and teaches systems which build upon one another.',
  },
  {
    name: 'Matthew Kim',
    text: 'The coach Camilo is very friendly and understands each student’s learning style and needs, allowing you to develop and grow through a system that works best for you.',
  },
  {
    name: 'Joshua Maxfield',
    text: 'Camilo’s BJJ Fight club is a kind, inclusive and diverse community. The coach is patient, yet passionate for the art of Brazilian jiu jitsu.',
  },
];

export default function AdultsSection({ onBookTrial, onExploreMethod }: AdultsSectionProps) {
  return (
    <section
      id="adults"
      className="relative z-30 w-full bg-gradient-to-b from-white via-amber-50/40 to-white px-6 md:px-12 lg:px-20 py-20 md:py-28 text-gray-900 text-left"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── HERO ── */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div {...reveal}>
            <div className="text-[11px] font-bold tracking-[0.28em] uppercase text-amber-600 mb-4">
              Adults · Self-Improvement · Docklands
            </div>
            <h2 className="leading-[1.05]">
              <span className="block font-sans font-black text-4xl md:text-5xl tracking-tighter uppercase text-gray-900">
                Train your body and your head,
              </span>
              <span className="block font-serif italic text-3xl md:text-4xl text-cyan-700 mt-2" style={SERIF}>
                in classes small enough to feel almost private.
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-lg font-light text-gray-600 leading-relaxed">
              Brazilian Jiu-Jitsu for people who want out of the desk-and-screen routine and into a real challenge,
              mental and physical. We teach the principles first, so you think clearly under pressure instead of
              trying to remember a hundred moves.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={onBookTrial}
                className="px-8 py-4 bg-gray-900 hover:bg-black text-white text-sm font-bold uppercase tracking-widest rounded-full transition-all hover:scale-[1.03] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)]"
              >
                Book your free trial
              </button>
              <button
                onClick={onExploreMethod}
                className="px-8 py-4 bg-white text-gray-800 text-sm font-bold uppercase tracking-widest rounded-full border border-gray-200 hover:border-amber-500 hover:text-amber-700 transition-all"
              >
                Explore the method
              </button>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
              <span>Free trial class</span>
              <span className="text-gray-300">·</span>
              <span>No experience needed</span>
              <span className="text-gray-300">·</span>
              <span>Small groups</span>
            </div>
          </motion.div>

          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-gray-100">
              <img src={imgAdultsTeam} alt="Adult Brazilian Jiu-Jitsu class at Camilo's BJJ, Docklands" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-5 py-3 border border-amber-100">
              <div className="text-2xl font-black text-amber-600 leading-none">5.0★</div>
              <div className="text-[11px] text-gray-500 mt-1">on Google reviews</div>
            </div>
          </motion.div>
        </div>

        {/* ── REASSURANCE BAR ── */}
        <motion.div {...reveal} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {REASSURANCE.map(({ title, desc }) => (
            <div key={title} className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
              <div className="h-[3px] w-8 rounded-full mb-3 bg-gradient-to-r from-amber-500 to-cyan-500" />
              <div className="text-sm font-black uppercase tracking-tight text-gray-900">{title}</div>
              <div className="text-sm text-gray-500 font-light mt-1">{desc}</div>
            </div>
          ))}
        </motion.div>

        {/* ── HOW WE TEACH (the differentiator) ── */}
        <motion.div {...reveal} className="mt-20 rounded-3xl bg-gray-900 text-white p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
          <div className="relative z-10">
            <div className="text-[11px] font-bold tracking-[0.28em] uppercase text-amber-400 mb-4">How we teach</div>
            <h3 className="leading-[1.1]">
              <span className="block font-sans font-black text-3xl md:text-4xl uppercase tracking-tighter">
                We don’t hand you techniques.
              </span>
              <span className="block font-serif italic text-2xl md:text-3xl text-cyan-300 mt-2" style={SERIF}>
                We help you discover them.
              </span>
            </h3>
            <p className="mt-6 max-w-3xl text-gray-300 font-light leading-relaxed">
              Most gyms show a move and ask you to copy it. We use an ecological approach, a modern coaching method
              from sports science: you get the concept and the movement, then we shape the game around them. The
              technique emerges from solving real problems, and it fits your body instead of someone else’s.
            </p>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {METHOD_STEPS.map((s, i) => {
                const last = i === METHOD_STEPS.length - 1;
                return (
                  <div key={s.tag} className="relative">
                    <div
                      className={`h-full rounded-2xl p-5 border ${last ? 'bg-amber-500 border-amber-400 text-gray-900' : 'bg-white/5 border-white/10'}`}
                    >
                      <div className={`text-[10px] font-black uppercase tracking-[0.22em] ${last ? 'text-gray-900/70' : 'text-cyan-300'}`}>
                        {String(i + 1).padStart(2, '0')} · {s.tag}
                      </div>
                      <div className="mt-3 text-lg font-black tracking-tight">{s.title}</div>
                      <p className={`mt-2 text-sm font-light leading-relaxed ${last ? 'text-gray-900/80' : 'text-gray-400'}`}>{s.desc}</p>
                    </div>
                    {/* Connector between steps: → on wide screens, ↓ when stacked */}
                    {!last && (
                      <div className="hidden lg:flex absolute top-1/2 -right-3 z-10 w-6 h-6 -translate-y-1/2 items-center justify-center rounded-full bg-gray-900 border border-white/15 text-amber-400 text-xs">
                        →
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="mt-8 text-sm text-gray-400 font-light">
              The rigour doesn’t go anywhere: every game has a goal, a rule and a way to measure whether it worked.
            </p>
          </div>
        </motion.div>

        {/* ── A LIGHTER MENTAL LOAD ── */}
        <motion.div {...reveal} className="mt-20">
          <div className="text-center">
            <div className="text-[11px] font-bold tracking-[0.28em] uppercase text-amber-600 mb-3">A lighter mental load</div>
            <h3 className="leading-[1.1]">
              <span className="block font-sans font-black text-3xl md:text-4xl uppercase tracking-tighter text-gray-900">
                Less to memorise.
              </span>
              <span className="block font-serif italic text-2xl md:text-3xl text-cyan-700 mt-1" style={SERIF}>
                More to understand.
              </span>
            </h3>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {LIGHTER_LOAD.map(({ title, desc, d }) => (
              <div key={title} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all">
                <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d={d} />
                  </svg>
                </div>
                <h4 className="text-base font-black text-gray-900 mb-2">{title}</h4>
                <p className="text-sm text-gray-600 font-light leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CULTURE + RIGOUR ── */}
        <div className="mt-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div {...reveal} className="grid grid-cols-2 gap-3">
            <div className="col-span-2 aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-white/60 bg-gray-100">
              <img src={imgAdultsMixed} alt="Students training together at Camilo's BJJ" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border border-white/60 bg-gray-100">
              <img src={imgAdultsSelfie} alt="The Camilo's BJJ community after class" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="aspect-square rounded-2xl bg-gray-900 text-white p-5 flex flex-col justify-end">
              <div className="text-3xl font-black leading-none text-amber-400">0</div>
              <div className="text-sm font-light text-gray-300 mt-2 leading-snug">egos needed. Everyone trains to make the person in front of them better.</div>
            </div>
          </motion.div>

          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }}>
            <div className="text-[11px] font-bold tracking-[0.28em] uppercase text-amber-600 mb-3">The room matters</div>
            <h3 className="font-serif italic text-3xl md:text-4xl text-gray-900 mb-6" style={SERIF}>
              Friendly doesn’t mean soft.
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">The culture</div>
                <ul className="space-y-3">
                  {CULTURE.map((c) => (
                    <li key={c} className="flex gap-3 text-sm text-gray-700 leading-snug">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-gray-900 mb-3">The standard</div>
                <ul className="space-y-3">
                  {RIGOUR.map((r) => (
                    <li key={r} className="flex gap-3 text-sm text-gray-700 leading-snug">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── PROOF: real Google reviews, verbatim ── */}
        <motion.div {...reveal} className="mt-20">
          <div className="text-center">
            <div className="text-[11px] font-bold tracking-[0.28em] uppercase text-amber-600 mb-3">From the mats</div>
            <h3 className="font-serif italic text-3xl text-gray-900" style={SERIF}>What adult students say</h3>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex flex-col">
                <div className="flex gap-0.5 mb-3 text-amber-500 text-sm" aria-label="5 out of 5 stars">{'★'.repeat(5)}</div>
                <blockquote className="text-gray-700 text-sm leading-relaxed font-light italic flex-1">“{r.text}”</blockquote>
                <figcaption className="mt-4 text-[11px] font-bold tracking-widest uppercase text-gray-900">
                  {r.name} <span className="text-gray-400 font-medium normal-case tracking-normal">· Google review</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </motion.div>

        {/* ── FREE TRIAL ── */}
        <motion.div {...reveal} className="mt-20 rounded-3xl bg-gray-900 text-white p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tighter">Start with a free trial class.</h3>
              <p className="mt-4 text-gray-300 font-light leading-relaxed max-w-md">
                No experience and no fitness level required. Just comfortable clothes and some curiosity.
              </p>
            </div>
            <div>
              <ol className="space-y-4">
                {[
                  'Book in 20 seconds. Camilo confirms your time on WhatsApp.',
                  'A 45-minute first visit: 15 minutes of goal-setting, 30 minutes of technical intro. Sweating is optional.',
                  'Walk out with your personalised 90-day roadmap.',
                ].map((step, i) => (
                  <li key={step} className="flex gap-4 items-start">
                    <span className="w-8 h-8 rounded-full bg-amber-500 text-gray-900 flex items-center justify-center text-sm font-black shrink-0">{i + 1}</span>
                    <span className="text-gray-200 font-light leading-relaxed pt-1">{step}</span>
                  </li>
                ))}
              </ol>
              <button
                onClick={onBookTrial}
                className="mt-8 w-full sm:w-auto px-10 py-4 bg-amber-500 hover:bg-amber-400 text-gray-900 text-sm font-black uppercase tracking-widest rounded-full transition-all hover:scale-[1.02]"
              >
                Book your free trial
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
