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

// --- WEBGL SHADER COMPONENT ---
function WebGLShader({ sceneIndex }: { sceneIndex: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
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
        float sdDistortion = sin(x * 15.0 + time * 3.0) * 0.025 * (0.5 + u_turbulence);
        float waveSD = waveBelt + sdDistortion * (1.0 - u_finalState);
        float distBelt = abs(p.y - waveBelt);
        float distSD = abs(p.y - waveSD);
        float sdThick = mix(0.018, 0.0, u_finalState);
        vec3 sdGlow = u_sdColor * (sdThick / (distSD + 0.005)) * 0.7;
        sdGlow += u_sdColor * smoothstep(0.08, 0.0, distSD) * 0.4;
        float beltThick = mix(0.006, 0.02, u_finalState);
        float beltAlpha = smoothstep(beltThick + 0.003, beltThick - 0.001, distBelt);
        vec3 combinedColor = mix(sdGlow, u_beltColor, beltAlpha * (1.0 - u_finalState));
        float lum = dot(u_beltColor, vec3(0.299, 0.587, 0.114));
        combinedColor += u_beltColor * (0.002 / (distBelt + 0.001)) * lum * (1.0 - u_finalState);
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
        renderColor *= edgeFade * glowMask;
        float vignette = 1.0 - length(p * vec2(0.6, 1.0)) * mix(0.15, 0.25, u_finalState);
        gl_FragColor = vec4(renderColor * vignette, 1.0);
      }
    `

    const initScene = () => {
      refs.scene = new THREE.Scene()
      refs.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5))
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
      const width = window.visualViewport?.width ?? window.innerWidth
      const height = window.visualViewport?.height ?? window.innerHeight
      // Set canvas CSS size explicitly to match WebGL resolution
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      refs.renderer.setSize(width, height, false)
      refs.uniforms.resolution.value = [width, height]
    }

    if (!refs.scene) {
      initScene()
      animate()
      window.addEventListener('resize', handleResize)
      window.visualViewport?.addEventListener('resize', handleResize)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      window.visualViewport?.removeEventListener('resize', handleResize)
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

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 block z-0"
      style={{ width: '100%', height: '100dvh' }}
    />
  )
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
          className="fixed inset-x-0 top-0 z-[9999] bg-[#010101] overflow-hidden font-sans text-white"
          style={{ height: '100dvh' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            .font-editorial { font-family: 'Playfair Display', serif; }
            @keyframes blindReveal {
              0%   { clip-path: inset(0 0 100% 0); transform: translateY(20px); opacity: 0; }
              100% { clip-path: inset(0 0 0 0);    transform: translateY(0);    opacity: 1; }
            }
            .animate-blind { animation: blindReveal 0.9s cubic-bezier(0.77, 0, 0.175, 1) forwards; }
          `}} />

          {/* WebGL Background */}
          <WebGLShader sceneIndex={currentScene} />

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
            <div key={scene.id} className="animate-blind flex flex-col items-center w-full">
              <div
                className={cn(
                  'w-16 h-[2px] mb-6 transition-colors duration-1000 shadow-[0_0_15px_currentColor]',
                  isFinalStage ? 'opacity-0' : 'opacity-100'
                )}
                style={{ backgroundColor: scene.sdColor.getStyle(), color: scene.sdColor.getStyle() }}
              />

              {scene.belt && (
                <div className="uppercase tracking-[0.3em] text-[10px] font-bold text-white/50 mb-3 text-center">
                  {scene.belt}
                </div>
              )}

              <h1 className="font-editorial mb-6 text-center text-4xl font-bold tracking-wide md:text-5xl transition-all leading-tight text-white/90">
                {scene.title}
              </h1>

              {scene.text && (
                <p className="text-white/60 text-center text-sm md:text-base font-light leading-relaxed max-w-xl mx-auto">
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
