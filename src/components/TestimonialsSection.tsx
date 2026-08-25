/**
 * TestimonialsSection — central social proof, placed between Method and Pricing.
 *
 * Copy anchored in product-marketing-context (25-jun): real Google reviews,
 * verbatim, with real names. AU English, no em dashes, no clichés, no fake urgency.
 * Every review shown here exists publicly on the Google Business Profile.
 *
 * Reviews: auto-advancing carousel (pause on hover, swipe on touch, arrows).
 * Photos: infinite marquee strip, pauses on hover.
 */
import { useEffect, useState } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import adultsTeam from '../assets/testimonials/adults-team.jpg';
import adultsSelfie from '../assets/testimonials/adults-selfie.jpg';
import adultsMixed from '../assets/testimonials/adults-mixed.jpg';
import womenCrew from '../assets/testimonials/women-crew.jpg';
import kidsTeam from '../assets/testimonials/kids-team.jpg';
import kidsSelfie from '../assets/testimonials/kids-selfie.jpg';

const GOOGLE_REVIEWS_URL = 'https://maps.app.goo.gl/3Tm4QD1Evu7jPPWcA';

interface Review {
    name: string;
    text: string;
    accent: string; // card accent colour (belt palette)
}

// Verbatim Google reviews, strongest first (the carousel cycles through all).
const REVIEWS: Review[] = [
    {
        name: 'Stella Tan',
        text: "My first time trying BJJ (and martial arts in general) and I'm so glad I came across Camilo's. The coach is very knowledgeable and strikes a good balance between nudging you outside of your comfort zone and ensuring your safety. Everyone is friendly and encouraging. I highly recommend it!",
        accent: '#ea580c',
    },
    {
        name: 'Raphael Suh',
        text: "I have trained at all the top schools that Brisbane has to offer. However, and I cannot exaggerate this enough, but Camilo's teaching is genuinely unmatched. He has a smaller class, which allows for focused and personalised teaching and he genuinely spends tons of time with everyone. He also teaches with structure and teaches systems which build upon one another.",
        accent: '#2563eb',
    },
    {
        name: 'Dominic Lung',
        text: "If I had to describe Camilo's BJJ in one word, it would be Spectacular. This is my first time doing BJJ and Camilo gives you that one on one attention. His classes are fun, engaging and all while doing that, you're learning so many different skills and techniques. He's built his classes to be ego free.",
        accent: '#9333ea',
    },
    {
        name: 'N C · Local Guide',
        text: "Great BJJ club for locals working in the area to get fit, have fun and socialise! Thanks to the Sensei's clear instructions and beginner friendly approach, I've made a lot of progress starting from no experience in the sport. The environment is safe for women to pick up self defence skills in a supportive and respectful community too.",
        accent: '#db2777',
    },
    {
        name: 'William Suh',
        text: 'The session was absolutely amazing because there was a smaller group of people the coach could focus on and give personalised advice and support for the positions we got into. He taught us very important rules to stick to when we do rolls.',
        accent: '#16a34a',
    },
    {
        name: 'Matthew Kim',
        text: "Excellent gym to learn BJJ. The coach Camilo is very friendly and understands each student's learning style and needs, allowing you to develop and grow through a system that works best for you.",
        accent: '#b45309',
    },
    {
        name: 'Lisa S',
        text: "It was my first time trying BJJ and Camilo did an amazing job explaining the concepts and finding ways and points to improve on. I've learnt so much and left so much at ease. I feel incredibly comfortable even though I was a beginner.",
        accent: '#ea580c',
    },
    {
        name: 'Joshua Maxfield',
        text: "Camilo's BJJ Fight club is a kind, inclusive and diverse community. The coach is patient, yet passionate for the art of Brazilian jiu jitsu. On top of this, you're becoming a part of a very strong community of lovable people from all different backgrounds. Would highly recommend anyone to join up, especially if you are a beginner.",
        accent: '#db2777',
    },
    {
        name: 'William Yang',
        text: "As a beginner to BJJ I highly recommend joining Camilo's academy. Camilo demonstrates great knowledge about BJJ and is able to break the techniques down to its fundamentals. The atmosphere is very encouraging and people are supportive of your learning journey regardless of your skill level.",
        accent: '#b45309',
    },
    {
        name: 'Jonathan Martin',
        text: 'Camilo engages with each participant with unwavering respect, offering tailored guidance and a supportive platform that aligns with their individual growth needs. They also have pretty good protein bars.',
        accent: '#9333ea',
    },
    {
        name: 'Philip Koe-Leong',
        text: 'Great teacher with lots of personalised advice and a warm atmosphere.',
        accent: '#2563eb',
    },
    {
        name: 'Alex King',
        text: 'Great coach and great team. A fantastic environment to learn and develop.',
        accent: '#16a34a',
    },
    {
        name: 'William Sawko',
        text: "Camilo's bjj is one of the most wonderful places to learn. I enjoy going there every time and I have learnt a lot from the coach, and the people there are so welcoming and friendly. Best place to learn bjj.",
        accent: '#ea580c',
    },
];

const PHOTOS = [
    { src: adultsTeam, alt: "Adults class group at Camilo's BJJ Docklands" },
    { src: womenCrew, alt: "Women training BJJ at Camilo's BJJ" },
    { src: kidsTeam, alt: 'Kids BJJ team with their coaches after grading' },
    { src: adultsSelfie, alt: 'Team selfie after an adults BJJ class' },
    { src: kidsSelfie, alt: 'Coach Camilo with kids students' },
    { src: adultsMixed, alt: 'Adults BJJ class, men and women training together' },
];

const FIVE_STARS = [0, 1, 2, 3, 4];
const AUTO_ADVANCE_MS = 5000;

function Stars({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
            {FIVE_STARS.map(i => (
                <svg key={i} className={`${className} text-amber-400`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.363 1.118l1.286 3.958c.3.921-.755 1.688-1.539 1.118l-3.367-2.446a1 1 0 00-1.175 0l-3.367 2.446c-.783.57-1.838-.197-1.538-1.118l1.285-3.958a1 1 0 00-.362-1.118L2.16 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.287-3.958z" />
                </svg>
            ))}
        </div>
    );
}

function GoogleG({ className = 'w-5 h-5' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

// Cards visible per viewport: 1 mobile, 2 tablet, 3 desktop.
function useVisibleCount() {
    const [visible, setVisible] = useState(3);
    useEffect(() => {
        const check = () => setVisible(window.innerWidth < 768 ? 1 : window.innerWidth < 1152 ? 2 : 3);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    return visible;
}

function ArrowButton({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
    return (
        <motion.button
            onClick={onClick}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.08 }}
            className="w-11 h-11 rounded-full flex items-center justify-center border border-gray-200 bg-white/80 backdrop-blur-md text-gray-700 shadow-sm hover:shadow-md hover:text-black transition-colors"
            aria-label={direction === 'prev' ? 'Previous reviews' : 'Next reviews'}
        >
            <svg className={`w-5 h-5 ${direction === 'prev' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
        </motion.button>
    );
}

export function TestimonialsSection({ onBookTrial }: { onBookTrial: () => void }) {
    const visible = useVisibleCount();
    const maxIndex = Math.max(0, REVIEWS.length - visible);
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    // Keep index in range when the viewport (and cards per view) changes
    useEffect(() => {
        setIndex(i => Math.min(i, maxIndex));
    }, [maxIndex]);

    // Auto-advance, wraps around; pauses on hover and while dragging
    useEffect(() => {
        if (paused) return;
        const id = window.setInterval(() => {
            setIndex(i => (i >= maxIndex ? 0 : i + 1));
        }, AUTO_ADVANCE_MS);
        return () => window.clearInterval(id);
    }, [paused, maxIndex]);

    const next = () => setIndex(i => (i >= maxIndex ? 0 : i + 1));
    const prev = () => setIndex(i => (i <= 0 ? maxIndex : i - 1));

    const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setPaused(false);
        if (info.offset.x < -60) next();
        else if (info.offset.x > 60) prev();
    };

    return (
        <section id="reviews" className="px-8 md:px-24 pt-20 pb-16 md:pt-28 md:pb-20 bg-transparent relative z-20 pointer-events-none">
            {/* Ambient glass orbs, matching the pricing section treatment */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-10 left-[10%] w-96 h-96 bg-amber-400/10 rounded-full blur-[110px]" />
                <div className="absolute bottom-0 right-[5%] w-[450px] h-[450px] bg-cyan-400/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto pointer-events-auto relative z-10">

                {/* ── Heading ── */}
                <div className="flex flex-col items-center text-center mb-12">
                    <motion.span
                        className="text-gray-400 font-bold tracking-[0.2em] text-sm uppercase mb-4"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        What Students Say
                    </motion.span>

                    <motion.h2
                        className="flex flex-col items-center mb-8"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="font-serif italic text-4xl md:text-5xl text-gray-400 font-normal" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Don't take our word.
                        </span>
                        <span className="font-sans font-black text-4xl md:text-6xl tracking-tighter text-black uppercase mt-2">
                            Take theirs.
                        </span>
                    </motion.h2>

                    {/* Google rating badge, links to the live profile */}
                    <motion.a
                        href={GOOGLE_REVIEWS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-gray-200 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <GoogleG />
                        <span className="font-black text-gray-900 text-lg tracking-tight">5.0</span>
                        <Stars />
                        <span className="text-xs font-bold tracking-widest uppercase text-gray-500">on Google</span>
                    </motion.a>
                </div>

                {/* ── Review carousel ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mb-6"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div className="overflow-hidden -mx-3 cursor-grab active:cursor-grabbing">
                        <motion.div
                            className="flex"
                            animate={{ x: `${(-index * 100) / visible}%` }}
                            transition={{ type: 'spring', stiffness: 240, damping: 32 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.08}
                            onDragStart={() => setPaused(true)}
                            onDragEnd={handleDragEnd}
                        >
                            {REVIEWS.map(review => (
                                <div
                                    key={review.name}
                                    className="shrink-0 px-3 py-2"
                                    style={{ flex: `0 0 ${100 / visible}%` }}
                                >
                                    <motion.figure
                                        whileHover={{ y: -6 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                                        className="rounded-3xl p-7 flex flex-col relative overflow-hidden h-full min-h-[300px]"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.08)',
                                            backdropFilter: 'blur(12px)',
                                            WebkitBackdropFilter: 'blur(12px)',
                                            border: '1px solid rgba(255, 255, 255, 0.20)',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                                        }}
                                    >
                                        {/* Accent bar, belt palette */}
                                        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: review.accent }} />

                                        <Stars className="w-3.5 h-3.5" />

                                        <blockquote className="text-gray-600 font-light text-[15px] leading-relaxed mt-4 mb-6 flex-grow">
                                            "{review.text}"
                                        </blockquote>

                                        <figcaption className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
                                                    style={{ background: review.accent }}
                                                >
                                                    {review.name.charAt(0)}
                                                </div>
                                                <span className="text-gray-900 font-bold text-sm">{review.name}</span>
                                            </div>
                                            <a
                                                href={GOOGLE_REVIEWS_URL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-gray-600 transition-colors"
                                                title="Read on Google"
                                            >
                                                <GoogleG className="w-3.5 h-3.5" />
                                                Review
                                            </a>
                                        </figcaption>
                                    </motion.figure>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                {/* ── Carousel controls: progress + arrows ── */}
                <motion.div
                    className="flex items-center justify-between gap-6 mb-14"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    {/* Progress track, house yellow to cyan gradient */}
                    <div className="flex-grow h-[3px] rounded-full bg-gray-200/70 overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(to right, #eab308, #06b6d4)' }}
                            animate={{ width: `${maxIndex === 0 ? 100 : ((index + 1) / (maxIndex + 1)) * 100}%` }}
                            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                        />
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-bold tracking-widest text-gray-400 tabular-nums">
                            {index + 1} / {maxIndex + 1}
                        </span>
                        <ArrowButton direction="prev" onClick={prev} />
                        <ArrowButton direction="next" onClick={next} />
                    </div>
                </motion.div>

                {/* ── Photo marquee, drifts continuously, pauses on hover ── */}
                <motion.div
                    className="relative overflow-hidden mb-14 rounded-2xl"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    <style>{`
                        @keyframes tm-marquee {
                            from { transform: translateX(0); }
                            to   { transform: translateX(-50%); }
                        }
                        .tm-marquee-track { animation: tm-marquee 55s linear infinite; }
                        .tm-marquee-track:hover { animation-play-state: paused; }
                        @media (prefers-reduced-motion: reduce) {
                            .tm-marquee-track { animation: none; }
                        }
                    `}</style>
                    <div className="tm-marquee-track flex w-max">
                        {[...PHOTOS, ...PHOTOS].map((photo, idx) => (
                            <div
                                key={`${photo.alt}-${idx}`}
                                className="relative w-[240px] md:w-[330px] aspect-[4/3] rounded-2xl overflow-hidden shrink-0 mr-4 group shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                            >
                                <img
                                    src={photo.src}
                                    alt={idx < PHOTOS.length ? photo.alt : ''}
                                    aria-hidden={idx >= PHOTOS.length}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* House yellow/cyan glass tint on hover */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                    style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.18) 0%, transparent 50%, rgba(6,182,212,0.18) 100%)' }}
                                />
                            </div>
                        ))}
                    </div>
                    {/* Edge fades so the strip melts into the page */}
                    <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-white/90 to-transparent pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-white/90 to-transparent pointer-events-none" />
                </motion.div>

                {/* ── CTA row ── */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <button
                        onClick={onBookTrial}
                        className="group inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white font-black tracking-widest text-sm uppercase rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:bg-black hover:scale-105 transition-all duration-300"
                    >
                        <span>Book your free trial</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                    <a
                        href={GOOGLE_REVIEWS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-5 border border-gray-200 bg-white/70 backdrop-blur-md text-gray-700 font-bold tracking-widest text-sm uppercase hover:bg-white hover:border-gray-400 transition-all duration-300 rounded-sm shadow-sm"
                    >
                        <GoogleG />
                        Read all reviews
                    </a>
                </motion.div>

            </div>
        </section>
    );
}
