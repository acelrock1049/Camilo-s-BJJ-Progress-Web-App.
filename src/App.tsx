import { useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Brain, Menu, X } from 'lucide-react';
import './index.css';
import camiloImg from './assets/camilo.jpg';
import { SurveyModal } from './components/SurveyModal';
import { SpiralExperience } from './components/SpiralExperience';
import { ScrollPopup, ExitIntentPopup } from './components/LeadCapturePopup';
import { BookSection } from './components/BookSection';
import { FoundationSection } from './components/FoundationSection';
import { FooterOld } from './components/FooterOld';
import { AnimatedHero } from './components/AnimatedHero';
import imgWomens from './assets/paula-camilo.jpeg';
import imgSelfImprovement from './assets/self-improvement.jpg';
import imgBjjKids from './assets/bjj-kids-banner.png';


const BeltMandala = () => {
    return (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1800px] flex items-center justify-center z-0 pointer-events-none opacity-30">
            <style>{`
                @keyframes slowSpin  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
                @keyframes slowSpinR { from { transform: rotate(360deg); } to { transform: rotate(0deg);    } }
                .ml-1 { animation: slowSpin  90s linear infinite; }
                .ml-2 { animation: slowSpinR 120s linear infinite; }
                .ml-3 { animation: slowSpin  150s linear infinite; }
            `}</style>

            {/* Layer 1 — outer ellipse ring, blue */}
            <div className="absolute w-[1600px] h-[1600px] ml-1">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <ellipse cx="50" cy="50" rx="48" ry="18" fill="none" stroke="#3b82f6" strokeWidth="0.12" opacity="0.6"/>
                    <ellipse cx="50" cy="50" rx="48" ry="18" fill="none" stroke="#3b82f6" strokeWidth="0.08" opacity="0.3" transform="rotate(60 50 50)"/>
                    <ellipse cx="50" cy="50" rx="48" ry="18" fill="none" stroke="#3b82f6" strokeWidth="0.08" opacity="0.3" transform="rotate(120 50 50)"/>
                </svg>
            </div>

            {/* Layer 2 — mid ellipse ring, orange */}
            <div className="absolute w-[1100px] h-[1100px] ml-2">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <ellipse cx="50" cy="50" rx="46" ry="14" fill="none" stroke="#f97316" strokeWidth="0.14" opacity="0.5"/>
                    <ellipse cx="50" cy="50" rx="46" ry="14" fill="none" stroke="#f97316" strokeWidth="0.09" opacity="0.25" transform="rotate(90 50 50)"/>
                </svg>
            </div>

            {/* Layer 3 — inner circle, purple/black */}
            <div className="absolute w-[650px] h-[650px] ml-3">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#9333ea" strokeWidth="0.18" strokeDasharray="4 6" opacity="0.5"/>
                    <circle cx="50" cy="50" r="28" fill="none" stroke="#1f2937" strokeWidth="0.2" opacity="0.4"/>
                </svg>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// WHO WE HELP CARDS
// Glassmorphism aesthetic + Foundation-style Framer Motion interactions.
// Animation triggers on every viewport entry (once: false) — works scroll up/down.
// Active state controlled by React (not CSS :hover) for reliable touch support.
// ─────────────────────────────────────────────────────────────────────────────
const WHO_CARDS = [
    {
        title: "WOMEN'S TRAINING",
        short: 'Empowerment, real self-defense & community.',
        long: 'We know that taking the first step in martial arts can be intimidating. Discover the warrior within in a completely ego-free space with Paula and Camilo.',
        hex: '#ec4899',
        accentFrom: '#ec4899',
        accentTo: '#f43f5e',
        glowColor: 'rgba(236,72,153,0.3)',
        borderActive: 'border-pink-400/50',
        img: imgWomens,
        action: 'womens' as const,
    },
    {
        title: 'SELF-IMPROVEMENT SEEKERS',
        short: 'Technique over brute force — the "Smart System".',
        long: "You've read the books, you do the habits, but you need a physical crucible. Our curriculum is built on evolution: a progressive framework where every belt represents a new level of physical mastery and psychological growth.",
        hex: '#eab308',
        accentFrom: '#eab308',
        accentTo: '#06b6d4',
        glowColor: 'rgba(234,179,8,0.3)',
        borderActive: 'border-yellow-400/50',
        img: imgSelfImprovement,
        action: 'expand' as const,
    },
    {
        title: 'BJJ KIDS',
        short: 'Building resilient leaders on the mats.',
        long: "Forget traditional \"fight factories\". At Camilo's BJJ, children don't just learn technical self-defense; they learn vital skills for the real world.",
        hex: '#16a34a',
        accentFrom: '#16a34a',
        accentTo: '#22c55e',
        glowColor: 'rgba(22,163,74,0.3)',
        borderActive: 'border-green-500/50',
        img: imgBjjKids,

        action: 'kids' as const,
    },
] as const;

// ── Pricing card wrapper: desktop hover + mobile scroll-in glow ──
function PricingGlowCard({
    children,
    accentGlow,
    className,
}: {
    children: ReactNode;
    accentGlow: string; // e.g. '0 20px 40px rgba(59,130,246,0.2)'
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const inView = useInView(ref, { amount: 0.7, once: false });

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const showGlow = hovered || (isMobile && inView);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                boxShadow: showGlow ? accentGlow : '0 8px 32px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.4s ease-in-out, background-color 0.35s ease-in-out',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
        </div>
    );
}

interface WhoWeHelpCardsProps {
    expandedCard: number | null;
    setExpandedCard: (v: number | null) => void;
    onKidsModal: () => void;
    onWomensModal: () => void;
    onSpiralOpen: () => void;
}

function WhoWeHelpCards({ expandedCard, setExpandedCard, onKidsModal, onWomensModal, onSpiralOpen }: WhoWeHelpCardsProps) {
    // Active card tracks hover (desktop) or tap (mobile)
    const [activeCard, setActiveCard] = useState<number | null>(null);

    const handleClick = (idx: number) => {
        const card = WHO_CARDS[idx];
        if (card.action === 'kids')    { onKidsModal();   return; }
        if (card.action === 'womens')  { onWomensModal(); return; }
        // expand
        setExpandedCard(expandedCard === idx ? null : idx);
        setActiveCard(idx);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {WHO_CARDS.map((card, idx) => {
                const isExpanded = expandedCard === idx && card.action === 'expand';
                const isActive   = activeCard === idx || isExpanded;

                return (
                    <motion.div
                        key={idx}
                        layoutId={card.action === 'kids' ? 'bjj-kids-card' : card.action === 'womens' ? 'womens-training-card' : undefined}
                        // Viewport entry animation — once:false re-fires on scroll up too
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: '-60px' }}
                        transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        // Lift on active
                        animate={{ y: isActive ? -8 : 0 }}
                        className={`
                            relative overflow-hidden rounded-3xl border cursor-pointer select-none
                            bg-black/40 backdrop-blur-xl
                            transition-[border-color,box-shadow] duration-300
                            ${isActive ? card.borderActive : 'border-white/10'}
                        `}
                        style={{
                            boxShadow: isActive
                                ? `0 24px 64px ${card.glowColor}, 0 0 0 1px ${card.glowColor}`
                                : '0 8px 32px rgba(0,0,0,0.25)',
                        }}
                        onMouseEnter={() => setActiveCard(idx)}
                        onMouseLeave={() => setActiveCard(null)}
                        onClick={() => handleClick(idx)}
                        whileTap={{ scale: 0.985 }}
                    >
                        {/* Background image — grayscale → color on active */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                            style={{
                                backgroundImage: `url('${card.img}')`,
                                opacity: isActive ? 0.55 : 0.25,
                                filter: isActive ? 'grayscale(0%)' : 'grayscale(80%)',
                                mixBlendMode: 'luminosity',
                            }}
                        />

                        {/* Color glow gradient — fades in on active */}
                        <div
                            className="absolute inset-0 pointer-events-none transition-opacity duration-400"
                            style={{
                                background: `linear-gradient(to top, ${card.hex}cc, ${card.hex}40 55%, transparent 85%)`,
                                opacity: isActive ? 1 : 0,
                            }}
                        />

                        {/* Accent top bar */}
                        <div
                            className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                            style={{
                                background: `linear-gradient(to right, ${card.accentFrom}, ${card.accentTo})`,
                                opacity: isActive ? 1 : 0,
                            }}
                        />

                        {/* Glassmorphism inner content */}
                        <div className="relative z-10 p-8 md:p-10 flex flex-col justify-end min-h-[420px] md:min-h-[500px]">
                            <motion.div
                                animate={{ y: isExpanded ? 0 : 8 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="mt-auto"
                            >
                                <h3 className="text-2xl lg:text-3xl font-black tracking-tight text-white uppercase mb-3 leading-none drop-shadow-md">
                                    {card.title}
                                </h3>
                                <p className={`text-white/85 font-light text-sm leading-relaxed drop-shadow-sm transition-all duration-400 ${isExpanded ? 'opacity-0 h-0 overflow-hidden mb-0' : 'opacity-100 mb-0'}`}>
                                    {card.short}
                                </p>

                                {/* Expanded copy — smooth height transition */}
                                <motion.div
                                    initial={false}
                                    animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className="w-8 h-0.5 bg-white/40 mb-4 mt-1" />
                                    <p className="text-white/90 font-light leading-relaxed italic text-sm sm:text-base mb-5">
                                        "{card.long}"
                                    </p>
                                    {card.action !== 'expand' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (card.action === 'kids') {
                                                    onKidsModal();
                                                } else if (card.action === 'womens') {
                                                    onWomensModal();
                                                }
                                            }}
                                            className="px-6 py-3 bg-white text-gray-900 text-xs font-bold tracking-widest uppercase rounded-full flex items-center gap-2 shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            Join this track
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </button>
                                    )}
                                </motion.div>

                                {/* Always visible pulsating button for Self Improvement Seekers */}
                                {card.action === 'expand' && (
                                    <motion.button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSpiralOpen();
                                        }}
                                        animate={{
                                            boxShadow: [
                                                "0 0 10px rgba(234,179,8,0)",
                                                "0 0 30px rgba(234,179,8,0.8)",
                                                "0 0 10px rgba(234,179,8,0)"
                                            ]
                                        }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                        className="mt-6 px-6 py-3 bg-white text-gray-900 text-xs font-bold tracking-widest uppercase rounded-full flex items-center gap-2 hover:bg-gray-100 hover:scale-105 transition-all cursor-pointer z-20 self-start group"
                                    >
                                        Discover It
                                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </motion.button>
                                )}
                            </motion.div>
                        </div>

                        {/* Tap indicator — always visible on mobile, fades on active */}
                        <motion.div
                            className="absolute top-5 right-5"
                            animate={{ opacity: isActive ? 0 : 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                            </svg>
                        </motion.div>
                    </motion.div>
                );
            })}
        </div>
    );
}

function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [showKidsModal, setShowKidsModal] = useState(false);
  const [showWomensModal, setShowWomensModal] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showSpiralExperience, setShowSpiralExperience] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // ── Scroll-aware header / logo ──
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [logoOffset, setLogoOffset] = useState(0);

  const calcLogoOffset = useCallback(() => {
    // X distance to move logo from its natural left position to horizontal center
    setLogoOffset(window.innerWidth / 2 - 72);
  }, []);

  useEffect(() => {
    calcLogoOffset();
    window.addEventListener('resize', calcLogoOffset);
    return () => window.removeEventListener('resize', calcLogoOffset);
  }, [calcLogoOffset]);

  useEffect(() => {
    return scrollY.on('change', v => setScrolled(v > 60));
  }, [scrollY]);

  // Logo: centered + 150% at scroll=0, springs to top-left at 100% on scroll
  const logoXRaw    = useTransform(scrollY, [0, 100], [logoOffset, 0]);
  const logoX       = useSpring(logoXRaw,    { stiffness: 260, damping: 30 });
  const logoScaleRaw = useTransform(scrollY, [0, 100], [1.5, 1]);
  const logoScale   = useSpring(logoScaleRaw, { stiffness: 260, damping: 30 });

  const headerBgOpacity = useTransform(scrollY, [0, 90], [0, 1]);
  const navOpacity = useTransform(scrollY, [40, 90], [0, 1]);

  useEffect(() => {
    if (showKidsModal || showWomensModal || showTimetableModal || showSurveyModal || showSpiralExperience) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showKidsModal, showWomensModal, showTimetableModal, showSurveyModal, showSpiralExperience]);

  useEffect(() => {
    if (!mountRef.current) return;

    const isMobile = window.innerWidth <= 768;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 10, 25);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const dnaGroup = new THREE.Group();
    if (!isMobile) dnaGroup.position.x = 4;

    const numPoints = isMobile ? 120 : 250;
    const height = 30;
    const radius = 2.5;
    const turns = isMobile ? 3 : 5;

    const points1: THREE.Vector3[] = [];
    const points2: THREE.Vector3[] = [];
    const colors1: number[] = [];
    const colors2: number[] = [];
    const pairPoints: THREE.Vector3[] = [];
    const pairColors: number[] = [];

    const bjjColors = [
      new THREE.Color(0xffffff),
      new THREE.Color(0x2563eb),
      new THREE.Color(0x9333ea),
      new THREE.Color(0x78350f),
      new THREE.Color(0x222222),
    ];
    const sdColors = [
      new THREE.Color(0xf5f5dc),
      new THREE.Color(0x800080),
      new THREE.Color(0xff0000),
      new THREE.Color(0x0000ff),
      new THREE.Color(0xffa500),
      new THREE.Color(0x008000),
      new THREE.Color(0xffff00),
      new THREE.Color(0x40e0d0),
    ];

    function getColorAtPosition(arr: THREE.Color[], t: number) {
      const s = t * (arr.length - 1);
      const i = Math.floor(s);
      if (i >= arr.length - 1) return arr[arr.length - 1].clone();
      return arr[i].clone().lerp(arr[i + 1], s - i);
    }

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const y = (t - 0.5) * height;
      const angle = t * Math.PI * 2 * turns;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      points1.push(new THREE.Vector3(x1, y, z1));

      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      points2.push(new THREE.Vector3(x2, y, z2));

      const cBJJ = getColorAtPosition(bjjColors, t);
      const cSD  = getColorAtPosition(sdColors, t);
      colors1.push(cBJJ.r, cBJJ.g, cBJJ.b);
      colors2.push(cSD.r,  cSD.g,  cSD.b);

      if (i % 4 === 0) {
        pairPoints.push(new THREE.Vector3(x1, y, z1));
        pairPoints.push(new THREE.Vector3(x2, y, z2));
        const blend = cBJJ.clone().lerp(cSD, 0.5);
        pairColors.push(blend.r, blend.g, blend.b, blend.r, blend.g, blend.b);
      }
    }

    const mat = { vertexColors: true, transparent: true, opacity: 1.0, linewidth: 3 };

    const geo1 = new THREE.BufferGeometry().setFromPoints(points1);
    geo1.setAttribute('color', new THREE.Float32BufferAttribute(colors1, 3));
    dnaGroup.add(new THREE.Line(geo1, new THREE.LineBasicMaterial(mat)));

    const geo2 = new THREE.BufferGeometry().setFromPoints(points2);
    geo2.setAttribute('color', new THREE.Float32BufferAttribute(colors2, 3));
    dnaGroup.add(new THREE.Line(geo2, new THREE.LineBasicMaterial(mat)));

    const pairGeo = new THREE.BufferGeometry().setFromPoints(pairPoints);
    pairGeo.setAttribute('color', new THREE.Float32BufferAttribute(pairColors, 3));
    dnaGroup.add(new THREE.LineSegments(pairGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.25 })));

    scene.add(dnaGroup);

    let targetRotation = 0;
    let targetPositionY = 0;
    let animationFrameId: number;
    const fpsInterval = 1000 / (isMobile ? 30 : 60);
    let lastFrameTime = 0;

    const handleScroll = () => {
      targetRotation  = window.scrollY * 0.003;
      targetPositionY = window.scrollY * 0.005;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);
      if (now - lastFrameTime < fpsInterval) return;
      lastFrameTime = now;
      dnaGroup.rotation.y += 0.002;
      dnaGroup.rotation.y += (targetRotation - dnaGroup.rotation.y) * 0.08;
      dnaGroup.position.y += (targetPositionY - dnaGroup.position.y) * 0.08;
      renderer.render(scene, camera);
    };
    animate(0);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      dnaGroup.position.x = window.innerWidth <= 768 ? 0 : 4;
    };
    window.addEventListener('resize', handleResize);

    const currentMount = mountRef.current;
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount) currentMount.removeChild(renderer.domElement);
      geo1.dispose(); geo2.dispose(); pairGeo.dispose(); renderer.dispose();
    };
  }, []);

  return (
    <div className="antialiased max-w-[100vw] overflow-x-hidden">
      {/* DNA helix background */}
      <div id="canvas-container" ref={mountRef}></div>

      {/* Web Page Content */}
      <main className="content-layer">
        
        {/* ── Header ── */}
        <header className="fixed top-0 left-0 w-full px-8 py-4 flex items-center justify-between z-50 h-[72px]">

            {/* Progressive blur/glass overlay — fades in on scroll */}
            <motion.div
                className="absolute inset-0 backdrop-blur-md bg-white/70 border-b border-black/[0.06] -z-10"
                style={{ opacity: headerBgOpacity }}
            />

            {/* Logo — springs from center (150%) to top-left on scroll */}
            <motion.img
                src="/sticker.png"
                alt="Camilo's BJJ Logo"
                className="h-16 w-auto object-contain drop-shadow-2xl cursor-pointer select-none shrink-0"
                style={{ x: logoX, scale: logoScale }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />

            {/* Nav — fades in after scroll */}
            <motion.nav
                className="hidden md:flex items-center gap-6 text-sm font-bold tracking-widest uppercase text-gray-900"
                style={{ opacity: navOpacity, pointerEvents: scrolled ? 'auto' : 'none' }}
            >
                <a href="#method" className="hover:text-orange-500 transition-colors">Method</a>
                <button
                    onClick={() => setShowTimetableModal(true)}
                    className="hover:text-orange-500 transition-colors"
                >
                    Timetable
                </button>
                <a href="#pricing" className="hover:text-orange-500 transition-colors">Pricing</a>

                {/* Instagram icon */}
                <a
                    href="https://www.instagram.com/camilosbjj/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-500 transition-colors"
                    title="Instagram"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                </a>

                {/* Brain icon → BJJ mindset survey */}
                <button
                    onClick={() => setShowSurveyModal(true)}
                    className="hover:text-yellow-500 transition-colors"
                    title="Find your mindset for BJJ"
                >
                    <Brain className="w-4 h-4" />
                </button>
            </motion.nav>

            {/* Mobile: icon buttons + hamburger */}
            <div className="md:hidden flex items-center gap-2">
                <motion.a
                    href="https://www.instagram.com/camilosbjj/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white shadow-md"
                    style={{ opacity: headerBgOpacity }}
                    whileTap={{ scale: 0.92 }}
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                </motion.a>
                <motion.button
                    onClick={() => setShowSurveyModal(true)}
                    className="p-2 rounded-full bg-yellow-400 text-neutral-900 shadow-md"
                    style={{ opacity: headerBgOpacity }}
                    whileTap={{ scale: 0.92 }}
                    title="Find your mindset for BJJ"
                >
                    <Brain className="w-4 h-4" />
                </motion.button>
                {/* Hamburger — always visible, toggles nav dropdown */}
                <motion.button
                    onClick={() => setShowMobileMenu(v => !v)}
                    className="p-2 rounded-full bg-white/70 backdrop-blur-md border border-gray-200/60 text-gray-800 shadow-sm"
                    whileTap={{ scale: 0.92 }}
                    aria-label="Toggle navigation"
                >
                    {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </motion.button>
            </div>

            {/* Mobile nav dropdown — slides down below header */}
            <AnimatePresence>
                {showMobileMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="md:hidden absolute top-full left-0 w-full bg-white/85 backdrop-blur-xl border-b border-gray-200/40 shadow-lg z-40 px-8 py-6 flex flex-col gap-5"
                    >
                        <a
                            href="#method"
                            onClick={() => setShowMobileMenu(false)}
                            className="text-sm font-bold tracking-widest uppercase text-gray-900 hover:text-orange-500 transition-colors"
                        >
                            Method
                        </a>
                        <button
                            onClick={() => { setShowTimetableModal(true); setShowMobileMenu(false); }}
                            className="text-left text-sm font-bold tracking-widest uppercase text-gray-900 hover:text-orange-500 transition-colors"
                        >
                            Timetable
                        </button>
                        <a
                            href="#pricing"
                            onClick={() => setShowMobileMenu(false)}
                            className="text-sm font-bold tracking-widest uppercase text-gray-900 hover:text-orange-500 transition-colors"
                        >
                            Pricing
                        </a>
                        <hr className="border-gray-200/60" />
                        <button
                            onClick={() => { setShowSurveyModal(true); setShowMobileMenu(false); }}
                            className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-yellow-600 hover:text-yellow-500 transition-colors"
                        >
                            <Brain className="w-4 h-4" />
                            Find Your Mindset
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>

        {/* ── Hero Section ── */}
        <AnimatedHero onSurveyOpen={() => setShowSurveyModal(true)} />

        {/* ── Separator: Hero → Who We Help ── */}
        <div className="section-divider mx-8 md:mx-24" />

        {/* ── Audience Selection Section ── */}
        <section className="px-8 md:px-24 pt-20 pb-16 md:pt-24 md:pb-20 bg-transparent relative z-20 pointer-events-none">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center pointer-events-auto">

                <motion.span
                    className="text-gray-400 font-bold tracking-[0.2em] text-sm uppercase mb-4"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    Who We Help
                </motion.span>

                <motion.h2
                    className="flex flex-col relative z-10 select-none items-center w-full mb-10 px-4"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="font-serif italic text-4xl md:text-5xl text-gray-400 font-normal" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Who are you
                    </span>
                    <span className="font-sans font-black text-4xl md:text-6xl tracking-tighter text-black uppercase mt-2">
                        looking to become?
                    </span>
                </motion.h2>

                <motion.p
                    className="max-w-2xl text-gray-500 font-light text-lg mb-12 px-4 drop-shadow-sm"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                >
                    We know you're searching for real personal change. Whether you spend 10 hours a day in front of a screen, want to empower your team, or wish to instil unbreakable discipline in your kids — we do things differently.
                </motion.p>

                {/* Interactive Cards — glassmorphism + Foundation-style animations */}
                <WhoWeHelpCards
                    expandedCard={expandedCard}
                    setExpandedCard={setExpandedCard}
                    onKidsModal={() => setShowKidsModal(true)}
                    onWomensModal={() => setShowWomensModal(true)}
                    onSpiralOpen={() => setShowSpiralExperience(true)}
                />
            </div>
        </section>

        {/* ── Foundation Section ── */}
        <FoundationSection />

        {/* ── Separator: Foundation → Survey Banner ── */}
        <div className="section-divider" />

        {/* Full-width Banner for Survey Trigger */}
        <section className="w-full bg-neutral-900 border-y border-white/10 relative z-30 py-12 md:py-14 px-6 cursor-pointer group" onClick={() => setShowSurveyModal(true)}>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
                <div className="text-left w-full md:w-3/4">
                    <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 font-editorial drop-shadow-lg">
                        Discover your Psychological Belt
                    </h3>
                    <p className="text-gray-400 text-lg md:text-xl font-light">
                        Take this 2-minute assessment to map your current mental framework and see how you approach challenges on and off the mats.
                    </p>
                </div>
                <div className="w-full md:w-1/4 flex justify-end">
                    <button className="px-8 py-4 bg-white text-neutral-900 text-sm font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        Take the Test
                    </button>
                </div>
            </div>
        </section>


        {/* ── The Smart System (Our Method) Section ── */}
        <section id="method" className="px-8 md:px-24 pt-20 pb-16 md:pt-28 md:pb-20 bg-transparent relative z-20 pointer-events-none">
            {/* Content Container (On top of 3D) */}
            <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 pointer-events-auto">
                
                {/* Left Column: Text Content */}
                <div className="w-full lg:w-[55%] text-left relative pt-12">
                    {/* BJJ Belt Indicator (Straight Thick Line) */}
                    <div className="absolute -left-4 md:-left-8 top-12 bottom-0 w-3 hidden md:flex flex-col rounded-md shadow-sm overflow-hidden z-20">
                        {/* Gradient representing the belt ranks */}
                        <div 
                            className="flex-grow w-full" 
                            style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #3b82f6 25%, #a855f7 50%, #734021 75%, #171717 100%)' }}
                        ></div>
                        {/* Red Tip (Rank Bar) */}
                        <div className="h-16 w-full bg-red-600"></div>
                    </div>

                    {/* Horizontal Line & "Our Method" Header */}
                    <div className="flex items-center gap-6 mb-8 w-screen relative -left-8 md:-left-24">
                        <div className="h-[1px] bg-gray-900/20 w-16 md:w-48 ml-8 md:ml-24"></div>
                        <span className="text-gray-900 font-serif italic text-2xl whitespace-nowrap">
                            Our method
                        </span>
                        <div className="h-[1px] bg-gray-900/20 flex-grow"></div>
                    </div>
                    
                    <h2 className="flex flex-col relative z-10 select-none mb-10">
                        <span className="font-sans font-black text-4xl md:text-5xl lg:text-6xl tracking-tighter text-gray-900 uppercase leading-none mb-2">
                            Holistic BJJ System:
                        </span>
                        <span className="font-serif italic text-3xl md:text-4xl text-gray-500 font-normal leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Where intelligence defeats giants
                        </span>
                    </h2>

                    <p className="text-gray-600 font-light text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
                        This isn't a regular fight gym — it's a <strong className="font-semibold text-gray-900">Personal Engineering Lab</strong>. We use Jiu-Jitsu as a vehicle to teach strategy, leverage, and mental resilience.
                    </p>

                    <ul className="space-y-8 max-w-xl">
                        <li className="flex items-start gap-4">
                            <svg className="w-6 h-6 text-red-600 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <div>
                                <h4 className="text-gray-900 font-bold text-lg uppercase tracking-wide mb-1">Ego-Free Mats</h4>
                                <p className="text-gray-500 font-light leading-relaxed">Nobody here tries to prove they're stronger than you. We train for mutual growth.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <svg className="w-6 h-6 text-red-600 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <div>
                                <h4 className="text-gray-900 font-bold text-lg uppercase tracking-wide mb-1">Leverage Over Force</h4>
                                <p className="text-gray-500 font-light leading-relaxed">If you're light, a woman, or haven't exercised in years — brute force will injure you. We teach physical and mental engineering.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <svg className="w-6 h-6 text-red-600 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <div>
                                <h4 className="text-gray-900 font-bold text-lg uppercase tracking-wide mb-1">90-Day Roadmap</h4>
                                <p className="text-gray-500 font-light leading-relaxed">Before you break a sweat, we assess your biotype and goals to give you your exact personalised plan.</p>
                            </div>
                        </li>
                    </ul>

                    <p className="mt-12 text-sm text-gray-400 font-medium italic border-l-2 border-gray-200 pl-4 py-1">
                        Your first visit is 45 mins: 15 min goal-setting + 30 min technical intro with the coach. Sweating is optional on day one.
                    </p>
                </div>

                {/* Right Column: Interactive Image */}
                <div className="w-full max-w-md lg:max-w-none lg:w-[40%] relative group mt-16 lg:mt-0 mx-auto lg:mx-0">
                    <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.2)] bg-gray-100 flex items-center justify-center">
                        {/* The Base Image */}
                        <img 
                            src={camiloImg} 
                            alt="Camilo BJJ Coach" 
                            className="w-full h-full object-cover object-top grayscale transition-all duration-700 group-hover:scale-105 absolute inset-0"
                        />
                        
                        {/* The "Vidrioso Eléctrico" Split Gradient Overlay (Yellow & Turquoise) */}
                        <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-[opacity,transform] duration-700 mix-blend-color z-10 scale-105"
                            style={{ background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.8) 0%, rgba(234, 179, 8, 0) 40%, rgba(6, 182, 212, 0) 60%, rgba(6, 182, 212, 0.8) 100%)' }}
                        ></div>
                        
                        {/* Highlighting / Glass Effect Layer */}
                        <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none"
                            style={{ 
                                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, transparent 50%, rgba(6, 182, 212, 0.2) 100%)',
                                boxShadow: 'inset 0 0 40px rgba(255,255,255,0.1)'
                            }}
                        ></div>
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-400/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
                    <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-cyan-400/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
                </div>

            </div>
        </section>



        {/* ── Separator: Method → Pricing ── */}
        <div className="section-divider mx-8 md:mx-24" />

        {/* ── Pricing & CTA Section ── */}
        <section id="pricing" className="px-4 md:px-8 lg:px-24 pt-20 pb-16 md:pt-28 md:pb-20 bg-transparent relative z-20 pointer-events-none">
            {/* BeltMandala clipped in its own container so it doesn't cause section scroll */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <BeltMandala />
            </div>

            <div className="max-w-7xl mx-auto pointer-events-auto relative z-10">
                <div className="text-center mb-16 relative">
                    <h2 className="font-sans font-black text-4xl md:text-5xl lg:text-6xl tracking-tighter text-gray-900 uppercase leading-none mb-4 relative z-10">
                        Engineer Your Evolution
                    </h2>
                    <p className="text-gray-500 font-serif italic text-xl md:text-2xl max-w-2xl mx-auto relative z-10 mb-6">
                        No lock-in contracts. Total freedom. Unbelievable value.
                    </p>
                    {/* Decorative element behind title */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-400/5 rounded-full blur-3xl -z-10"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-center max-w-7xl mx-auto relative z-20 mb-12">
                    
                    {/* Foundation Card */}
                    <PricingGlowCard
                        accentGlow="0 20px 48px rgba(59,130,246,0.2), 0 0 0 1px rgba(59,130,246,0.1)"
                        className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/30 flex flex-col group overflow-hidden relative hover:bg-white/65"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                        <div className="mb-8 relative z-10">
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors duration-350">Foundation</h3>
                            <div className="flex items-baseline gap-1 text-gray-900">
                                <span className="text-5xl font-black tracking-tighter">$49</span>
                                <span className="text-gray-500 font-medium lowercase">/week</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-4 font-light leading-relaxed">
                                Perfect for busy professionals. Stay consistent without overwhelming your schedule.
                            </p>
                        </div>
                        <ul className="space-y-4 mb-10 flex-grow text-gray-700 font-light text-sm relative z-10">
                            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> 2 Classes per week</li>
                            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Zero lock-in contracts</li>
                            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> 90-Day Roadmap included</li>
                        </ul>
                        <a href="https://link.bizly.pro/payment-link/697ad46b77ba091443ce0cce" target="_blank" rel="noopener noreferrer" className="relative z-10 block w-full py-4 px-6 text-center text-gray-900 bg-transparent border-2 border-gray-900 rounded-sm font-bold tracking-widest uppercase text-xs hover:bg-gray-900 hover:text-white transition-all mt-auto shadow-sm">
                            Get Started
                        </a>
                    </PricingGlowCard>

                    {/* The Warrior Card */}
                    {/* The Warrior Card */}
                    <PricingGlowCard
                        accentGlow="0 20px 48px rgba(234,88,12,0.22), 0 0 0 1px rgba(234,88,12,0.1)"
                        className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/30 flex flex-col transform lg:scale-105 z-10 group overflow-hidden relative hover:bg-white/65"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        <div className="absolute top-0 right-8 bg-orange-600 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-b-md shadow-md">El No-Brainer</div>

                        <div className="mb-8 pt-4 relative z-10">
                            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2 group-hover:text-orange-600 transition-colors duration-350">The Warrior</h3>
                            <div className="flex items-baseline gap-1 text-gray-900">
                                <span className="text-6xl font-black tracking-tighter">$69</span>
                                <span className="text-gray-500 font-medium lowercase">/week</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-4 max-w-sm font-light leading-relaxed">
                                Includes all classes from Candidas BJJ and Empower Tactical.
                            </p>
                            <button onClick={() => setShowTimetableModal(true)} className="text-[10px] text-orange-600 font-bold uppercase tracking-widest mt-2 hover:underline">See timetable</button>
                        </div>
                        <ul className="space-y-4 mb-10 flex-grow text-gray-700 font-light text-sm relative z-10">
                            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> <strong className="text-gray-900 font-medium">Unlimited BJJ Classes</strong></li>
                            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> <strong className="text-gray-900 font-medium">Unlimited Striking</strong> (Empower Tactical)</li>
                            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Access to all Open Mats</li>
                        </ul>
                        <a href="https://link.bizly.pro/payment-link/697ad4c06503ca2033772f26" target="_blank" rel="noopener noreferrer" className="relative z-10 block w-full py-5 px-6 text-center text-white bg-orange-600 rounded-sm font-bold tracking-widest uppercase text-sm shadow-[0_10px_20px_rgba(234,88,12,0.2)] hover:bg-orange-500 hover:shadow-[0_15px_30px_rgba(234,88,12,0.4)] hover:-translate-y-1 transition-all mt-auto flex items-center justify-center gap-2">
                            Join Now
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                    </PricingGlowCard>

                    {/* Kids Programs Card */}
                    <PricingGlowCard
                        accentGlow="0 20px 48px rgba(22,163,74,0.2), 0 0 0 1px rgba(22,163,74,0.1)"
                        className="bg-white/50 backdrop-blur-xl rounded-3xl border border-white/30 flex flex-col group overflow-hidden relative hover:bg-white/65 hover:border-green-400/50"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                        {/* Tier 1: Kids Unlimited — content + button paired */}
                        <div className="p-8 pb-6 relative z-10 flex-1 flex flex-col">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2 group-hover:text-green-600 transition-colors duration-350">Kids Unlimited</h3>
                            <div className="flex items-baseline gap-1 text-gray-900">
                                <span className="text-4xl font-black tracking-tighter">$149</span>
                                <span className="text-gray-500 font-medium lowercase">/month</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 font-light leading-relaxed">
                                Unlimited access to BJJ and Kung Fu Kids classes.
                            </p>
                            <a
                                href="https://link.bizly.pro/payment-link/697ad5da6503caab227730c4"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-auto pt-5 block w-full py-3 px-6 text-center text-gray-900 bg-transparent border-2 border-gray-900 rounded-sm font-bold tracking-widest uppercase text-[10px] hover:bg-green-600 hover:border-green-600 hover:text-white transition-all"
                            >
                                Enroll Unlimited
                            </a>
                        </div>

                        {/* Translucent divider between tiers */}
                        <div className="mx-6 border-t border-white/50" />

                        {/* Tier 2: BJJ Kids — content + button paired */}
                        <div className="p-8 pt-6 pb-8 relative z-10 flex-1 flex flex-col">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2 group-hover:text-green-600 transition-colors duration-350">BJJ Kids</h3>
                            <div className="flex items-baseline gap-1 text-gray-900">
                                <span className="text-4xl font-black tracking-tighter">$99</span>
                                <span className="text-gray-500 font-medium lowercase">/month</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 font-light leading-relaxed">
                                1 class per week.
                            </p>
                            <a
                                href="https://link.bizly.pro/payment-link/697ad59277ba09f413ce0e89"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-auto pt-5 block w-full py-3 px-6 text-center text-gray-500 bg-transparent border border-gray-200 rounded-sm font-bold tracking-widest uppercase text-[10px] hover:bg-gray-100 transition-all"
                            >
                                Enroll 1x Week
                            </a>
                        </div>
                    </PricingGlowCard>

                </div>

                {/* The Elite Horizontal Card */}
                <div className="max-w-7xl mx-auto relative z-20">
                    <PricingGlowCard
                        accentGlow="0 20px 48px rgba(180,130,0,0.15), 0 0 0 1px rgba(180,130,0,0.08)"
                        className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/30 group overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-white/65"
                    >
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-4">
                                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter group-hover:text-amber-600 transition-colors">The Elite</h3>
                                <div className="flex items-baseline gap-1 text-gray-900 justify-center">
                                    <span className="text-4xl font-black tracking-tighter">$89</span>
                                    <span className="text-gray-500 font-medium lowercase">/week</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
                                {['By Request', 'Professional Coaching', 'Roadmap', 'System BJJ'].map((tag) => (
                                    <span key={tag} className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-widest">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="shrink-0 w-full md:w-auto">
                            <a href="https://link.bizly.pro/payment-link/697ad50d6503cac371772f7d" target="_blank" rel="noopener noreferrer" className="block w-full md:w-auto py-5 px-12 text-center text-white bg-gray-900 rounded-sm font-bold tracking-widest uppercase text-sm hover:bg-black hover:scale-105 transition-all shadow-xl">
                                Apply Now
                            </a>
                        </div>
                    </PricingGlowCard>
                </div>


                {/* FAQ Section */}
                <div className="mt-16 max-w-4xl mx-auto relative z-20">
                    <div className="text-center mb-16">
                        <h3 className="text-gray-400 font-bold tracking-[0.2em] text-sm uppercase mb-4">Common Questions</h3>
                        <h2 className="font-sans font-black text-4xl md:text-5xl tracking-tighter text-gray-900 uppercase leading-none">
                            Solve your doubts
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                q: "Will I get hurt or hit?",
                                a: "Our mats are 'Ego-Free'. We teach our Smart System focused on leverage and biomechanics, and we control the intensity in small sessions so you learn safely from day one.",
                                color: "#dc2626" // Red (Power/Safety)
                            },
                            {
                                q: "I don't have the strength or fitness level",
                                a: "The Diagnosis class will establish your 90-day Roadmap according to your biotype. BJJ with us requires technique, not brute force. Your fitness will improve naturally while you learn.",
                                color: "#2563eb" // Blue (Order/Authority)
                            },
                            {
                                q: "Do I have to sign long-term contracts?",
                                a: "Absolutely not. All our plans are 'Zero Lock-in'. We believe so much in our methodology that we give you total freedom to start and cancel whenever you want with a simple message.",
                                color: "#16a34a" // Green (Community/Harmony)
                            },
                            {
                                q: "What do I need to bring to my first class?",
                                a: "You only need comfortable athletic wear (T-shirt and shorts/leggings). We provide the necessary equipment for your trial class and technical introduction.",
                                color: "#ea580c" // Orange (Strategy/Success)
                            },
                            {
                                q: "Is it safe for women and children?",
                                a: "Yes. We have a family environment where respect is the foundation. Our kids' classes are separate and focused on anti-bullying, while the Smart System is ideal for anyone, regardless of size, to feel safe.",
                                color: "#b0a28f" // Darker Beige (Instinct/Basics)
                            }
                        ].map((faq, idx) => (
                            <FAQItem key={idx} question={faq.q} answer={faq.a} color={faq.color} />
                        ))}
                    </div>
                </div>

            </div>
        </section>

        {/* ── Separator: Pricing → Book ── */}
        <div className="section-divider mx-8 md:mx-24" />

        {/* ── BOOK A CLASS SECTION ── */}
        <BookSection onFullTimetable={() => setShowTimetableModal(true)} />

        {/* ── FINAL CTA + FOOTER ── */}
        <section className="relative overflow-hidden">

            {/* ── CTA ZONE — matches page glassmorphic aesthetic ── */}
            <div className="relative py-20 md:py-28 bg-white/60 backdrop-blur-xl border-t border-white/40">

                {/* Ambient glow blobs echoing the mandala palette */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-15%] left-[5%] w-[600px] h-[600px] bg-orange-400/8 rounded-full blur-[140px]" />
                    <div className="absolute bottom-[-10%] right-[0%] w-[500px] h-[500px] bg-blue-400/6 rounded-full blur-[120px]" />
                    <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-amber-300/5 rounded-full blur-[100px]" />
                </div>

                {/* Hairline horizontal rule echoing the hero editorial bar */}
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-200 -translate-y-1/2 pointer-events-none" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

                    {/* Eyebrow tag — same style as other section labels */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-10"
                    >
                        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-200 bg-white/80 backdrop-blur-md text-gray-500 text-xs font-bold tracking-[0.25em] uppercase shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            Docklands, Melbourne · Est. 2019
                        </span>
                    </motion.div>

                    {/* Main heading — hero typographic system: serif italic + black sans */}
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="mb-8"
                    >
                        <span
                            className="block font-serif italic text-5xl md:text-7xl text-gray-900 font-normal"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            You are already
                        </span>
                        <span className="block font-sans font-black text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 mt-1">
                            a warrior.
                        </span>
                        <span className="block font-sans font-black text-3xl md:text-5xl uppercase tracking-tighter text-gray-300 mt-3">
                            Start moving like one.
                        </span>
                    </motion.h2>

                    {/* Sub-copy */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-gray-500 text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto mb-14"
                    >
                        Every week you wait is a week someone else is building the confidence,
                        the fitness, and the community you're looking for.{' '}
                        <span className="text-gray-900 font-medium">The mat is ready. Are you?</span>
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
                    >
                        <a
                            href="https://link.bizly.pro/payment-link/697ad46b77ba091443ce0cce"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white font-black tracking-widest text-sm uppercase rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:bg-black hover:shadow-[0_0_50px_rgba(249,115,22,0.3)] hover:scale-105 transition-all duration-300"
                        >
                            <span>Claim your free trial class</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>

                        <a
                            href="https://wa.me/61489038711"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-10 py-5 border border-gray-200 bg-white/70 backdrop-blur-md text-gray-700 font-bold tracking-widest text-sm uppercase hover:bg-white hover:border-green-400 hover:text-green-700 transition-all duration-300 rounded-sm shadow-sm"
                        >
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Ask a question
                        </a>
                    </motion.div>

                    {/* Zero-risk micro-copy */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.55 }}
                        className="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3"
                    >
                        <span className="w-8 h-px bg-gray-300" />
                        No contract · No lock-in · Cancel anytime
                        <span className="w-8 h-px bg-gray-300" />
                    </motion.p>

                </div>
            </div>

            {/* ── FOOTER ── */}
            <FooterOld />

        </section>

        {/* Modals Overlay */}
        <AnimatePresence>
            {showKidsModal && <KidsModal isOpen={showKidsModal} onClose={() => setShowKidsModal(false)} />}
            {showWomensModal && <WomensModal isOpen={showWomensModal} onClose={() => setShowWomensModal(false)} />}
            {showTimetableModal && <TimetableModal isOpen={showTimetableModal} onClose={() => setShowTimetableModal(false)} />}
        </AnimatePresence>

        <SurveyModal isOpen={showSurveyModal} onClose={() => setShowSurveyModal(false)} />

        <SpiralExperience isOpen={showSpiralExperience} onClose={() => setShowSpiralExperience(false)} />

        {/* ── LEAD CAPTURE POPUPS ── */}
        <ScrollPopup onSurveyOpen={() => setShowSurveyModal(true)} />
        <ExitIntentPopup onSurveyOpen={() => setShowSurveyModal(true)} />
      </main>
    </div>
  );
}

const KidsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    // Esc key support
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
                onClick={onClose}
            ></motion.div>

            {/* Modal Container */}
            <motion.div 
                layoutId="bjj-kids-card"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-y-auto shadow-2xl flex flex-col z-10"
            >
                {/* Header Image Area */}
                <div className="relative w-full h-48 md:h-64 bg-green-900 overflow-hidden shrink-0 rounded-t-3xl">
                    <img 
                        src="/src/assets/bjj-kids-banner.png" 
                        alt="BJJ Kids Training" 
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 to-transparent"></div>
                    <button 
                        onClick={onClose}
                        className="absolute top-4 border border-white/20 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    
                    <div className="absolute bottom-6 left-6 md:left-10 text-white">
                        <span className="inline-block px-3 py-1 bg-green-500/80 backdrop-blur-sm rounded-full text-xs font-bold tracking-widest uppercase mb-3 text-white">BJJ Development Programme</span>
                        <h2 className="font-sans font-black text-3xl md:text-5xl uppercase tracking-tighter leading-none mb-1 shadow-black/50 drop-shadow-lg">
                            BJJ Kids
                        </h2>
                        <p className="font-serif italic text-green-100 text-lg md:text-xl drop-shadow max-w-xl">
                            Building resilient leaders on the mats.
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 md:p-10 flex-col gap-12 flex text-gray-800">
                    
                    {/* Intro / Philosophy */}
                    <div className="max-w-4xl border-l-4 border-green-500 pl-6">
                        <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-2">Our Philosophy (The Why)</h3>
                        <p className="text-lg md:text-xl font-light text-gray-700 leading-relaxed mb-4">
                            <strong className="text-gray-900">Play is the vehicle.</strong> We translate the complexity of Jiu-Jitsu into the language of children through stories and fun challenges. Instead of rigid drills, kids learn to defend themselves while navigating <strong className="text-green-600">The floor is lava</strong>, protecting <strong className="text-green-600">The Guard Rock</strong>, or escaping <strong className="text-green-600">The Mount Island</strong>.
                        </p>
                    </div>

                    {/* Emotional Development Traffic Light */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-6">Emotional Development (Conscious Discipline)</h3>
                        <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
                            
                            {/* Traffic Light Graphic */}
                            <div className="bg-gray-900 rounded-full py-4 px-3 flex md:flex-col gap-4 shadow-xl border-4 border-gray-800 shrink-0">
                                <div className="w-10 h-10 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] border-2 border-red-700"></div>
                                <div className="w-10 h-10 rounded-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] border-2 border-yellow-600"></div>
                                <div className="w-10 h-10 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] border-2 border-green-700"></div>
                            </div>
                            
                            <div className="flex-1 space-y-6">
                                <p className="text-lg text-gray-600 leading-relaxed italic">
                                    "We help kids navigate frustration ('losing is learning') and transition from survival reactions to a focussed and secure state of mind."
                                </p>
                                
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-start">
                                        <div className="mt-1 w-3 h-3 rounded-full bg-red-500 shadow-sm shrink-0"></div>
                                        <div><strong className="text-gray-900 block">Survival (Red)</strong><span className="text-sm text-gray-600">Fight, flight, or freeze reactions to stress.</span></div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="mt-1 w-3 h-3 rounded-full bg-yellow-400 shadow-sm shrink-0"></div>
                                        <div><strong className="text-gray-900 block">Emotion (Yellow)</strong><span className="text-sm text-gray-600">Expressing frustration or excitement. Need for connection.</span></div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="mt-1 w-3 h-3 rounded-full bg-green-500 shadow-sm shrink-0"></div>
                                        <div><strong className="text-gray-900 block">Learning (Green)</strong><span className="text-sm text-gray-600">Focussed, secure, and ready to solve problems constructively.</span></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Class Anatomy List */}
                    <div className="bg-gray-900 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        <h3 className="text-sm font-bold text-green-400 tracking-widest uppercase mb-2 relative z-10">A clear structure for learning</h3>
                        <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-8 relative z-10">The Anatomy of a Class (The What)</h4>
                        
                        <div className="space-y-6 relative z-10">
                            {[
                                { title: '1. Connection & Animal Movements (Warm-up)', desc: 'Building physical literacy and group cohesion.' },
                                { title: '2. Thematic Skill Games', desc: 'Translating complex Jiu-Jitsu techniques into fun, objective-based challenges.' },
                                { title: "3. Exploration (Safe 'Starting Points')", desc: 'Controlled, playful sparring scenarios where kids can test techniques safely.' },
                                { title: '4. Reflection & Cool Down', desc: 'Breathing exercises and discussing the lessons learned on the mat.' }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-4 items-start border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold shrink-0 mt-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-green-100 text-lg mb-1">{step.title}</h5>
                                        <p className="text-gray-400 text-sm font-light leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Action */}
                    <div className="text-center pt-4 pb-2">
                        <button className="bg-green-600 hover:bg-green-500 px-8 py-4 rounded-full text-white font-bold uppercase tracking-widest shadow-lg shadow-green-600/30 transition-all hover:scale-105 hover:shadow-green-600/50 w-full sm:w-auto">
                            👉 Schedule a Free Diagnostics Class
                        </button>
                        <p className="text-gray-400 text-xs italic mt-4">We start with a friendly session. No pressure, just connection.</p>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

const WomensModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    // Esc key support
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl cursor-pointer"
                onClick={onClose}
            ></motion.div>

            {/* Modal Container */}
            <motion.div 
                layoutId="womens-training-card"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="relative bg-white w-full max-w-6xl max-h-[90vh] rounded-[2rem] overflow-y-auto shadow-2xl ring-1 ring-black/5 flex flex-col z-10"
            >
                <button 
                    onClick={onClose}
                    className="absolute top-6 border border-gray-200 right-6 p-2 bg-gray-100/40 hover:bg-gray-100 backdrop-blur-md text-gray-900 rounded-full transition-all z-50"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <div className="px-6 pb-8 md:px-12 md:pb-16 pt-12 md:pt-16">
                    {/* Tag & Headings */}
                    <div className="mb-14 outline-none">
                        <span className="inline-block px-5 py-2 rounded-full bg-pink-500/10 text-pink-500 text-sm font-bold tracking-widest uppercase mb-8 border border-pink-500/20">
                            🛡️ Your Safe Space
                        </span>
                        <h3 className="text-4xl md:text-6xl font-black text-gray-900 italic capitalize mb-8 max-w-3xl leading-tight">
                            Awaken your strength.<br/>Train without fear.
                        </h3>
                        <p className="text-gray-600 font-light text-xl md:text-2xl leading-relaxed max-w-4xl border-l-[3px] border-pink-500/50 pl-6 py-2">
                             "We know that taking the first step in martial arts can be intimidating. That's why at Camilo's BJJ, we've created an environment where you can lower your emotional guard so you can raise your physical one. Guided by Paula and Camilo, we invite you to discover the warrior within in a completely ego-free space."
                        </p>
                    </div>

                    {/* Content Grid (Left: Image, Right: Pillars) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        
                        {/* Left: Image with Testimonial */}
                        <div className="lg:col-span-5 relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden group">
                            <div className="absolute inset-0 bg-pink-900/30 mix-blend-overlay z-10 transition-opacity duration-700 group-hover:opacity-10"></div>
                            <img 
                                src="/paula-camilo.jpeg" 
                                alt="Paula and Camilo coaching" 
                                className="w-full h-full object-cover transition-all duration-[1.5s] ease-out hover:scale-105" 
                            />
                            
                            {/* Floating Quote */}
                            <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-gray-200 p-6 rounded-2xl z-20 shadow-2xl transition-all duration-700">
                                <div className="flex gap-1 mb-3 text-yellow-500">
                                    <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                                </div>
                                <p className="text-gray-900 font-medium italic text-base md:text-lg mb-4 leading-relaxed">
                                    "The environment is safe for women to pick up self defence skills in a supportive and respectful community too"
                                </p>
                                <p className="text-pink-600 text-xs md:text-sm font-bold tracking-widest uppercase">
                                    Nat. <span className="text-gray-400 px-2">|</span> Docklands Resident
                                </p>
                            </div>
                        </div>

                        {/* Right: Pillars & CTAs */}
                        <div className="lg:col-span-7 flex flex-col justify-center">
                            <div className="space-y-12">
                                {/* Pillar 1 */}
                                <div className="flex flex-col sm:flex-row gap-6 items-start">
                                    <div className="shrink-0 w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-pink-500 mt-1">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-2xl font-bold text-gray-900 mb-3 tracking-wide">Empathetic Leadership</h4>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            Train under the expert guidance of Paula and Camilo. Having both a female and male presence guarantees an environment of absolute respect and careful technical instruction.
                                        </p>
                                    </div>
                                </div>
                                {/* Pillar 2 */}
                                <div className="flex flex-col sm:flex-row gap-6 items-start">
                                    <div className="shrink-0 w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-pink-500 mt-1">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-2xl font-bold text-gray-900 mb-3 tracking-wide">Unshakeable Confidence</h4>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            Learn real self-defense and biomechanics. Experience the peace of mind that comes from knowing exactly how to protect yourself and move through the world with total confidence.
                                        </p>
                                    </div>
                                </div>
                                {/* Pillar 3 */}
                                <div className="flex flex-col sm:flex-row gap-6 items-start">
                                    <div className="shrink-0 w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-pink-500 mt-1">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-2xl font-bold text-gray-900 mb-3 tracking-wide">Warrior Community</h4>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            We are more than just a gym in Docklands; we are a tribe. Build genuine friendships with women who actively support each other in becoming their best selves.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-6">
                                <button className="w-full sm:w-auto px-8 py-5 bg-gray-900 text-white font-bold tracking-widest text-sm uppercase hover:bg-black transition-colors rounded-sm shadow-xl shrink-0">
                                    Claim Your 1-Week Free Trial
                                </button>
                                <a href="https://wa.me/message/YOUR_WHATSAPP_LINK" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-5 bg-transparent text-gray-900 border border-gray-200 font-bold tracking-widest text-sm uppercase hover:bg-gray-50 hover:border-pink-500/50 hover:text-pink-600 transition-all rounded-sm flex justify-center items-center gap-2">
                                    💬 Chat with Paula
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const FAQItem = ({ question, answer, color }: { question: string, answer: string, color: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="overflow-hidden pointer-events-auto transition-all duration-500">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group transition-all border-b border-gray-100 mb-2"
            >
                <div className="flex items-center gap-4">
                    <div className="w-1 h-8 rounded-full" style={{ backgroundColor: color }}></div>
                    <span className={`text-lg md:text-xl font-bold uppercase tracking-tight transition-colors ${isOpen ? '' : 'text-gray-900 group-hover:text-gray-600'}`} style={{ color: isOpen ? color : '' }}>
                        {question}
                    </span>
                </div>
                <span className={`transform transition-all duration-300 ${isOpen ? 'rotate-180 scale-125' : 'text-gray-400'}`} style={{ color: isOpen ? color : '' }}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col gap-4 m-2 mb-8 origin-top animate-blindDown">
                    <style>{`
                        @keyframes blindDown {
                            from { transform: scaleY(0); opacity: 0; }
                            to { transform: scaleY(1); opacity: 1; }
                        }
                        .animate-blindDown {
                            animation: blindDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                        }
                    `}</style>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-60" style={{ color: color }}>Answer</span>
                    <p className="text-gray-600 font-light text-lg leading-relaxed border-l-4 pl-6" style={{ borderColor: color }}>
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- TIMETABLE COMPONENT ---
const SCHEDULE_DATA = [
  {
    day: "Monday",
    classes: [
      { time: "6:00 - 6:45am", name: "Boxing", type: "striking" },
      { time: "12:00 - 12:30pm", name: "HIIT", type: "fitness" },
      { time: "6:30 - 7:30pm", name: "Adult Kung Fu (Foundation)", type: "kungfu" }
    ]
  },
  {
    day: "Tuesday",
    classes: [
      { time: "6:00 - 6:45am", name: "Boxing", type: "striking" },
      { time: "12:00 - 12:30pm", name: "HIIT", type: "fitness" },
      { time: "5:00 - 5:50pm", name: "Kids BJJ", type: "kids" },
      { time: "6:00 - 7:00pm", name: "Adult BJJ Beginners", type: "adult" },
      { time: "7:00 - 8:00pm", name: "Adult BJJ Intermediate", type: "adult" }
    ]
  },
  {
    day: "Wednesday",
    classes: [
      { time: "12:00 - 12:30pm", name: "HIIT", type: "fitness" },
      { time: "5:30 - 6:20pm", name: "Kung Fu Kids", type: "kids" },
      { time: "6:30 - 7:45pm", name: "Adult Kung Fu (Forms & Apps)", type: "kungfu" }
    ]
  },
  {
    day: "Thursday",
    classes: [
      { time: "6:00 - 7:00pm", name: "Fight Choreography", type: "kungfu" }
    ]
  },
  {
    day: "Friday",
    classes: [
      { time: "6:00 - 7:00pm", name: "Adult BJJ Beginners", type: "adult" },
      { time: "7:00 - 8:00pm", name: "Adult BJJ Intermediate", type: "adult" }
    ]
  },
  {
    day: "Saturday",
    classes: [
      { time: "1:00 - 3:00pm", name: "Adult BJJ Fundamental Class", type: "adult" }
    ]
  },
  {
    day: "Sunday",
    classes: [
      { time: "9:00 - 9:50am", name: "Kids BJJ", type: "kids" },
      { time: "10:00 - 10:50am", name: "Kung Fu Kids", type: "kids" },
      { time: "11:00am - 12:00pm", name: "Adult Kung Fu (Apps & Sparring)", type: "kungfu" }
    ]
  }
];

const getClassStyles = (type: string) => {
    switch(type) {
        case 'kids':
            return 'bg-green-50 border-green-200 text-green-700 shadow-[0_2px_10px_rgba(34,197,94,0.1)]'; // Green
        case 'womens':
            return 'bg-pink-50 border-pink-200 text-pink-700 shadow-[0_2px_10px_rgba(236,72,153,0.1)]'; // Pink
        case 'adult':
            return 'bg-orange-50 border-orange-200 text-orange-700 shadow-[0_2px_10px_rgba(249,115,22,0.1)]'; // Orange
        default:
            return 'bg-gray-50 border-gray-200 text-gray-700'; // Default/Neutral
    }
};

const TimetableModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl cursor-pointer"
                onClick={onClose}
            ></motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="relative bg-white w-full max-w-7xl max-h-[90vh] rounded-[2rem] overflow-y-auto shadow-2xl ring-1 ring-black/5 flex flex-col z-10"
            >
                <button 
                    onClick={onClose}
                    className="absolute top-6 border border-gray-200 right-6 p-2 bg-white/80 hover:bg-gray-100 backdrop-blur-md text-gray-600 rounded-full transition-all z-50"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <div className="p-8 md:p-12 mb-8 relative overflow-hidden shrink-0 border-b border-gray-100">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="relative z-10 text-center">
                        <span className="inline-block px-4 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-bold tracking-widest uppercase mb-4">
                            Training Schedule
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-gray-900 mb-2">
                            Weekly <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Timetable</span>
                        </h2>
                        <p className="font-serif italic text-gray-600 text-xl md:text-2xl mt-4">
                            Find your class. Engineer your evolution.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-2 text-green-600"><span className="w-3 h-3 rounded-full bg-green-500"></span> Kids Program</div>
                        <div className="flex items-center gap-2 text-orange-600"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Adult BJJ (The Smart System)</div>
                    </div>
                </div>

                <div className="px-6 md:px-12 pb-12 overflow-x-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 min-w-[300px] lg:min-w-[1000px]">
                        {SCHEDULE_DATA.map((dayData, idx) => (
                            <div key={idx} className="flex flex-col bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <h3 className="text-center font-black uppercase text-xl text-gray-900 mb-4 tracking-wider pb-2 border-b border-gray-200">
                                    {dayData.day}
                                </h3>
                                <div className="flex flex-col gap-3 flex-grow">
                                    {dayData.classes.length > 0 ? (
                                        dayData.classes.map((cls, cIdx) => (
                                            <div key={cIdx} className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02] ${getClassStyles(cls.type)}`}>
                                                <span className="font-bold tracking-widest text-[10px] uppercase opacity-70 mb-1">{cls.time}</span>
                                                <span className="font-black leading-tight text-sm uppercase">{cls.name}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex-grow flex items-center justify-center p-4">
                                            <span className="text-gray-400 italic font-serif text-sm">Rest day / Open Mat</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="px-6 md:px-12 py-6 bg-gray-50 border-t border-gray-100 flex justify-center items-center rounded-b-[2rem]">
                    <a href="https://wa.me/message/YOUR_WHATSAPP_LINK" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-gray-900 text-white border border-transparent font-bold tracking-widest text-sm uppercase hover:bg-orange-500 transition-colors rounded-full shadow-lg text-center">
                        Book a Trial
                    </a>
                </div>
            </motion.div>
        </div>
    );
};

export default App;
