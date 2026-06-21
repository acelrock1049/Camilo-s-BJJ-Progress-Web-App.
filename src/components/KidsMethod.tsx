/**
 * KidsMethod — the deep pedagogy content, extracted from the old KidsModal so the
 * work isn't lost. Rendered inline as a second collapsible inside the kids panel
 * (philosophy + brain states + anatomy of a class). Experiment: keep if it reads well.
 */
import imgBjjKids from '../assets/bjj-kids-banner.jpg';

export default function KidsMethod({ onBookTrial }: { onBookTrial: () => void }) {
  return (
    <div className="rounded-3xl overflow-hidden border border-green-100 shadow-lg bg-white">
      {/* Header */}
      <div className="relative w-full h-40 md:h-48 bg-green-900">
        <img src={imgBjjKids} alt="BJJ Kids training" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-900/40 to-transparent" />
        <div className="absolute bottom-5 left-6 md:left-8 text-white">
          <span className="inline-block px-3 py-1 bg-green-500/75 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-widest uppercase mb-2">BJJ Development Programme</span>
          <h3 className="font-black text-2xl md:text-3xl uppercase tracking-tighter leading-none drop-shadow-lg">How a class actually works</h3>
        </div>
      </div>

      <div className="p-5 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-800">
        {/* Left: philosophy + brain states */}
        <div className="flex flex-col gap-5">
          <div className="border-l-4 border-green-500 pl-5 py-1">
            <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Our philosophy — the why</h4>
            <p className="text-sm font-light text-gray-700 leading-relaxed">
              <strong className="text-gray-900">Play is the vehicle.</strong> We translate Jiu-Jitsu into the language of children through stories and challenges: navigating <strong className="text-green-600">The Floor is Lava</strong>, protecting <strong className="text-green-600">The Guard Rock</strong>, or escaping <strong className="text-green-600">The Mount Island</strong>.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-4">Emotional development</h4>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gray-900 rounded-full px-2 py-1.5 flex gap-2 shadow-lg border-2 border-gray-800 shrink-0">
                <div className="w-6 h-6 rounded-full bg-red-500" />
                <div className="w-6 h-6 rounded-full bg-yellow-400" />
                <div className="w-6 h-6 rounded-full bg-green-500" />
              </div>
              <p className="text-xs text-gray-500 italic leading-snug">"Losing is learning: from survival to a focused, secure state of mind."</p>
            </div>
            <div className="space-y-2.5">
              {[
                { color: 'bg-red-500',    label: 'Survival (Red)',   desc: 'Fight, flight or freeze under stress.' },
                { color: 'bg-yellow-400', label: 'Emotion (Yellow)', desc: 'Frustration or excitement, a need for connection.' },
                { color: 'bg-green-500',  label: 'Learning (Green)', desc: 'Focused, secure, ready to solve problems.' },
              ].map(({ color, label, desc }) => (
                <div key={label} className="flex gap-3 items-start">
                  <div className={`mt-1 w-2.5 h-2.5 rounded-full ${color} shrink-0`} />
                  <div>
                    <strong className="text-gray-900 text-xs block">{label}</strong>
                    <span className="text-xs text-gray-500">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: anatomy of a class */}
        <div className="bg-gray-900 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative z-10 flex-1">
            <h4 className="text-[10px] font-bold text-green-400 tracking-widest uppercase mb-1">A clear structure for learning</h4>
            <h5 className="text-lg font-black uppercase tracking-tight mb-5">Anatomy of a class</h5>
            <div className="space-y-4">
              {[
                { n: '01', title: 'Connection & animal movements', desc: 'Physical literacy and group cohesion.' },
                { n: '02', title: 'Thematic skill games',          desc: 'Complex techniques as fun, objective-based challenges.' },
                { n: '03', title: 'Exploration — safe starting points', desc: 'Controlled, playful sparring scenarios.' },
                { n: '04', title: 'Reflection & cool down',         desc: 'Breathing and lessons from the mat.' },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex gap-3 items-start border-b border-gray-800/70 pb-3 last:border-0 last:pb-0">
                  <span className="text-green-500/60 font-black text-xs w-5 shrink-0 mt-0.5">{n}</span>
                  <div>
                    <h6 className="font-bold text-green-100 text-sm leading-snug mb-0.5">{title}</h6>
                    <p className="text-gray-400 text-xs font-light">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onBookTrial} className="relative z-10 mt-6 w-full bg-green-600 hover:bg-green-500 py-3 rounded-xl text-white font-bold uppercase tracking-widest text-xs shadow-lg transition-all hover:scale-[1.02]">
            Book a free diagnostic class
          </button>
        </div>
      </div>
      <p className="text-center text-gray-400 text-xs italic pb-6 px-8">We start with a friendly session. No pressure, just connection.</p>
    </div>
  );
}
