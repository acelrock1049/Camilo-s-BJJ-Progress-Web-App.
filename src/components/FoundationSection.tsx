import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// SVG ICONS — minimal geometric, monochromatic in rest state
// ─────────────────────────────────────────────────────────────

const HolisticIcon = ({ active }: { active: boolean }) => (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16" aria-hidden="true">
        {/* Outer rotating octagon */}
        <polygon
            points="40,4 62,14 76,36 76,44 62,66 40,76 18,66 4,44 4,36 18,14"
            stroke={active ? 'url(#holisticGrad)' : 'currentColor'}
            strokeWidth="1.5"
            fill="none"
            className="transition-all duration-500"
            style={{ filter: active ? 'drop-shadow(0 0 6px #eab308)' : 'none' }}
        />
        {/* Inner diamond */}
        <polygon
            points="40,20 58,40 40,60 22,40"
            stroke={active ? 'url(#holisticGrad)' : 'currentColor'}
            strokeWidth="1.5"
            fill="none"
            className="transition-all duration-500"
        />
        {/* Center cross */}
        <line x1="40" y1="28" x2="40" y2="52" stroke={active ? '#06b6d4' : 'currentColor'} strokeWidth="1.5" className="transition-all duration-500" />
        <line x1="28" y1="40" x2="52" y2="40" stroke={active ? '#eab308' : 'currentColor'} strokeWidth="1.5" className="transition-all duration-500" />
        <circle cx="40" cy="40" r="4" fill={active ? '#eab308' : 'currentColor'} className="transition-all duration-500" />
        {/* Gradient def */}
        <defs>
            <linearGradient id="holisticGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
        </defs>
    </svg>
);

const CommunityIcon = ({ active }: { active: boolean }) => (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16" aria-hidden="true">
        {/* Top node */}
        <circle cx="40" cy="16" r="8"
            stroke={active ? '#16a34a' : 'currentColor'}
            strokeWidth="1.5"
            fill={active ? 'rgba(22,163,74,0.15)' : 'none'}
            className="transition-all duration-500"
            style={{ filter: active ? 'drop-shadow(0 0 6px #16a34a)' : 'none' }}
        />
        {/* Bottom-left node */}
        <circle cx="18" cy="62" r="8"
            stroke={active ? '#16a34a' : 'currentColor'}
            strokeWidth="1.5"
            fill={active ? 'rgba(22,163,74,0.15)' : 'none'}
            className="transition-all duration-500"
        />
        {/* Bottom-right node */}
        <circle cx="62" cy="62" r="8"
            stroke={active ? '#16a34a' : 'currentColor'}
            strokeWidth="1.5"
            fill={active ? 'rgba(22,163,74,0.15)' : 'none'}
            className="transition-all duration-500"
        />
        {/* Connecting lines */}
        <line x1="34" y1="22" x2="23" y2="55"
            stroke={active ? '#16a34a' : 'currentColor'}
            strokeWidth="1.2"
            strokeDasharray={active ? '0' : '3 2'}
            className="transition-all duration-500"
        />
        <line x1="46" y1="22" x2="57" y2="55"
            stroke={active ? '#16a34a' : 'currentColor'}
            strokeWidth="1.2"
            strokeDasharray={active ? '0' : '3 2'}
            className="transition-all duration-500"
        />
        <line x1="26" y1="62" x2="54" y2="62"
            stroke={active ? '#16a34a' : 'currentColor'}
            strokeWidth="1.2"
            strokeDasharray={active ? '0' : '3 2'}
            className="transition-all duration-500"
        />
        {/* Center pulse dot */}
        <circle cx="40" cy="44" r="3"
            fill={active ? '#22c55e' : 'currentColor'}
            className="transition-all duration-500"
        />
    </svg>
);

const ZeroLockIcon = ({ active }: { active: boolean }) => (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16" aria-hidden="true">
        {/* Lock body */}
        <rect x="18" y="42" width="44" height="34" rx="6"
            stroke={active ? '#2563eb' : 'currentColor'}
            strokeWidth="1.5"
            fill={active ? 'rgba(37,99,235,0.1)' : 'none'}
            className="transition-all duration-500"
            style={{ filter: active ? 'drop-shadow(0 0 6px #2563eb)' : 'none' }}
        />
        {/* Shackle — open on right side */}
        <path
            d="M28 42 V28 a12 12 0 0 1 24 0 V36"
            stroke={active ? '#3b82f6' : 'currentColor'}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-500"
            style={{
                transform: active ? 'rotate(12deg)' : 'rotate(0deg)',
                transformOrigin: '52px 36px',
                transition: 'transform 0.4s ease-in-out, stroke 0.4s ease-in-out, filter 0.4s ease-in-out'
            }}
        />
        {/* Keyhole circle */}
        <circle cx="40" cy="57" r="5"
            stroke={active ? '#2563eb' : 'currentColor'}
            strokeWidth="1.5"
            fill="none"
            className="transition-all duration-500"
        />
        {/* Keyhole stem */}
        <line x1="40" y1="62" x2="40" y2="69"
            stroke={active ? '#2563eb' : 'currentColor'}
            strokeWidth="1.5"
            strokeLinecap="round"
            className="transition-all duration-500"
        />
        {/* "Free" indicator — small arrow breaking out */}
        <path
            d="M56 26 L64 18 M60 18 L64 18 L64 22"
            stroke={active ? '#60a5fa' : 'transparent'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500"
        />
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
        description: 'We teach Brazilian Jiu-Jitsu as a complete system — technical precision, strategic thinking, and physical conditioning that compounds over time. Every belt represents a genuine psychological and physical evolution, not just mat hours accumulated.',
        accentFrom: '#eab308',
        accentTo: '#06b6d4',
        borderActive: 'border-yellow-400/50',
        bgActive: 'from-yellow-400/8 to-cyan-400/8',
        glowColor: 'rgba(234,179,8,0.25)',
        tagColor: 'text-yellow-500',
        tagBg: 'bg-yellow-400/10 border-yellow-400/20',
    },
    {
        id: 'community',
        icon: CommunityIcon,
        title: 'Healthy Community',
        subtitle: 'Ego-free mats',
        description: 'Training should elevate everyone in the room. Our culture is built on mutual respect, shared growth, and leaving ego at the door. We\'ve found that the strongest practitioners are always the ones who lift others up first.',
        accentFrom: '#16a34a',
        accentTo: '#22c55e',
        borderActive: 'border-green-500/50',
        bgActive: 'from-green-500/8 to-emerald-400/8',
        glowColor: 'rgba(22,163,74,0.25)',
        tagColor: 'text-green-500',
        tagBg: 'bg-green-400/10 border-green-400/20',
    },
    {
        id: 'zerolocking',
        icon: ZeroLockIcon,
        title: 'Zero Lock-In',
        subtitle: 'Freedom to evolve',
        description: "No long-term contracts. No pressure tactics. We earn your loyalty every single week through the quality of our coaching and the strength of our community. Stay because you want to grow — not because you're contractually obligated to.",
        accentFrom: '#2563eb',
        accentTo: '#3b82f6',
        borderActive: 'border-blue-500/50',
        bgActive: 'from-blue-500/8 to-blue-400/8',
        glowColor: 'rgba(37,99,235,0.25)',
        tagColor: 'text-blue-500',
        tagBg: 'bg-blue-400/10 border-blue-400/20',
    },
] as const;

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

export function FoundationSection() {
    // activeId tracks which card is "hovered" or tapped
    const [activeId, setActiveId] = useState<string | null>(null);

    const handleEnter = useCallback((id: string) => setActiveId(id), []);
    const handleLeave = useCallback(() => setActiveId(null), []);
    const handleTap   = useCallback((id: string) => {
        setActiveId(prev => (prev === id ? null : id));
    }, []);

    return (
        <section className="relative z-20 w-full px-8 md:px-24 pt-16 pb-12 md:pt-20 md:pb-16">

            {/* ── Section header ── */}
            <motion.div
                className="max-w-7xl mx-auto mb-10 md:mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
                <span className="block text-[10px] font-bold tracking-[0.35em] text-gray-400 uppercase mb-4">
                    The Foundation
                </span>
                <div className="flex flex-col">
                    <span
                        className="font-serif italic text-4xl md:text-5xl text-gray-400 font-normal"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Three principles.
                    </span>
                    <span className="font-sans font-black text-4xl md:text-6xl tracking-tighter text-gray-900 uppercase leading-none mt-1">
                        One system.
                    </span>
                </div>
            </motion.div>

            {/* ── Cards grid ── */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {CONCEPTS.map((concept, i) => {
                    const Icon = concept.icon;
                    const isActive = activeId === concept.id;

                    return (
                        <motion.div
                            key={concept.id}
                            className={`
                                group relative rounded-3xl border overflow-hidden cursor-pointer select-none
                                bg-white/50 backdrop-blur-md
                                transition-[border-color,box-shadow] duration-400 ease-in-out
                                ${isActive ? concept.borderActive : 'border-gray-200/60'}
                            `}
                            style={{
                                boxShadow: isActive
                                    ? `0 20px 60px ${concept.glowColor}, 0 0 0 1px ${concept.glowColor}`
                                    : '0 4px 24px rgba(0,0,0,0.04)',
                            }}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            onMouseEnter={() => handleEnter(concept.id)}
                            onMouseLeave={handleLeave}
                            onClick={() => handleTap(concept.id)}
                        >
                            {/* Background gradient — fades in on hover */}
                            <div
                                className={`
                                    absolute inset-0 bg-gradient-to-br ${concept.bgActive}
                                    transition-opacity duration-400
                                    ${isActive ? 'opacity-100' : 'opacity-0'}
                                `}
                            />

                            {/* Accent top bar */}
                            <div
                                className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-400"
                                style={{
                                    background: `linear-gradient(to right, ${concept.accentFrom}, ${concept.accentTo})`,
                                    opacity: isActive ? 1 : 0,
                                }}
                            />

                            {/* Card content */}
                            <div className="relative z-10 p-8 md:p-10 flex flex-col">

                                {/* Icon */}
                                <div className={`
                                    mb-6 transition-colors duration-400
                                    ${isActive ? '' : 'text-gray-300'}
                                `}>
                                    <Icon active={isActive} />
                                </div>

                                {/* Tag pill */}
                                <span className={`
                                    inline-flex items-center self-start gap-1.5 px-3 py-1 rounded-full
                                    text-[10px] font-bold uppercase tracking-widest border mb-3
                                    transition-all duration-400
                                    ${isActive ? `${concept.tagColor} ${concept.tagBg}` : 'text-gray-400 bg-gray-100/60 border-gray-200/60'}
                                `}>
                                    <span
                                        className="w-1.5 h-1.5 rounded-full transition-colors duration-400"
                                        style={{ backgroundColor: isActive ? concept.accentFrom : '#9ca3af' }}
                                    />
                                    {concept.subtitle}
                                </span>

                                {/* Title */}
                                <h3 className={`
                                    font-black text-xl md:text-2xl uppercase tracking-tight leading-none mb-2
                                    transition-colors duration-400
                                    ${isActive ? 'text-gray-900' : 'text-gray-700'}
                                `}>
                                    {concept.title}
                                </h3>

                                {/* Accent divider line — slides in on hover */}
                                <div className="overflow-hidden h-[2px] mb-5 rounded-full">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{
                                            background: `linear-gradient(to right, ${concept.accentFrom}, ${concept.accentTo})`,
                                        }}
                                        initial={{ scaleX: 0, originX: 0 }}
                                        animate={{ scaleX: isActive ? 1 : 0 }}
                                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                </div>

                                {/*
                                  ── Description ────────────────────────────────────────────
                                  Always in the DOM to reserve layout space → zero CLS.
                                  Animated with opacity (0→1) + translateX (-15px→0).
                                  ──────────────────────────────────────────────────────────
                                */}
                                <motion.p
                                    className="text-gray-600 font-light text-sm md:text-base leading-relaxed"
                                    animate={{
                                        opacity: isActive ? 1 : 0,
                                        x: isActive ? 0 : -15,
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: 'easeInOut',
                                        opacity: { duration: 0.35 },
                                        x: { duration: 0.4 },
                                    }}
                                    aria-hidden={!isActive}
                                >
                                    {concept.description}
                                </motion.p>

                                {/* "Tap to explore" hint — only visible on rest state */}
                                <motion.span
                                    className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 flex items-center gap-2"
                                    animate={{ opacity: isActive ? 0 : 1 }}
                                    transition={{ duration: 0.25 }}
                                    aria-hidden
                                >
                                    <span className="w-4 h-px bg-gray-300" />
                                    Hover to explore
                                </motion.span>

                            </div>

                            {/* Mobile "active" indicator */}
                            <motion.div
                                className="absolute top-5 right-5"
                                animate={{ rotate: isActive ? 45 : 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                            >
                                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── Bottom gradient divider — organic transition to next section ── */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white/60 pointer-events-none" />
        </section>
    );
}
