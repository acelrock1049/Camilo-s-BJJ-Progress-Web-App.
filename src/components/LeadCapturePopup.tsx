import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const SCROLL_POPUP_KEY    = 'cbjj_scroll_popup_seen';
const EXIT_POPUP_KEY      = 'cbjj_exit_popup_seen';
const LEAD_CAPTURED_KEY   = 'cbjj_lead_captured';
const COOLDOWN_DAYS       = 7;

function isRecentlySeen(key: string): boolean {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    const diffMs = Date.now() - ts;
    return diffMs < COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
}

// ─────────────────────────────────────────────
// SCROLL POPUP — email + instagram capture
// ─────────────────────────────────────────────
interface ScrollPopupProps {
    onSurveyOpen: () => void;
}

export function ScrollPopup({ onSurveyOpen }: ScrollPopupProps) {
    const [visible, setVisible] = useState(false);
    const [email, setEmail]     = useState('');
    const [instagram, setInstagram] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError]     = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Don't show if already captured or recently dismissed
        if (isRecentlySeen(SCROLL_POPUP_KEY)) return;
        if (localStorage.getItem(LEAD_CAPTURED_KEY)) return;

        const handleScroll = () => {
            const scrollPct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            if (scrollPct >= 50) {
                setVisible(true);
                window.removeEventListener('scroll', handleScroll);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const dismiss = () => {
        setVisible(false);
        localStorage.setItem(SCROLL_POPUP_KEY, Date.now().toString());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) { setError('Please enter your email.'); return; }

        setIsSubmitting(true);
        try {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const res = await fetch(`${supabaseUrl}/functions/v1/ingest-popup-lead`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.toLowerCase().trim(),
                    instagram_handle: instagram.trim() || null,
                }),
            });
            if (!res.ok) console.error('Popup lead error:', await res.json().catch(() => ({})));
        } catch (err) {
            console.error('Popup lead network error:', err);
            // Graceful degradation — always show success to the user
        } finally {
            setIsSubmitting(false);
        }

        localStorage.setItem(LEAD_CAPTURED_KEY, '1');
        localStorage.setItem(SCROLL_POPUP_KEY, Date.now().toString());
        setSubmitted(true);
    };

    return (
        <AnimatePresence>
            {visible && (
                <>
                    {/* Desktop: slide-in bottom-right */}
                    <motion.div
                        key="scroll-popup-desktop"
                        initial={{ opacity: 0, y: 40, x: 20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: 40, x: 20 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                        className="hidden md:flex fixed bottom-8 right-8 z-[200] flex-col"
                        style={{ width: 360 }}
                    >
                        <div className="rounded-2xl bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">
                            {/* Accent bar */}
                            <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" />

                            <div className="p-6">
                                {/* Close */}
                                <button
                                    onClick={dismiss}
                                    className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                    aria-label="Close"
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {!submitted ? (
                                    <>
                                        {/* Header */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <img src="/sticker.png" alt="" className="h-10 w-auto object-contain" />
                                            <div>
                                                <p className="text-[10px] font-bold tracking-[0.2em] text-orange-500 uppercase">
                                                    Docklands · Free Trial
                                                </p>
                                                <h3 className="text-gray-900 font-black text-base leading-tight uppercase tracking-tight">
                                                    Still on the fence?
                                                </h3>
                                            </div>
                                        </div>

                                        <p className="text-gray-500 text-sm font-light leading-relaxed mb-5">
                                            Your first class is <span className="text-gray-900 font-semibold">completely free</span>. Drop your email and we'll send you the details.
                                        </p>

                                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={e => { setEmail(e.target.value); setError(''); }}
                                                placeholder="your@email.com"
                                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                                            />
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                                                <input
                                                    type="text"
                                                    value={instagram}
                                                    onChange={e => setInstagram(e.target.value)}
                                                    placeholder="instagram handle (optional)"
                                                    className="w-full pl-8 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
                                                />
                                            </div>
                                            {error && <p className="text-red-500 text-xs">{error}</p>}
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full py-3.5 bg-gray-900 text-white font-bold tracking-widest text-xs uppercase rounded-lg hover:bg-black hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? 'Sending...' : 'Claim my free trial →'}
                                            </button>
                                        </form>

                                        <button
                                            onClick={dismiss}
                                            className="w-full mt-3 text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            No thanks, I'm not interested
                                        </button>
                                    </>
                                ) : (
                                    <SuccessState onClose={() => setVisible(false)} onSurvey={onSurveyOpen} />
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Mobile: bottom sheet */}
                    <motion.div
                        key="scroll-popup-mobile"
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="md:hidden fixed inset-x-0 bottom-0 z-[200]"
                    >
                        <div className="rounded-t-3xl bg-white/95 backdrop-blur-xl border-t border-white/50 shadow-[0_-20px_60px_rgba(0,0,0,0.15)]">
                            {/* Drag handle */}
                            <div className="flex justify-center pt-3 pb-1">
                                <div className="w-10 h-1 rounded-full bg-gray-300" />
                            </div>
                            <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" />

                            <div className="p-5 pb-8">
                                <button
                                    onClick={dismiss}
                                    className="absolute top-5 right-5 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                    aria-label="Close"
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {!submitted ? (
                                    <>
                                        <div className="flex items-center gap-3 mb-3">
                                            <img src="/sticker.png" alt="" className="h-9 w-auto object-contain" />
                                            <h3 className="text-gray-900 font-black text-base uppercase tracking-tight">
                                                Your first class is free.
                                            </h3>
                                        </div>
                                        <p className="text-gray-500 text-sm mb-4">Drop your email and we'll send you the details.</p>

                                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={e => { setEmail(e.target.value); setError(''); }}
                                                placeholder="your@email.com"
                                                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all"
                                            />
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                                                <input
                                                    type="text"
                                                    value={instagram}
                                                    onChange={e => setInstagram(e.target.value)}
                                                    placeholder="instagram (optional)"
                                                    className="w-full pl-9 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-pink-400 transition-all"
                                                />
                                            </div>
                                            {error && <p className="text-red-500 text-xs">{error}</p>}
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full py-4 bg-gray-900 text-white font-bold tracking-widest text-xs uppercase rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? 'Sending...' : 'Claim my free trial →'}
                                            </button>
                                        </form>

                                        <button onClick={dismiss} className="w-full mt-3 text-center text-xs text-gray-400">
                                            No thanks
                                        </button>
                                    </>
                                ) : (
                                    <SuccessState onClose={() => setVisible(false)} onSurvey={onSurveyOpen} />
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ─────────────────────────────────────────────
// SUCCESS STATE
// ─────────────────────────────────────────────
function SuccessState({ onClose, onSurvey }: { onClose: () => void; onSurvey: () => void }) {
    return (
        <div className="text-center py-2">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h3 className="font-black text-gray-900 uppercase tracking-tight text-lg mb-1">You're in! 🥋</h3>
            <p className="text-gray-500 text-sm font-light mb-5">
                We'll be in touch shortly. While you wait — find out what your BJJ personality says about you.
            </p>
            <button
                onClick={() => { onClose(); onSurvey(); }}
                className="w-full py-3 bg-gray-900 text-white font-bold tracking-widest text-xs uppercase rounded-lg hover:bg-black transition-all"
            >
                Take the Belt Journey Test
            </button>
            <button onClick={onClose} className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Maybe later
            </button>
        </div>
    );
}

// ─────────────────────────────────────────────
// EXIT INTENT POPUP — desktop only, opens survey
// ─────────────────────────────────────────────
interface ExitPopupProps {
    onSurveyOpen: () => void;
}

export function ExitIntentPopup({ onSurveyOpen }: ExitPopupProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Desktop only
        if (window.innerWidth < 768) return;
        if (isRecentlySeen(EXIT_POPUP_KEY)) return;
        if (localStorage.getItem(LEAD_CAPTURED_KEY)) return;
        if (isRecentlySeen(SCROLL_POPUP_KEY)) return;

        let triggered = false;

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 10 && !triggered) {
                triggered = true;
                setVisible(true);
            }
        };

        // Delay attaching so it doesn't fire right on load
        const timeout = setTimeout(() => {
            document.addEventListener('mouseleave', handleMouseLeave);
        }, 5000);

        return () => {
            clearTimeout(timeout);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const dismiss = () => {
        setVisible(false);
        localStorage.setItem(EXIT_POPUP_KEY, Date.now().toString());
    };

    const handleSurvey = () => {
        dismiss();
        onSurveyOpen();
    };

    return (
        <AnimatePresence>
            {visible && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
                        onClick={dismiss}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.2)] border border-white/60 overflow-hidden"
                        style={{ maxWidth: 460, width: '100%' }}
                    >
                        {/* Top accent */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" />

                        {/* Close */}
                        <button
                            onClick={dismiss}
                            className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
                            aria-label="Close"
                        >
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="p-8 text-center">
                            {/* Eyebrow */}
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                Before you go
                            </span>

                            {/* Logo */}
                            <div className="flex justify-center mb-5">
                                <img src="/sticker.png" alt="Camilo's BJJ" className="h-16 w-auto object-contain drop-shadow" />
                            </div>

                            <h2
                                className="font-serif italic text-3xl text-gray-900 font-normal mb-1"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                What's your BJJ
                            </h2>
                            <h2 className="font-sans font-black text-4xl uppercase tracking-tighter text-gray-900 mb-4">
                                personality?
                            </h2>

                            <p className="text-gray-500 text-sm font-light leading-relaxed mb-7 max-w-sm mx-auto">
                                3 questions. 60 seconds. Find out which Psychological Belt matches your mindset — and what it means for your journey on the mat.
                            </p>

                            <button
                                onClick={handleSurvey}
                                className="w-full py-4 bg-gray-900 text-white font-black tracking-widest text-sm uppercase rounded-xl hover:bg-black hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] hover:scale-[1.02] transition-all mb-3"
                            >
                                Find my BJJ Belt →
                            </button>

                            <button
                                onClick={dismiss}
                                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                No thanks, I already know what I want
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
