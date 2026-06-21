/**
 * KidsSection — parent-facing conversion layer for the BJJ Kids campaign.
 *
 * Integrates with what already exists (no duplication):
 *  - "Book their free trial" → onBookTrial() → App opens TrialBookingModal (interest = "Kids BJJ")
 *  - "See how a class works" → onOpenMethod() → App opens the existing KidsModal (deep pedagogy)
 *
 * Copy anchored in product-marketing-context + MOC Pedagogía BJJ Kids.
 * AU English, no em dashes, no clichés, no fake urgency.
 * Proof = real Google reviews (unnamed, framed as reviews, NOT as parent testimonials).
 * Parent testimonials slot is an honest placeholder until real ones are collected.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KidsMethod from './KidsMethod';
import imgKidsPost from '../assets/kids-post.jpg';
import imgKidsGames from '../assets/kids-games.jpg';
import imgKidsGames2 from '../assets/kids-games-2.jpg';
import imgKidsGames3 from '../assets/kids-games-3.jpg';
import imgKidsGrading from '../assets/kids-grading.jpg';

interface KidsSectionProps {
  onBookTrial: () => void;
}

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

// Real Google reviews, unnamed, used as genuine reviews (not as parent testimonials).
const REVIEWS = [
  "As a beginner I highly recommend joining. Camilo breaks the techniques down to their fundamentals, and the atmosphere is encouraging and supportive regardless of your skill level.",
  "A kind, inclusive and diverse community. The coach is patient yet passionate. Highly recommend, especially if you are a beginner.",
  "Great coach and great team. A fantastic environment to learn and develop.",
];

export default function KidsSection({ onBookTrial }: KidsSectionProps) {
  const [showMethod, setShowMethod] = useState(false);
  return (
    <section
      id="kids"
      className="relative z-30 w-full bg-gradient-to-b from-white via-green-50/40 to-white px-6 md:px-12 lg:px-20 py-20 md:py-28 text-gray-900"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── HERO ── */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div {...reveal}>
            <div className="text-[11px] font-bold tracking-[0.28em] uppercase text-green-600 mb-4">
              Kids BJJ · Ages 5 to 10 · Docklands
            </div>
            <h2 className="leading-[1.05]">
              <span className="block font-sans font-black text-4xl md:text-5xl tracking-tighter uppercase text-gray-900">
                Confidence, focus and real skills,
              </span>
              <span className="block font-serif italic text-3xl md:text-4xl text-green-700 mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                on a mat where your child feels safe.
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-lg font-light text-gray-600 leading-relaxed">
              Brazilian Jiu-Jitsu for ages 5 to 10 in Docklands, built on Conscious Discipline and learning through play. Small groups, structured progress, and safety built into how we teach: control before anything else.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={onBookTrial}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-sm font-bold uppercase tracking-widest rounded-full transition-all hover:scale-[1.03] shadow-[0_10px_30px_-8px_rgba(22,163,74,0.5)]"
              >
                Book their free trial
              </button>
              <button
                onClick={() => setShowMethod((v) => !v)}
                className="px-8 py-4 bg-white text-gray-800 text-sm font-bold uppercase tracking-widest rounded-full border border-gray-200 hover:border-green-500 hover:text-green-700 transition-all"
              >
                {showMethod ? 'Hide the method' : 'See how a class works'}
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
              <img src={imgKidsPost} alt="Camilo's BJJ kids class in Docklands" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-5 py-3 border border-green-100">
              <div className="text-2xl font-black text-green-600 leading-none">5.0★</div>
              <div className="text-[11px] text-gray-500 mt-1">on Google reviews</div>
            </div>
          </motion.div>
        </div>

        {/* ── METHOD (second collapsible: the deep pedagogy, reused from the old modal) ── */}
        <AnimatePresence initial={false}>
          {showMethod && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden mt-10"
            >
              <KidsMethod onBookTrial={onBookTrial} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── REASSURANCE BAR ── */}
        <motion.div {...reveal} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['Ages 5 to 10', 'Age-appropriate classes'],
            ['Small groups', 'Every child is seen'],
            ['Safe by design', 'Control before submission'],
            ['Docklands', 'Inside Empower Tactical'],
          ].map(([title, sub]) => (
            <div key={title} className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
              <div className="font-black uppercase tracking-tight text-gray-900">{title}</div>
              <div className="text-sm text-gray-500 mt-1">{sub}</div>
            </div>
          ))}
        </motion.div>

        {/* ── SAFE BY DESIGN (the differentiator) ── */}
        <div className="mt-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div {...reveal} className="order-2 lg:order-1 grid grid-cols-2 gap-3">
            <div className="col-span-2 aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-white/60 bg-gray-100">
              <img src={imgKidsGames} alt="Kids learning Brazilian Jiu-Jitsu through games" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border border-white/60 bg-gray-100">
              <img src={imgKidsGames2} alt="Kids BJJ class games" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border border-white/60 bg-gray-100">
              <img src={imgKidsGames3} alt="Kids BJJ class games" className="w-full h-full object-cover" />
            </div>
          </motion.div>
          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} className="order-1 lg:order-2">
            <div className="text-[11px] font-bold tracking-[0.28em] uppercase text-green-600 mb-3">How we teach</div>
            <h3 className="font-serif italic text-3xl md:text-4xl text-gray-900 mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
              Safe is not a promise here. It is how we teach.
            </h3>
            <p className="text-gray-600 font-light leading-relaxed mb-6">
              Kids learn differently from adults, so we teach BJJ through play and guided games, not long lectures. Before a child learns a technique, we help them feel safe, calm and connected. From there, real skill follows.
            </p>
            <ul className="space-y-3">
              {[
                'Control before submission, always. Nothing is attacked without control first.',
                'No free sparring on day one. Skills are built under safe, guided pressure.',
                'Small groups, so every child is supervised closely.',
                'Coaches trained in BJJ and child psychology.',
              ].map((t) => (
                <li key={t} className="flex gap-3 text-gray-700">
                  <span className="mt-2 w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ── WHAT YOUR CHILD BUILDS ── */}
        <motion.div {...reveal} className="mt-20">
          <h3 className="text-center font-sans font-black text-3xl md:text-4xl uppercase tracking-tighter text-gray-900">
            What your child builds
          </h3>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              ['Confidence', 'That shows up at school and at home.'],
              ['Focus', 'Self-regulation and emotional control.'],
              ['Self-defence', 'Practical skills and body awareness.'],
              ['Resilience', 'Losing is learning. Effort over outcome.'],
            ].map(([title, sub]) => (
              <div key={title} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-green-200 transition-all">
                <div className="text-lg font-black uppercase tracking-tight text-green-700">{title}</div>
                <div className="text-sm text-gray-500 mt-2 leading-relaxed">{sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── PROOF: real Google reviews (unnamed) + honest parent slot ── */}
        <motion.div {...reveal} className="mt-20">
          <div className="text-center">
            <div className="text-[11px] font-bold tracking-[0.28em] uppercase text-green-600 mb-2">What our community says</div>
            <h3 className="font-serif italic text-3xl text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Loved by our Docklands community
            </h3>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {REVIEWS.map((q, i) => (
              <div key={i} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex flex-col">
                <div className="text-green-500 mb-3">★★★★★</div>
                <p className="text-gray-700 font-light leading-relaxed text-[15px] flex-1">"{q}"</p>
                <div className="text-[11px] text-gray-400 mt-4 uppercase tracking-widest">Google review</div>
              </div>
            ))}
          </div>
          {/* Honest placeholder — parent testimonials to be collected, never fabricated */}
          <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4 rounded-2xl bg-green-50 border border-green-100 p-5 text-center md:text-left">
            <img src={imgKidsGrading} alt="Coach and student" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow" />
            <p className="text-sm text-green-800">
              <strong>Parent voices:</strong> we are collecting these from our current families right now. Want to share yours after the trial?
            </p>
          </div>
        </motion.div>

        {/* ── FREE TRIAL ── */}
        <motion.div {...reveal} className="mt-20 rounded-3xl bg-gray-900 text-white p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-green-500/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tighter">Start with a free trial class.</h3>
              <p className="mt-4 text-gray-300 font-light leading-relaxed max-w-md">
                The first class is a relaxed diagnostic, no experience needed. We welcome you both, talk about your child and your goals, run an age-appropriate intro class, and show you the next step. No pressure, no lock-in.
              </p>
              <p className="mt-4 text-sm text-green-300">
                Bring a friend or sibling and one of you gets 80% off your first month.
              </p>
            </div>
            <div>
              <ol className="space-y-4 mb-8">
                {['Book a time.', 'Come in for the free class.', 'We talk through the next step together.'].map((s, i) => (
                  <li key={s} className="flex gap-4 items-start">
                    <span className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-sm font-black shrink-0">{i + 1}</span>
                    <span className="text-gray-200 pt-1">{s}</span>
                  </li>
                ))}
              </ol>
              <button
                onClick={onBookTrial}
                className="w-full sm:w-auto px-10 py-4 bg-green-500 hover:bg-green-400 text-gray-900 text-sm font-black uppercase tracking-widest rounded-full transition-all hover:scale-[1.02]"
              >
                Book their free trial
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
