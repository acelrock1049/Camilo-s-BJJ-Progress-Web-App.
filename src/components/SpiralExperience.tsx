import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'

// --- UTILITIES ---
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

// --- DATA: SELF-EVOLUTION METHODOLOGY ---
const SCENES = [
  {
    id: 'intro',
    belt: 'Intro',
    title: 'The Spiral of Self-Evolution',
    text: 'The path is not to avoid chaos, but to become the axis that masters the pendulum. From instinct to technical fluidity.',
    beltColor: new THREE.Color('#ffffff'),
    sdColor: new THREE.Color('#ffffff'),
    pendulumPosition: 0,
    waveAmp: 0.15,
    waveFreq: 3.0,
    waveSpeed: 1.0,
    turbulence: 0.1,
    finalState: 0.0,
  },
  {
    id: 'white',
    belt: 'White Belt',
    title: 'Survival',
    text: "You arrive at the mat seeking control, but only find Chaos. There is no strategy here, only instinct. The clash against your own ego. Surviving is your only victory.",
    beltColor: new THREE.Color('#ffffff'),
    sdColor: new THREE.Color('#e8dcc4'),
    pendulumPosition: -0.8,
    waveAmp: 0.1,
    waveFreq: 2.0,
    waveSpeed: 6.0,
    turbulence: 1.0,
    finalState: 0.0,
  },
  {
    id: 'blue',
    belt: 'Blue Belt',
    title: 'Structure',
    text: 'Instinct fails, so you seek refuge in structure. You adopt the rules and execute techniques step by step. You are safe in Order, but bound to it.',
    beltColor: new THREE.Color('#2255ff'),
    sdColor: new THREE.Color('#2255ff'),
    pendulumPosition: 0.8,
    waveAmp: 0.03,
    waveFreq: 5.0,
    waveSpeed: 0.8,
    turbulence: 0.0,
    finalState: 0.0,
  },
  {
    id: 'purple',
    belt: 'Purple Belt',
    title: 'Strategy',
    text: "You know the rules, now you learn to break them. You begin to create your own style. You pendulum swiftly between the chaos of innovation and the order of technique.",
    beltColor: new THREE.Color('#800080'),
    sdColor: new THREE.Color('#ff8800'),
    pendulumPosition: 0,
    waveAmp: 0.35,
    waveFreq: 3.5,
    waveSpeed: 3.5,
    turbulence: 0.05,
    finalState: 0.0,
  },
  {
    id: 'brown',
    belt: 'Brown Belt',
    title: 'Fluidity',
    text: "Competition gives way to consciousness. You become fluid, connecting movements without thinking. You no longer fight the chaos; you dance with it in a continuous spiral.",
    beltColor: new THREE.Color('#654321'),
    sdColor: new THREE.Color('#ffd700'),
    pendulumPosition: 0,
    waveAmp: 0.2,
    waveFreq: 4.0,
    waveSpeed: 2.0,
    turbulence: 0.0,
    finalState: 0.0,
  },
  {
    id: 'black',
    belt: 'Black Belt',
    title: 'Systemic Integration',
    text: 'Chaos and Order are the same thing. To evolve is not to avoid the pendulum, it is to become the axis that holds it. The spiral opens towards total mastery.',
    beltColor: new THREE.Color('#151515'),
    sdColor: new THREE.Color('#00e5ff'),
    pendulumPosition: 0,
    waveAmp: 0.15,
    waveFreq: 2.5,
    waveSpeed: 1.0,
    turbulence: 0.0,
    finalState: 0.0,
  },
  {
    id: 'final',
    belt: '',
    title: 'Stop surviving, start evolving.',
    text: 'Book your session and test the system.',
    beltColor: new THREE.Color('#ffffff'),
    sdColor: new THREE.Color('#ffffff'),
    pendulumPosition: 0.5,
    waveAmp: 0.15,
    waveFreq: 2.5,
    waveSpeed: 1.0,
    turbulence: 0.0,
    finalState: 1.0,
  },
]

// --- SHADER CONTROL PANEL TYPES ---
interface PanelParams {
  glowIntensity: number;
  beamSpeed: number;
  beamIntensity: number;
  caOff: number;
}

const DEFAULT_PANEL: PanelParams = {
  glowIntensity: 0.015,
  beamSpeed: 0.35,
  beamIntensity: 0.6,
  caOff: 0.016,
};

// --- WEBGL SHADER COMPONENT ---
function WebGLShader({ sceneIndex, panelParams }: { sceneIndex: number; panelParams: PanelParams }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.OrthographicCamera | null
    renderer: THREE.WebGLRenderer | null
    mesh: THREE.Mesh | null
    uniforms: Record<string, { value: unknown }> | null
    animationId: number | null
    currentPendulum: number
    sceneIndex: number
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
    currentPendulum: 0,
    sceneIndex: 0,
  })

  useEffect(() => {
    if (sceneRef.current.uniforms) {
      sceneRef.current.uniforms.u_isMobile.value = isMobile ? 1.0 : 0.0;
    }
  }, [isMobile])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const refs = sceneRef.current

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec3 u_beltColor;
      uniform vec3 u_sdColor;
      uniform float u_pendulum;
      uniform float u_waveAmp;
      uniform float u_waveFreq;
      uniform float u_waveSpeed;
      uniform float u_turbulence;
      uniform float u_finalState;
      uniform float u_glowIntensity;
      uniform float u_caOff;
      uniform float u_beamSpeed;
      uniform float u_beamIntensity;
      uniform float u_isMobile;

      void main() {
        vec2 pOriginal = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        vec2 p = pOriginal;
        if (u_isMobile > 0.5) {
          p = vec2(-pOriginal.y, pOriginal.x);
        }
        float taper = mix(1.0, 1.0 + smoothstep(-1.0, 1.5, p.x) * 3.5, u_finalState);
        float noise = fract(sin(dot(p.xy + time, vec2(12.9898, 78.233))) * 43758.5453);
        float artifactOffset = smoothstep(0.95, 1.0, noise) * 0.05 * u_finalState;
        float x = p.x + artifactOffset;
        float tSpeed = time * mix(u_waveSpeed, -3.0, u_finalState);
        float wFreq = mix(u_waveFreq, 6.0, u_finalState);
        float thrash = sin(x * 15.0 - time * 12.0) * sin(x * 25.0 + time * 8.0);
        float turbulenceOffset = thrash * 0.15 * u_turbulence;
        float baseSine = sin(x * wFreq + tSpeed);
        float currentAmp = mix(u_waveAmp, 0.2 * taper, u_finalState);
        float waveBelt = (baseSine * currentAmp + turbulenceOffset) * taper;
        float sdDistortion = sin(x * 15.0 + time * 3.0) * 0.052 * (0.5 + u_turbulence);
        float waveSD = waveBelt + sdDistortion * (1.0 - u_finalState);
        float distBelt = abs(p.y - waveBelt);
        float distSD = abs(p.y - waveSD);
        // Chromatic aberration offsets (controllable via panel)
        float caOff = u_caOff * (1.0 - u_finalState);
        float distSD_r = abs(p.y - (waveSD + caOff));
        float distSD_b = abs(p.y - (waveSD - caOff));

        // Soft wide glow — no hard edge. Primary: beltColor; accent: sdColor via CA channels.
        vec3 combinedColor;
        combinedColor.r = u_beltColor.r * (u_glowIntensity / (distSD_r + 0.004))
                        + u_sdColor.r   * smoothstep(0.15, 0.0, distSD_r) * 0.4;
        combinedColor.g = u_beltColor.g * (u_glowIntensity / (distSD   + 0.004))
                        + u_sdColor.g   * smoothstep(0.15, 0.0, distSD)   * 0.4;
        combinedColor.b = u_beltColor.b * (u_glowIntensity / (distSD_b + 0.004))
                        + u_sdColor.b   * smoothstep(0.15, 0.0, distSD_b) * 0.4;

        // Soft beltAlpha — only used in the finalState rendering path below
        float beltAlpha = exp(-distBelt * 50.0);

        // Outer halo — wide soft glow around the belt line
        float lum = dot(u_beltColor, vec3(0.299, 0.587, 0.114));
        float outerHalo = (0.008 / (distBelt + 0.022)) * (1.0 - u_finalState);
        combinedColor += u_beltColor * outerHalo;

        // === LIGHT BEAMS ===
        // 5 energy pulses that travel left→right along the wave (conduit effect).
        vec3 beamResult = vec3(0.0);
        for (int bi = 0; bi < 5; bi++) {
          float bfi = float(bi);
          float bh1 = fract(sin(bfi * 127.1)  * 43758.5453);
          float bh2 = fract(sin(bfi * 311.7)  * 92364.370);
          float bh3 = fract(sin(bfi * 57.29)  * 15731.930);
          float speed  = u_beamSpeed * (0.5 + bh1 * 1.0);
          float beamX  = fract(time * speed + bh2) * 4.0 - 2.0;
          float bWidth = 0.06 + bh1 * 0.10;
          float envX   = exp(-abs(p.x - beamX) / bWidth);
          float waveAtBeam = sin(beamX * wFreq + tSpeed) * currentAmp;
          float envY   = exp(-abs(p.y - waveAtBeam) * 14.0);
          float beamBright = envX * envY * (0.5 + bh3 * 0.5);
          vec3  beamColor  = mix(u_beltColor, u_sdColor, bh1 * 0.45);
          beamResult += beamColor * beamBright;
        }
        combinedColor += beamResult * u_beamIntensity * (1.0 - u_finalState * 0.9);
        vec3 cWhite = vec3(1.0);
        vec3 cYellow = vec3(1.0, 0.85, 0.1);
        vec3 cTurq = vec3(0.0, 0.9, 1.0);
        float gradX = p.x * 0.4 + 0.5;
        vec3 finalGrad = mix(cWhite, cYellow, smoothstep(0.1, 0.5, gradX));
        finalGrad = mix(finalGrad, cTurq, smoothstep(0.5, 0.9, gradX));
        vec3 finalStateColor = mix(u_beltColor, finalGrad, u_finalState);
        float finalLine = (0.015 * taper) / (distBelt + 0.002);
        vec3 finalStateGlow = finalGrad * finalLine;
        float sparkles = smoothstep(0.97, 1.0, noise) * u_finalState;
        vec3 renderColor = mix(combinedColor, finalStateGlow + finalStateColor * beltAlpha + vec3(sparkles), u_finalState);
        float edgeFade = smoothstep(2.0, 0.0, abs(p.x));
        edgeFade = mix(edgeFade, smoothstep(2.5, -0.5, abs(p.x - 0.5)), u_finalState);
        float pendulumFocus = smoothstep(1.5, 0.0, abs(p.x - u_pendulum * 1.5));
        float glowMask = mix(pendulumFocus + 0.3, 1.0, u_finalState);

        // === PARTICLE SYSTEM ===
        // Grid-based particles that follow the wave and respond to turbulence.
        // Low turbulence: aligned, gentle oscillation. High turbulence: chaotic scatter.
        vec3 particleResult = vec3(0.0);
        float CELL = 0.13;
        for (float di = -1.0; di <= 1.0; di += 1.0) {
          float col = floor(p.x / CELL) + di;
          float h1 = fract(sin(col * 127.1) * 43758.5453);
          float h2 = fract(sin(col * 311.7) * 92364.37);
          float h3 = fract(sin(col * 57.29 + 3.7) * 15731.93);
          // Particle x: anchored in column, slight lateral drift under chaos
          float px = (col + h1 * 0.7 + 0.15) * CELL;
          px += sin(time * 0.5 + h2 * 6.2832) * u_turbulence * 0.06;
          // Wave y at particle x (no thrash — clean base position)
          float waveAtPx = sin(px * wFreq + tSpeed) * currentAmp;
          // Ordered: gentle breathing near the wave
          float orderedOsc = sin(time * 1.8 + h3 * 6.2832) * 0.018;
          // Chaotic: smooth interpolation between random positions (no hard jumps)
          float chaosT = time * 0.55 + h1 * 10.0;
          float chaosA = fract(sin(col * 57.3 + floor(chaosT))       * 43758.5) - 0.5;
          float chaosB = fract(sin(col * 57.3 + floor(chaosT) + 1.0) * 43758.5) - 0.5;
          float chaosOsc = mix(chaosA, chaosB, smoothstep(0.0, 1.0, fract(chaosT))) * 0.75;
          // Final y: lerp between ordered and chaotic based on turbulence
          float py = waveAtPx + mix(orderedOsc, chaosOsc, u_turbulence);
          // Distance, size, brightness
          float dist = length(p - vec2(px, py));
          float sz = mix(0.003, 0.009, h2) * (1.0 + u_turbulence * 0.7);
          float brightness = min(sz * sz / (dist * dist + 0.0007), 1.5);
          // Color: mix between sd and belt colors per particle
          vec3 pColor = mix(u_sdColor, u_beltColor, h3 * 0.45);
          // Ordered particles are subtle; chaotic are more vivid
          float opacity = mix(0.22, 0.88, u_turbulence * h1 + (1.0 - u_turbulence) * 0.15);
          particleResult += pColor * brightness * opacity;
        }
        // Apply spatial masking; suppress on final state gradient scene
        renderColor += particleResult * edgeFade * min(glowMask + 0.15, 1.0) * (1.0 - u_finalState * 0.85);

        renderColor *= edgeFade * glowMask;
        float vignette = 1.0 - length(pOriginal * vec2(0.6, 1.0)) * mix(0.15, 0.25, u_finalState);
        gl_FragColor = vec4(renderColor * vignette, 1.0);
      }
    `

    const initScene = () => {
      refs.scene = new THREE.Scene()
      refs.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      refs.renderer.setClearColor(new THREE.Color(0x010101))
      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

      refs.uniforms = {
        resolution: { value: [window.innerWidth, window.innerHeight] },
        time: { value: 0.0 },
        u_beltColor: { value: SCENES[0].beltColor.clone() },
        u_sdColor: { value: SCENES[0].sdColor.clone() },
        u_pendulum: { value: 0.0 },
        u_waveAmp: { value: SCENES[0].waveAmp },
        u_waveFreq: { value: SCENES[0].waveFreq },
        u_waveSpeed: { value: SCENES[0].waveSpeed },
        u_turbulence: { value: SCENES[0].turbulence },
        u_finalState: { value: 0.0 },
        u_glowIntensity: { value: DEFAULT_PANEL.glowIntensity },
        u_caOff:         { value: DEFAULT_PANEL.caOff },
        u_beamSpeed:     { value: DEFAULT_PANEL.beamSpeed },
        u_beamIntensity: { value: DEFAULT_PANEL.beamIntensity },
        u_isMobile:      { value: window.innerWidth < 768 ? 1.0 : 0.0 },
      }

      const positions = new THREE.BufferAttribute(
        new Float32Array([
          -1, -1, 0, 1, -1, 0, -1, 1, 0,
          1, -1, 0, -1, 1, 0, 1, 1, 0,
        ]),
        3
      )
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', positions)

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
        transparent: true,
      })

      refs.mesh = new THREE.Mesh(geometry, material)
      refs.scene.add(refs.mesh)
      handleResize()
    }

    const animate = () => {
      if (document.hidden) { refs.animationId = requestAnimationFrame(animate); return; }
      if (refs.uniforms) {
        (refs.uniforms.time.value as number) += 0.01

        const currentData = SCENES[refs.sceneIndex] || SCENES[0]
        const lerpFactor = 0.04

        refs.currentPendulum += (currentData.pendulumPosition - refs.currentPendulum) * lerpFactor
        refs.uniforms.u_pendulum.value = refs.currentPendulum;

        (refs.uniforms.u_beltColor.value as THREE.Color).lerp(currentData.beltColor, lerpFactor);
        (refs.uniforms.u_sdColor.value as THREE.Color).lerp(currentData.sdColor, lerpFactor);

        refs.uniforms.u_waveAmp.value = (refs.uniforms.u_waveAmp.value as number) + (currentData.waveAmp - (refs.uniforms.u_waveAmp.value as number)) * lerpFactor
        refs.uniforms.u_waveFreq.value = (refs.uniforms.u_waveFreq.value as number) + (currentData.waveFreq - (refs.uniforms.u_waveFreq.value as number)) * lerpFactor
        refs.uniforms.u_waveSpeed.value = (refs.uniforms.u_waveSpeed.value as number) + (currentData.waveSpeed - (refs.uniforms.u_waveSpeed.value as number)) * lerpFactor
        refs.uniforms.u_turbulence.value = (refs.uniforms.u_turbulence.value as number) + (currentData.turbulence - (refs.uniforms.u_turbulence.value as number)) * lerpFactor
        refs.uniforms.u_finalState.value = (refs.uniforms.u_finalState.value as number) + (currentData.finalState - (refs.uniforms.u_finalState.value as number)) * lerpFactor
      }

      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
      refs.animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      const width = window.innerWidth
      const height = window.innerHeight
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      refs.renderer.setSize(width, height, false)
      // Use physical pixel dimensions so gl_FragCoord and resolution match on high-DPR screens
      refs.uniforms.resolution.value = [canvas.width, canvas.height]
    }

    if (!refs.scene) {
      initScene()
      animate()
      window.addEventListener('resize', handleResize)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      refs.renderer?.dispose()
      refs.scene = null
      refs.renderer = null
      refs.animationId = null
    }
  }, [])

  useEffect(() => {
    sceneRef.current.sceneIndex = sceneIndex
  }, [sceneIndex])

  useEffect(() => {
    const u = sceneRef.current.uniforms;
    if (!u) return;
    u.u_glowIntensity.value = panelParams.glowIntensity;
    u.u_caOff.value         = panelParams.caOff;
    u.u_beamSpeed.value     = panelParams.beamSpeed;
    u.u_beamIntensity.value = panelParams.beamIntensity;
  }, [panelParams])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full block z-0"
    />
  )
}

// --- SHADER CONTROL PANEL ---
function ShaderControlPanel({
  params,
  onChange,
}: {
  params: PanelParams;
  onChange: (p: Partial<PanelParams>) => void;
}) {
  const sliders: { key: keyof PanelParams; label: string; min: number; max: number; step: number }[] = [
    { key: 'glowIntensity', label: 'Glow',              min: 0, max: 0.06, step: 0.001 },
    { key: 'caOff',         label: 'Chrom. Aberration', min: 0, max: 0.05, step: 0.001 },
    { key: 'beamSpeed',     label: 'Beam Speed',        min: 0, max: 2.0,  step: 0.05  },
    { key: 'beamIntensity', label: 'Beam Intensity',    min: 0, max: 2.0,  step: 0.05  },
  ];
  return (
    <div style={{
      position: 'fixed', top: 16, right: 16, zIndex: 9999,
      background: 'rgba(0,0,0,0.82)', padding: '14px 16px', borderRadius: 10,
      color: '#fff', minWidth: 230, backdropFilter: 'blur(10px)',
      fontFamily: 'monospace', fontSize: 10,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 12, letterSpacing: 2 }}>SHADER CONTROLS</div>
      {sliders.map(s => (
        <div key={s.key} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span>{s.label}</span>
            <span style={{ color: '#aaa' }}>{params[s.key].toFixed(3)}</span>
          </div>
          <input
            type="range"
            min={s.min} max={s.max} step={s.step}
            value={params[s.key]}
            onChange={e => onChange({ [s.key]: parseFloat(e.target.value) })}
            style={{ width: '100%', accentColor: '#fff' }}
          />
        </div>
      ))}
      <button
        onClick={() => onChange(DEFAULT_PANEL)}
        style={{
          marginTop: 6, padding: '4px 10px', fontSize: 9, cursor: 'pointer',
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', borderRadius: 4, letterSpacing: 1,
        }}
      >
        RESET
      </button>
    </div>
  );
}

// --- GLOW BUTTON ---
function GlowButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode
  onClick: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500',
        'bg-white/5 text-white/90 border border-white/20 backdrop-blur-sm',
        'hover:bg-white/10 hover:text-white hover:border-white/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-0.5',
        'active:translate-y-0 active:scale-95 cursor-pointer',
        className
      )}
    >
      {children}
    </button>
  )
}

// --- MAIN OVERLAY COMPONENT ---
interface SpiralExperienceProps {
  isOpen: boolean
  onClose: () => void
  onBookTrial: () => void
}

export function SpiralExperience({ isOpen, onClose, onBookTrial }: SpiralExperienceProps) {
  const [currentScene, setCurrentScene] = useState(0)
  const [panelParams, setPanelParams] = useState<PanelParams>(DEFAULT_PANEL)

  // Reset scene when reopened
  useEffect(() => {
    if (isOpen) setCurrentScene(0)
  }, [isOpen])

  // ESC to close
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const handleNext = useCallback(() => {
    if (currentScene < SCENES.length - 1) {
      setCurrentScene(prev => prev + 1)
    } else {
      setCurrentScene(0)
    }
  }, [currentScene])

  const scene = SCENES[currentScene]
  const isFinalStage = scene.id === 'final'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-[#010101] overflow-hidden font-sans text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Playfair Display font */}
          <style dangerouslySetInnerHTML={{ __html: `
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
            .font-editorial { font-family: 'Playfair Display', serif; }
            @keyframes blindReveal {
              0%   { clip-path: inset(0 0 100% 0); transform: translateY(20px); opacity: 0; }
              100% { clip-path: inset(0 0 0 0);    transform: translateY(0);    opacity: 1; }
            }
            .animate-blind { animation: blindReveal 0.9s cubic-bezier(0.77, 0, 0.175, 1) forwards; }
          `}} />

          {/* WebGL Background */}
          <WebGLShader sceneIndex={currentScene} panelParams={panelParams} />

          {/* Shader control panel (dev iteration tool) */}
          <ShaderControlPanel params={panelParams} onChange={p => setPanelParams(prev => ({ ...prev, ...p }))} />

          {/* Pendulum markers */}
          <div
            className={cn(
              'fixed inset-0 pointer-events-none flex justify-between items-center px-8 md:px-24 font-black tracking-[0.5em] text-6xl md:text-9xl z-0 mix-blend-overlay transition-opacity duration-1000',
              isFinalStage ? 'opacity-0' : 'opacity-10'
            )}
          >
            <span className="origin-center -rotate-90 text-white">CHAOS</span>
            <span className="origin-center rotate-90 text-white">ORDER</span>
          </div>

          {/* Close button — top right hairline arrow */}
          <motion.button
            onClick={onClose}
            className="fixed top-6 right-6 z-50 p-3 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/60 hover:text-white hover:border-white/40 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            aria-label="Close experience"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Text content — top */}
          <div className={cn(
            'absolute top-16 md:top-24 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-10 flex flex-col items-center pointer-events-none transition-all duration-700',
            'opacity-100'
          )}>
            <div key={scene.id} className="animate-blind flex flex-col items-center w-full relative">
              {/* Soft dark underlay for mobile readability when the wave passes behind */}
              <div className="absolute inset-0 bg-black/50 blur-[30px] rounded-full -z-10 md:hidden scale-[1.2]"></div>

              <div
                className={cn(
                  'w-16 h-[2px] mb-6 transition-colors duration-1000 shadow-[0_0_15px_currentColor]',
                  isFinalStage ? 'opacity-0' : 'opacity-100'
                )}
                style={{ backgroundColor: scene.sdColor.getStyle(), color: scene.sdColor.getStyle() }}
              />

              {scene.belt && (
                <div className="uppercase tracking-[0.3em] text-[10px] font-bold text-white/50 mb-3 text-center drop-shadow-md">
                  {scene.belt}
                </div>
              )}

              <h1 className="font-editorial mb-6 text-center text-4xl font-bold tracking-wide md:text-5xl transition-all leading-tight text-white/90 drop-shadow-[0_4px_25px_rgba(0,0,0,1)]">
                {scene.title}
              </h1>

              {scene.text && (
                <p className="text-white/80 text-center text-sm md:text-base font-medium leading-relaxed max-w-xl mx-auto drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
                  {scene.text}
                </p>
              )}

              {/* Final stage CTA */}
              {isFinalStage && (
                <div className="mt-10 pointer-events-auto flex flex-col items-center gap-4">
                  <GlowButton
                    onClick={onBookTrial}
                    className="!bg-white !text-black border-transparent hover:!bg-gray-200 hover:!text-black shadow-[0_0_30px_rgba(255,255,255,0.4)] px-12 py-4"
                  >
                    Book Your Free Trial
                  </GlowButton>
                  <button
                    onClick={onClose}
                    className="text-white/40 text-xs uppercase tracking-[0.2em] hover:text-white/70 transition-colors cursor-pointer"
                  >
                    Return to site
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom controls — hidden on final stage */}
          <div className={cn(
            'absolute bottom-8 md:bottom-12 left-0 w-full px-8 md:px-16 z-20 flex flex-col-reverse md:flex-row items-center justify-between gap-8 transition-all duration-1000',
            isFinalStage ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}>
            {/* Progress indicators */}
            <div className="flex gap-2">
              {SCENES.map((s, i) => (
                <div
                  key={s.id}
                  className={cn(
                    'h-[2px] rounded-full transition-all duration-1000 ease-out',
                    i <= currentScene ? 'w-8 md:w-12 bg-white' : 'w-4 bg-white/20',
                    s.id === 'final' && 'hidden'
                  )}
                />
              ))}
            </div>

            <GlowButton onClick={handleNext}>
              Next Stage
            </GlowButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
