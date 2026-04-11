/**
 * TrialBookingModal — Smart Lead Capture Filter
 *
 * Flow: Form → Validate → Save to Supabase (≤2.5s) → Redirect to WhatsApp
 *
 * Supabase SQL to run once in your project:
 * ─────────────────────────────────────────
 * create table leads (
 *   id uuid default gen_random_uuid() primary key,
 *   nombre text not null,
 *   nivel_experiencia text not null,
 *   objetivo_interes text not null,
 *   origen_url text,
 *   utm_source text,
 *   utm_medium text,
 *   utm_campaign text,
 *   created_at timestamptz default now()
 * );
 *
 * alter table leads enable row level security;
 *
 * create policy "Allow anon insert" on leads
 *   for insert to anon
 *   with check (true);
 * ─────────────────────────────────────────
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Config ───────────────────────────────────────────────────────────────────

const WA_PHONE = '61489038711';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const WEBHOOK_TIMEOUT_MS = 2500;

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeadData {
  nombre: string;
  email: string;
  nivel_experiencia: string;
  objetivo_interes: string;
  origen_url: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  source: string;
}

// ─── Supabase insert (fire-and-forget with timeout) ──────────────────────────

async function guardarLead(datos: LeadData): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(datos),
    });
  } catch {
    // Timeout or network error — continue to WhatsApp anyway
  } finally {
    clearTimeout(timer);
  }
}

// ─── WhatsApp redirect ────────────────────────────────────────────────────────

function redirigirWhatsApp(datos: LeadData): void {
  const message = `Hi, my name is ${datos.nombre} (${datos.email}). I'm a ${datos.nivel_experiencia} and I'm interested in ${datos.objetivo_interes}. I'd like to book a free trial class.`;
  const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
  window.location.href = url;
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface TrialBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrialBookingModal({ isOpen, onClose }: TrialBookingModalProps) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [nivel, setNivel] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [botField, setBotField] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 120);
      setNombre('');
      setEmail('');
      setNivel('');
      setObjetivo('');
      setBotField('');
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot — silent abort
    if (botField) return;

    // Validation
    if (!nombre.trim() || !email.trim() || !nivel || !objetivo) {
      setError('Please fill in all fields.');
      return;
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setLoading(true);

    // Capture UTM params
    const params = new URLSearchParams(window.location.search);
    const datos: LeadData = {
      nombre: nombre.trim(),
      email: email.trim(),
      nivel_experiencia: nivel,
      objetivo_interes: objetivo,
      origen_url: window.location.href,
      utm_source: params.get('utm_source') ?? '',
      utm_medium: params.get('utm_medium') ?? '',
      utm_campaign: params.get('utm_campaign') ?? '',
      source: 'popup',
    };

    // Save to Supabase (max 2.5s), then redirect regardless
    await guardarLead(datos);
    redirigirWhatsApp(datos);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/65 backdrop-blur-xl cursor-pointer"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="relative w-full max-w-md z-10"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            {/* Card */}
            <div style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              borderRadius: 24,
              border: '1px solid rgba(255,255,255,0.95)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
              overflow: 'hidden',
            }}>
              {/* Top accent bar */}
              <div style={{
                height: 4,
                background: 'linear-gradient(90deg, #f97316, #ea580c)',
              }} />

              <div style={{ padding: '32px 28px 28px' }}>
                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.2em',
                    textTransform: 'uppercase', color: '#f97316', marginBottom: 6,
                  }}>
                    Free Trial Class
                  </div>
                  <h2 style={{
                    fontSize: 24, fontWeight: 900, color: '#111',
                    letterSpacing: -0.5, lineHeight: 1.1, margin: 0,
                  }}>
                    Let's get you on the mats.
                  </h2>
                  <p style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
                    Takes 20 seconds. Connects you directly to Camilo.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                  {/* Honeypot — hidden from humans */}
                  <div style={{ position: 'absolute', left: '-9999px', top: 0 }} aria-hidden="true">
                    <input
                      type="text"
                      name="bot_field"
                      tabIndex={-1}
                      autoComplete="off"
                      value={botField}
                      onChange={e => setBotField(e.target.value)}
                    />
                  </div>

                  {/* Name */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Your name</label>
                    <input
                      ref={firstInputRef}
                      type="text"
                      value={nombre}
                      onChange={e => setNombre(e.target.value)}
                      placeholder="e.g. Alex"
                      style={inputStyle}
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Email address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. alex@email.com"
                      style={inputStyle}
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Experience level */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Experience level</label>
                    <select
                      value={nivel}
                      onChange={e => setNivel(e.target.value)}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      disabled={loading}
                      required
                    >
                      <option value="">Select your level…</option>
                      <option value="Complete Beginner">Complete Beginner</option>
                      <option value="Some Experience">Some Experience</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Interest */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>I'm interested in…</label>
                    <select
                      value={objetivo}
                      onChange={e => setObjetivo(e.target.value)}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      disabled={loading}
                      required
                    >
                      <option value="">Select your goal…</option>
                      <option value="Adult BJJ">Adult BJJ</option>
                      <option value="Kids BJJ">Kids BJJ</option>
                      <option value="General Fitness">General Fitness</option>
                      <option value="Self-Defence">Self-Defence</option>
                      <option value="Competition">Competition</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Error */}
                  {error && (
                    <p style={{
                      fontSize: 12, color: '#dc2626', marginBottom: 12,
                      fontWeight: 600,
                    }}>
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%', padding: '15px 20px',
                      borderRadius: 14, border: 'none',
                      background: loading
                        ? 'rgba(0,0,0,0.12)'
                        : 'linear-gradient(135deg, #f97316, #ea580c)',
                      color: loading ? '#888' : '#fff',
                      fontSize: 14, fontWeight: 900,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      minHeight: 52,
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner />
                        Connecting…
                      </>
                    ) : (
                      <>
                        <WhatsAppIcon />
                        Start Your Free Trial
                      </>
                    )}
                  </button>

                  {/* Fine print */}
                  <p style={{
                    fontSize: 11, color: '#bbb', textAlign: 'center',
                    marginTop: 12, lineHeight: 1.4,
                  }}>
                    You'll be connected to Camilo directly on WhatsApp.
                    No auto-booking, no spam.
                  </p>
                </form>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(0,0,0,0.08)',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: '#888', zIndex: 1,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'white')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.85)')}
              aria-label="Close"
            >
              ×
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11, fontWeight: 700,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  color: '#555', marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.1)',
  background: 'rgba(255,255,255,0.8)',
  fontSize: 14, color: '#111',
  outline: 'none', transition: 'border-color 0.2s',
  boxSizing: 'border-box',
  appearance: 'none',
  WebkitAppearance: 'none',
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}
