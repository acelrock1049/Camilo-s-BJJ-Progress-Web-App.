import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { TextRotate } from './ui/text-rotate';

// ─────────────────────────────────────────────────────────────
// Instagram SVG (not in lucide-react)
// ─────────────────────────────────────────────────────────────
const InstagramIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const SpiralIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path d="M12 12 C12 12, 14 10, 14 8 C14 6, 12 5, 10 6 C8 7, 7 9, 8 11 C9 13, 11 14, 13 14 C15 14, 17 13, 17 11 C17 8, 15 6, 12 5 C9 4, 6 5, 5 8 C4 11, 5 14, 7 16 C9 18, 12 19, 15 18 C18 17, 20 14, 19 11" />
    </svg>
);

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface AnimatedHeroProps {
    onSurveyOpen: () => void;
    onSpiralOpen: () => void;
}

// ─────────────────────────────────────────────────────────────
// Per-phrase color classes — must be static strings for Tailwind
// ─────────────────────────────────────────────────────────────
const TAGLINE_COLORS = [
    'text-black',       // Empower Your Life
    'text-yellow-500',  // Flow Through The Chaos
    'text-green-600',   // Evolve Together
    'text-orange-500',  // Maximize Your Potential
    'text-blue-600',    // Forge Your Discipline
] as const;

// Tight drop-shadow filters: close sharp depth + contained color bloom
const TAGLINE_GLOWS = [
    'drop-shadow(0 1px 2px rgba(0,0,0,0.45)) drop-shadow(0 4px 10px rgba(0,0,0,0.20))',
    'drop-shadow(0 1px 2px rgba(0,0,0,0.35)) drop-shadow(0 3px 10px rgba(234,179,8,0.55))',
    'drop-shadow(0 1px 2px rgba(0,0,0,0.35)) drop-shadow(0 3px 10px rgba(22,163,74,0.55))',
    'drop-shadow(0 1px 2px rgba(0,0,0,0.35)) drop-shadow(0 3px 10px rgba(249,115,22,0.55))',
    'drop-shadow(0 1px 2px rgba(0,0,0,0.35)) drop-shadow(0 3px 10px rgba(37,99,235,0.55))',
] as const;

// ─────────────────────────────────────────────────────────────
// CTA BUTTON — Foundation card style with glassmorphism hover
// ─────────────────────────────────────────────────────────────
interface CtaButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    accentFrom: string;
    accentTo: string;
    glowColor: string;
    borderActiveClass: string;
    bgActiveClass: string;
}

function CtaButton({
    children,
    onClick,
    href,
    accentFrom,
    accentTo,
    glowColor,
    borderActiveClass,
    bgActiveClass,
}: CtaButtonProps) {
    const [isActive, setIsActive] = useState(false);
    const handleEnter = useCallback(() => setIsActive(true), []);
    const handleLeave = useCallback(() => setIsActive(false), []);
    const handleTap   = useCallback(() => setIsActive(prev => !prev), []);

    const inner = (
        <motion.div
            className={`
                relative rounded-2xl border overflow-hidden cursor-pointer select-none
                bg-white/50 backdrop-blur-md w-full min-w-max
                transition-[border-color,box-shadow] duration-300 ease-in-out
                ${isActive ? borderActiveClass : 'border-gray-200/60'}
            `}
            style={{
                boxShadow: isActive
                    ? `0 16px 48px ${glowColor}, 0 0 0 1px ${glowColor}`
                    : '0 4px 20px rgba(0,0,0,0.04)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            onClick={onClick ?? handleTap}
        >
            {/* Background gradient — fades in on hover */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${bgActiveClass} transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Accent top bar */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                style={{
                    background: `linear-gradient(to right, ${accentFrom}, ${accentTo})`,
                    opacity: isActive ? 1 : 0,
                }}
            />

            {/* Content */}
            <div className="relative z-10 px-6 py-4 flex items-center gap-3">
                {children}
            </div>
        </motion.div>
    );

    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full">
                {inner}
            </a>
        );
    }
    return <div className="block w-full">{inner}</div>;
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export function AnimatedHero({ onSurveyOpen, onSpiralOpen }: AnimatedHeroProps) {
    const taglines = useMemo(() => [
        'Empower Your Life',
        'Flow Through The Chaos',
        'Evolve Together',
        'Maximize Your Potential',
        'Forge Your Discipline',
    ], []);

    // Tracks which tagline is active so we can apply the right color
    const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

    // Rotating location words
    const locations = useMemo(() => ['Docklands', 'CBD'], []);
    const [locationIndex, setLocationIndex] = useState(0);

    useEffect(() => {
        const id = setTimeout(() => {
            setLocationIndex(prev => (prev + 1) % locations.length);
        }, 3200);
        return () => clearTimeout(id);
    }, [locationIndex, locations]);

    return (
        <section className="scroll-section min-h-[100vh] flex items-center px-8 md:px-16 pt-40 pb-16 relative z-20">
            <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row md:items-start gap-10 md:gap-16">

                {/* ── LEFT — Heading block ── */}
                <div className="flex-1 min-w-0">

                    {/* Animated HR — left to right */}
                    <motion.div
                        className="mb-6 w-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{ transformOrigin: 'left' }}
                    >
                        <div className="h-px bg-gradient-to-r from-gray-300 via-gray-200 to-transparent" />
                    </motion.div>

                    {/* "Learn Brazilian Jiu Jitsu / [location]" — H1 */}
                    <motion.h1
                        className="flex flex-col gap-0 select-none text-left mb-4"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="text-sm md:text-base font-light text-gray-400 tracking-[0.25em] uppercase font-sans">
                            Learn Brazilian Jiu Jitsu
                        </span>
                        <span className="relative inline-flex overflow-hidden h-[1.8rem] mt-0.5">
                            {locations.map((loc, index) => (
                                <motion.span
                                    key={loc}
                                    className="absolute font-sans font-semibold text-lg md:text-xl tracking-widest text-gray-400 uppercase"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={
                                        locationIndex === index
                                            ? { opacity: 1, y: 0 }
                                            : { opacity: 0, y: locationIndex > index ? -20 : 20 }
                                    }
                                    transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                                >
                                    {loc}
                                </motion.span>
                            ))}
                        </span>
                    </motion.h1>

                    {/* "Master the Mats, / [rotating tagline]" — editorial style */}
                    <motion.div
                        className="w-full"
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2 className="flex flex-col select-none text-left">

                            {/*
                              "Master the Mats," — serif italic with a full-width rule behind it.
                              Mirrors the "Featured / PROFILES" editorial motif:
                              the horizontal line runs behind the text at ~58% height
                              so it appears to cut through the letterforms.
                            */}
                            <span className="relative block">
                                <span
                                    className="absolute left-0 right-0 h-px bg-black/20"
                                    style={{ top: '82%' }}
                                    aria-hidden="true"
                                />
                                <span
                                    className="relative z-10 font-serif italic text-5xl md:text-[5.5rem] text-black font-normal leading-tight"
                                    style={{
                                        fontFamily: "'Playfair Display', serif",
                                        textShadow: '0 2px 6px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
                                    }}
                                >
                                    Master the Mats,
                                </span>
                            </span>

                            {/*
                              Rotating tagline — TextRotate with character-by-character stagger.
                              Wrapped in a span whose filter changes per phrase for the colored glow.
                              splitLevelClassName="overflow-hidden" clips the y:110% entry point.
                            */}
                            <span
                                style={{ filter: TAGLINE_GLOWS[currentTaglineIndex], transition: 'filter 0.6s ease' }}
                            >
                                <TextRotate
                                    texts={taglines}
                                    onNext={setCurrentTaglineIndex}
                                    mainClassName="font-sans font-black text-5xl md:text-[5.5rem] tracking-tighter uppercase leading-tight"
                                    elementLevelClassName={TAGLINE_COLORS[currentTaglineIndex]}
                                    splitLevelClassName="overflow-hidden pb-1"
                                    splitBy="characters"
                                    staggerFrom="first"
                                    staggerDuration={0.018}
                                    initial={{ y: '110%', opacity: 1 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: '-110%', opacity: 0 }}
                                    transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                                    rotationInterval={2600}
                                    loop
                                    auto
                                />
                            </span>
                        </h2>
                    </motion.div>
                </div>

                {/* ── RIGHT — CTA buttons (desktop: right column, mobile: below) ── */}
                <motion.div
                    className="flex flex-col gap-3 w-full md:w-fit md:shrink-0 md:pt-16"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Button 1 — Discover your mindset */}
                    <CtaButton
                        onClick={onSurveyOpen}
                        accentFrom="#eab308"
                        accentTo="#06b6d4"
                        glowColor="rgba(234,179,8,0.2)"
                        borderActiveClass="border-yellow-400/50"
                        bgActiveClass="from-yellow-400/8 to-cyan-400/8"
                    >
                        <Brain className="w-5 h-5 shrink-0 text-yellow-500" />
                        <span className="font-bold tracking-widest text-xs uppercase text-gray-800">
                            Discover your mindset for BJJ
                        </span>
                    </CtaButton>

                    {/* Button 2 — Method (Spiral of Evolution) */}
                    <CtaButton
                        onClick={onSpiralOpen}
                        accentFrom="#a855f7"
                        accentTo="#6366f1"
                        glowColor="rgba(168,85,247,0.2)"
                        borderActiveClass="border-purple-400/50"
                        bgActiveClass="from-purple-500/8 to-indigo-500/8"
                    >
                        <SpiralIcon className="w-5 h-5 shrink-0 text-purple-500" />
                        <span className="font-bold tracking-widest text-xs uppercase text-gray-800">
                            Method
                        </span>
                    </CtaButton>

                    {/* Button 3 — Instagram */}
                    <CtaButton
                        href="https://www.instagram.com/camilosbjj/"
                        accentFrom="#9333ea"
                        accentTo="#ec4899"
                        glowColor="rgba(168,85,247,0.2)"
                        borderActiveClass="border-purple-400/50"
                        bgActiveClass="from-purple-500/8 to-pink-500/8"
                    >
                        <InstagramIcon className="w-5 h-5 shrink-0 text-pink-500" />
                        <span className="font-bold tracking-widest text-xs uppercase text-gray-800">
                            Follow @CamilosBJJ
                        </span>
                    </CtaButton>

                    {/* Button 4 — WhatsApp */}
                    <CtaButton
                        href="https://wa.me/61489038711"
                        accentFrom="#16a34a"
                        accentTo="#22c55e"
                        glowColor="rgba(22,163,74,0.2)"
                        borderActiveClass="border-green-500/50"
                        bgActiveClass="from-green-500/8 to-emerald-400/8"
                    >
                        <WhatsAppIcon className="w-5 h-5 shrink-0 text-green-500" />
                        <span className="font-bold tracking-widest text-xs uppercase text-gray-800">
                            Ask on WhatsApp
                        </span>
                    </CtaButton>
                </motion.div>

            </div>
        </section>
    );
}
