import { useState } from 'react';
import { motion } from 'framer-motion';

// ─── SVG icons ────────────────────────────────────────────────

const InstagramIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
);

const WhatsAppIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);

const YouTubeIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
);

const MapPinIcon = () => (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
);

// ─── Data ─────────────────────────────────────────────────────

const PROGRAMS = [
    { label: 'Foundation — $49/week', href: 'https://link.bizly.pro/payment-link/697ad46b77ba091443ce0cce' },
    { label: 'Warrior Unlimited — $69/week', href: 'https://link.bizly.pro/payment-link/697ad4c06503ca2033772f26' },
    { label: 'Elite Coaching — $89/week', href: 'https://link.bizly.pro/payment-link/697ad50d6503cac371772f7d' },
    { label: 'BJJ Kids Programme', href: 'https://link.bizly.pro/payment-link/697ad59277ba09f413ce0e89' },
    { label: 'Free Trial Class', href: 'https://link.bizly.pro/payment-link/697ad46b77ba091443ce0cce' },
];

const COMMUNITY = [
    { label: 'Our Method', href: '#method' },
    { label: 'Timetable', href: '#timetable' },
    { label: 'Find your BJJ Belt', href: '#survey' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact & Location', href: '#location' },
];

const SOCIAL = [
    { label: 'Instagram', href: 'https://www.instagram.com/camilosbjj/', icon: <InstagramIcon /> },
    { label: 'WhatsApp', href: 'https://wa.me/61489038711', icon: <WhatsAppIcon /> },
    { label: 'YouTube', href: 'https://www.youtube.com/@camilosbjj', icon: <YouTubeIcon /> },
];

// ─── Newsletter Form ───────────────────────────────────────────

function NewsletterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        // Brief simulated delay — wire to Supabase edge function when ready
        await new Promise(r => setTimeout(r, 800));
        setLoading(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-start gap-3"
            >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    You're in the tribe
                </span>
                <p className="text-neutral-400 text-sm font-light leading-relaxed">
                    Check your inbox — your first resilience strategy is on its way.
                </p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
            <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-sm bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm font-light focus:outline-none focus:border-red-500/60 transition-colors"
            />
            <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-sm bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm font-light focus:outline-none focus:border-red-500/60 transition-colors"
            />
            <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-6 bg-red-600 hover:bg-red-500 text-white font-black tracking-widest text-xs uppercase rounded-sm transition-colors disabled:opacity-60 shadow-[0_4px_20px_rgba(220,38,38,0.3)]"
            >
                {loading ? 'Joining…' : 'Join the Tribe'}
            </motion.button>
            <p className="text-neutral-600 text-[10px] font-light leading-relaxed">
                No spam. No fluff. Resilience tactics every week. Unsubscribe anytime.
            </p>
        </form>
    );
}

// ─── Main Component ────────────────────────────────────────────

export function FooterNew() {
    return (
        <footer
            className="relative overflow-hidden"
            style={{
                backgroundColor: '#0f0f11',
                // Pearl weave texture — subtle dot grid mimicking gi fabric
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '10px 10px',
            }}
        >
            {/* Ambient glow — echoes the mandala palette */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-red-900/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-blue-900/8 rounded-full blur-[80px]" />
            </div>

            {/* Red top accent line — belt stripe */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-600 to-transparent" />

            {/* ── Main Grid ── */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pt-16 pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    {/* ── Col 1: Brand & Trust ── */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        {/* Logo patch */}
                        <div className="inline-block">
                            <img
                                src="/sticker.png"
                                alt="Camilo's BJJ"
                                className="h-20 w-auto object-contain"
                                style={{ filter: 'drop-shadow(0 0 12px rgba(220,38,38,0.25))' }}
                            />
                        </div>

                        <p className="text-neutral-400 text-sm font-light leading-relaxed max-w-[220px]">
                            Your personal engineering lab in Docklands. We translate the complexity of combat into real-life resilience — ego-free, no lock-in.
                        </p>

                        <div className="flex items-start gap-2 text-neutral-500 text-xs font-light">
                            <MapPinIcon />
                            <span className="leading-relaxed">
                                18 Import Ln, Docklands VIC 3008<br />
                                <span className="text-neutral-600 italic">Inside Empower Tactical</span>
                            </span>
                        </div>

                        {/* Social icons */}
                        <div className="flex gap-3 mt-1">
                            {SOCIAL.map(s => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className="p-2.5 rounded-sm bg-white/5 border border-white/8 text-neutral-500 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Col 2: Programs by Intent ── */}
                    <div className="flex flex-col gap-5">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">
                            Start Your Evolution
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {PROGRAMS.map(p => (
                                <li key={p.label}>
                                    <a
                                        href={p.href}
                                        target={p.href.startsWith('http') ? '_blank' : undefined}
                                        rel={p.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="group flex items-center gap-2 text-neutral-400 hover:text-white text-sm font-light transition-colors duration-200"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-red-600 shrink-0 group-hover:scale-150 transition-transform" />
                                        {p.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Col 3: Community ── */}
                    <div className="flex flex-col gap-5">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">
                            Our Tribe
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {COMMUNITY.map(c => (
                                <li key={c.label}>
                                    <a
                                        href={c.href}
                                        className="group flex items-center gap-2 text-neutral-400 hover:text-white text-sm font-light transition-colors duration-200"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-neutral-600 shrink-0 group-hover:bg-red-600 group-hover:scale-150 transition-all" />
                                        {c.label}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Google Maps mini-embed */}
                        <div className="mt-4 rounded-lg overflow-hidden border border-white/8 h-32">
                            <iframe
                                title="Camilo's BJJ — Empower Tactical, Docklands"
                                src="https://www.google.com/maps?q=18+Import+Ln,+Docklands+VIC+3008,+Australia&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'grayscale(60%) contrast(1.1)' }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                        <a
                            href="https://www.google.com/maps/dir/?api=1&destination=18+Import+Ln,+Docklands+VIC+3008"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-red-400 text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                            <MapPinIcon />
                            Get directions →
                        </a>
                    </div>

                    {/* ── Col 4: Newsletter / Lead Capture ── */}
                    <div className="flex flex-col gap-5">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">
                            Strengthen Your Mind
                        </h4>
                        <div>
                            <p
                                className="font-serif italic text-neutral-300 text-lg font-normal leading-snug mb-1"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Weekly resilience.
                            </p>
                            <p className="text-neutral-500 text-xs font-light leading-relaxed">
                                BJJ tactics, mental frameworks and real stories from the mat — straight to your inbox.
                            </p>
                        </div>
                        <NewsletterForm />
                    </div>

                </div>

                {/* ── Bottom Bar ── */}
                <div
                    className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                    {/* Copyright */}
                    <p className="text-neutral-600 text-[11px] tracking-widest uppercase order-2 sm:order-1">
                        © {new Date().getFullYear()} Camilo's BJJ · Docklands, Melbourne
                    </p>

                    {/* Legal links */}
                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 order-1 sm:order-2">
                        {[
                            { label: 'Zero Lock-In Terms', href: '#faq' },
                            { label: 'Liability Waiver', href: '#faq' },
                            { label: 'Privacy Policy', href: '#faq' },
                        ].map(link => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-neutral-600 hover:text-neutral-300 text-[11px] tracking-widest uppercase transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
