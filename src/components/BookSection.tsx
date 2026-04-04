import { useState } from 'react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────
// BJJ-ONLY SCHEDULE (filtered from full timetable)
// ─────────────────────────────────────────────
const BJJ_SCHEDULE = [
    {
        day: 'Mon',
        classes: []
    },
    {
        day: 'Tue',
        classes: [
            { time: '5:00 – 5:50pm', name: 'Kids BJJ', level: 'kids' },
            { time: '6:00 – 7:00pm', name: 'Beginners', level: 'beginner' },
            { time: '7:00 – 8:00pm', name: 'Intermediate', level: 'intermediate' },
        ]
    },
    {
        day: 'Wed',
        classes: []
    },
    {
        day: 'Thu',
        classes: []
    },
    {
        day: 'Fri',
        classes: [
            { time: '6:00 – 7:00pm', name: 'Beginners', level: 'beginner' },
            { time: '7:00 – 8:00pm', name: 'Intermediate', level: 'intermediate' },
        ]
    },
    {
        day: 'Sat',
        classes: [
            { time: '1:00 – 3:00pm', name: 'Fundamentals', level: 'fundamentals' },
        ]
    },
    {
        day: 'Sun',
        classes: [
            { time: '9:00 – 9:50am', name: 'Kids BJJ', level: 'kids' },
        ]
    },
];

const LEVEL_STYLES: Record<string, { pill: string; dot: string; label: string }> = {
    kids:         { pill: 'bg-green-500/10 border-green-400/30 text-green-400',       dot: 'bg-green-400',  label: 'Kids' },
    beginner:     { pill: 'bg-orange-500/10 border-orange-400/30 text-orange-400',    dot: 'bg-orange-400', label: 'Beginner' },
    intermediate: { pill: 'bg-sky-500/10 border-sky-400/30 text-sky-400',             dot: 'bg-sky-400',    label: 'Intermediate' },
    fundamentals: { pill: 'bg-amber-500/10 border-amber-400/30 text-amber-400',       dot: 'bg-amber-400',  label: 'Fundamentals' },
};

const DAYS_FULL: Record<string, string> = {
    Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
    Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
};

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
interface BookSectionProps {
    onFullTimetable: () => void;
}

export function BookSection({ onFullTimetable }: BookSectionProps) {
    const [activeDay, setActiveDay] = useState<string | null>(null);

    const todayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
    const displayDay = activeDay ?? todayShort;
    const dayData = BJJ_SCHEDULE.find(d => d.day === displayDay) ?? BJJ_SCHEDULE[0];

    return (
        <section className="w-full pt-4 pb-16 md:pt-6 md:pb-20 px-6 md:px-16 lg:px-24 bg-transparent relative z-20">

            {/* Faint horizontal divider matching site aesthetic */}
            <div className="max-w-6xl mx-auto mb-12">
                <div className="flex items-center gap-6">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300/40 to-transparent" />
                    <span className="text-[10px] font-bold tracking-[0.35em] text-gray-400 uppercase shrink-0">
                        On The Mats
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300/40 to-transparent" />
                </div>
            </div>

            <div className="max-w-6xl mx-auto">

                {/* ── Section Header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <span className="inline-block text-[10px] font-bold tracking-[0.3em] text-orange-400 uppercase mb-3">
                            Docklands · Inside Empower Tactical
                        </span>
                        <h2
                            className="font-serif italic text-4xl md:text-5xl text-gray-900 font-normal mb-1"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Book a class.
                        </h2>
                        <p className="font-sans font-black text-4xl md:text-5xl uppercase tracking-tighter text-gray-900 leading-none">
                            Start today.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                        <a
                            href="https://link.bizly.pro/payment-link/697ad46b77ba091443ce0cce"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-gray-900 text-white font-bold tracking-widest text-xs uppercase rounded-sm hover:bg-black hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] transition-all"
                        >
                            <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Book free trial
                        </a>
                        <button
                            onClick={onFullTimetable}
                            className="inline-flex items-center justify-center gap-2 px-7 py-4 border border-gray-300 text-gray-600 font-bold tracking-widest text-xs uppercase rounded-sm hover:border-gray-500 hover:bg-white/60 hover:backdrop-blur-sm transition-all"
                        >
                            Full timetable
                        </button>
                    </div>
                </div>

                {/* ── Day Tabs ── */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide">
                    {BJJ_SCHEDULE.map(({ day }) => {
                        const isToday = day === todayShort;
                        const isActive = day === displayDay;
                        return (
                            <button
                                key={day}
                                onClick={() => setActiveDay(day)}
                                className={`
                                    relative shrink-0 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all
                                    ${isActive
                                        ? 'bg-gray-900 text-white shadow-md'
                                        : 'bg-white/60 backdrop-blur-sm border border-gray-200/70 text-gray-500 hover:border-gray-400 hover:text-gray-900 hover:bg-white/80'
                                    }
                                `}
                            >
                                {day}
                                {isToday && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-400 border-2 border-white" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ── Day Classes ── */}
                <motion.div
                    key={displayDay}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {dayData.classes.length > 0 ? (
                        dayData.classes.map((cls, i) => {
                            const style = LEVEL_STYLES[cls.level] ?? LEVEL_STYLES['beginner'];
                            return (
                                <div
                                    key={i}
                                    className="group p-5 rounded-2xl border border-white/70 bg-white/60 backdrop-blur-md shadow-sm hover:shadow-lg hover:bg-white/80 hover:-translate-y-1 transition-all duration-300"
                                >
                                    {/* Level badge */}
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border mb-4 ${style.pill}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                                        {style.label}
                                    </span>

                                    <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">
                                        {DAYS_FULL[displayDay]} · {cls.time}
                                    </p>
                                    <h3 className="font-black text-gray-900 text-xl uppercase tracking-tight mb-4">
                                        BJJ {cls.name}
                                    </h3>

                                    <a
                                        href="https://link.bizly.pro/payment-link/697ad46b77ba091443ce0cce"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors"
                                    >
                                        Book this class
                                        <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-14 h-14 rounded-full bg-white/60 backdrop-blur-sm border border-gray-200/70 flex items-center justify-center mb-4">
                                <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 12a8 8 0 11-16 0 8 8 0 0116 0z M12 8v4l3 3" />
                                </svg>
                            </div>
                            <p
                                className="font-serif italic text-gray-400 text-xl mb-1"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Rest day
                            </p>
                            <p className="text-gray-400 text-sm">No BJJ classes on {DAYS_FULL[displayDay]}.</p>
                            <button
                                onClick={onFullTimetable}
                                className="mt-6 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-gray-900 underline underline-offset-2 transition-colors"
                            >
                                See all classes →
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* ── Trust bar ── */}
                <div className="mt-16 pt-8 border-t border-gray-200/50 flex flex-wrap gap-6 justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    {['No Contract', 'Cancel Anytime', 'First Class Free', 'All Levels Welcome'].map(txt => (
                        <span key={txt} className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-orange-400" />
                            {txt}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
