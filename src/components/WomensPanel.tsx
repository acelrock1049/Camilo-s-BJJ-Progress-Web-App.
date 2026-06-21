/**
 * WomensPanel — the women's training content, extracted from the old WomensModal so
 * the work isn't lost. Rendered inline in the Women accordion panel.
 */
import imgWomens from '../assets/paula-camilo.jpeg';

export default function WomensPanel({ onBookTrial }: { onBookTrial: () => void }) {
  return (
    <div className="bg-white px-6 md:px-12 lg:px-20 py-16 md:py-20 text-gray-900">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-500/10 text-pink-500 text-xs font-bold tracking-widest uppercase mb-5 border border-pink-500/20">Your safe space</span>
          <h3 className="text-3xl md:text-5xl font-black italic capitalize mb-5 leading-tight">Awaken your strength.<br />Train without fear.</h3>
          <p className="text-gray-600 font-light text-base md:text-lg leading-relaxed max-w-3xl border-l-[3px] border-pink-500/50 pl-5 py-1">
            "We've created an environment where you can lower your emotional guard so you can raise your physical one. Guided by Paula and Camilo, a completely ego-free space."
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Image + testimonial */}
          <div className="lg:col-span-5 relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-pink-900/20 mix-blend-overlay z-10" />
            <img src={imgWomens} alt="Paula and Camilo coaching" className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/85 backdrop-blur-xl border border-gray-200 p-4 rounded-xl z-20 shadow-xl">
              <div className="flex gap-0.5 mb-2 text-yellow-500 text-sm">{'⭐'.repeat(5)}</div>
              <p className="text-gray-900 font-medium italic text-sm leading-snug mb-2">"The environment is safe for women to pick up self defence skills in a supportive and respectful community."</p>
              <p className="text-pink-600 text-[11px] font-bold tracking-widest uppercase">Nat. <span className="text-gray-400 px-1">|</span> Docklands Resident</p>
            </div>
          </div>

          {/* Pillars */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {[
                { d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', title: 'Empathetic leadership', desc: 'Train under Paula and Camilo. A female and male presence guarantees absolute respect and careful technical instruction.' },
                { d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Unshakeable confidence', desc: 'Learn real self-defence and biomechanics. Move through the world knowing exactly how to protect yourself.' },
                { d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', title: 'A supportive community', desc: 'More than a gym. Build genuine friendships with people who actively support each other becoming their best selves.' },
              ].map(({ d, title, desc }) => (
                <div key={title} className="flex gap-4 items-start p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-pink-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={d} /></svg>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900 mb-1">{title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed font-light">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-stretch gap-3">
              <button onClick={onBookTrial} className="flex-1 px-6 py-4 bg-gray-900 text-white font-bold tracking-widest text-xs uppercase hover:bg-black transition-colors rounded-lg shadow-lg">
                Book a free trial
              </button>
              <a href="https://wa.me/61489038711" target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-4 bg-transparent text-gray-900 border border-gray-200 font-bold tracking-widest text-xs uppercase hover:bg-gray-50 hover:border-pink-400/60 hover:text-pink-600 transition-all rounded-lg flex justify-center items-center gap-2">
                Chat with Paula
              </a>
            </div>
            <p className="mt-6 text-xs text-gray-400 italic">More for this program is coming in the next phase.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
