/**
 * PrivateRequestModal — request a 1-on-1 private session (BJJ or MMA).
 *
 * Flow: Form → Validate → ingest-private-request edge function (≤2.5s) → WhatsApp
 *
 * Same shape as TrialBookingModal on purpose: the edge function stores the
 * request and emails the coach; WhatsApp is where the time actually gets agreed.
 * Scheduling is by request, so nothing here books a slot.
 */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WA_PHONE, WhatsAppIcon, Spinner } from './TrialBookingModal';
import { labelStyle, inputStyle } from './bookingStyles';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const REQUEST_TIMEOUT_MS = 2500;

const ACCENT = '#f59e0b';
const ACCENT_DARK = '#d97706';

type Discipline = 'BJJ' | 'MMA' | 'Not sure';
type Location = 'academy' | 'home';

interface PrivateRequest {
  name: string;
  email: string;
  discipline: Discipline;
  location: Location;
  suburb: string;
  participants: string;
  preferred_times: string;
  notes: string;
}

// Fire-and-forget with a timeout: the WhatsApp redirect must never wait on
// the network. keepalive lets the request finish after the page navigates away.
async function saveRequest(r: PrivateRequest): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const params = new URLSearchParams(window.location.search);
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/ingest-private-request`, {
      method: 'POST',
      signal: controller.signal,
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        ...r,
        origen_url: window.location.href,
        utm_source: params.get('utm_source') ?? '',
        utm_medium: params.get('utm_medium') ?? '',
        utm_campaign: params.get('utm_campaign') ?? '',
      }),
    });
  } catch {
    // Timeout or network error — continue to WhatsApp anyway
  } finally {
    clearTimeout(timer);
  }
}

function openWhatsApp(r: PrivateRequest): void {
  const where = r.location === 'home' ? `at my home in ${r.suburb}` : 'at the academy';
  const discipline = r.discipline === 'Not sure' ? 'BJJ or MMA (not sure yet)' : r.discipline;
  const lines = [
    `Hi Camilo, I'm ${r.name} (${r.email}).`,
    `I'd like a private 1-on-1 ${discipline} session ${where}, for: ${r.participants}.`,
    r.preferred_times && `Preferred times: ${r.preferred_times}.`,
    r.notes && `Notes: ${r.notes}`,
  ].filter(Boolean);
  window.location.href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export interface PrivateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivateRequestModal({ isOpen, onClose }: PrivateRequestModalProps) {
  // The dialog mounts fresh on every open, so its form state starts empty
  // without resetting it from an effect.
  return (
    <AnimatePresence>
      {isOpen && <PrivateRequestDialog key="private-request" onClose={onClose} />}
    </AnimatePresence>
  );
}

function PrivateRequestDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [discipline, setDiscipline] = useState<Discipline | ''>('');
  const [location, setLocation] = useState<Location | ''>('');
  const [suburb, setSuburb] = useState('');
  const [participants, setParticipants] = useState('');
  const [preferredTimes, setPreferredTimes] = useState('');
  const [notes, setNotes] = useState('');
  const [botField, setBotField] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => firstInputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (botField) return; // honeypot

    if (!name.trim() || !email.trim() || !discipline || !location || !participants) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (location === 'home' && !suburb.trim()) {
      setError('Please tell us your suburb so we can plan the trip.');
      return;
    }

    setError('');
    setLoading(true);

    const request: PrivateRequest = {
      name: name.trim(),
      email: email.trim(),
      discipline,
      location,
      suburb: location === 'home' ? suburb.trim() : '',
      participants,
      preferred_times: preferredTimes.trim(),
      notes: notes.trim(),
    };

    await saveRequest(request);
    openWhatsApp(request);
  };

  return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/65 backdrop-blur-xl cursor-pointer"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="relative w-full max-w-md z-10"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            <div style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              borderRadius: 24,
              border: '1px solid rgba(255,255,255,0.95)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
              overflow: 'hidden',
              // The form is taller than the trial one; keep it usable on small phones.
              maxHeight: 'calc(100vh - 32px)',
              overflowY: 'auto',
            }}>
              <div style={{ height: 4, background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_DARK})` }} />

              <div style={{ padding: '32px 28px 28px' }}>
                <div style={{ marginBottom: 24 }}>
                  <div style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.2em',
                    textTransform: 'uppercase', color: ACCENT_DARK, marginBottom: 6,
                  }}>
                    Private Coaching · 1-on-1
                  </div>
                  <h2 style={{
                    fontSize: 24, fontWeight: 900, color: '#111',
                    letterSpacing: -0.5, lineHeight: 1.1, margin: 0,
                  }}>
                    Your session. Your pace.
                  </h2>
                  <p style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
                    Tell us what you're after. Camilo will confirm the time with you on WhatsApp.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div style={{ position: 'absolute', left: '-9999px', top: 0 }} aria-hidden="true">
                    <input type="text" name="bot_field" tabIndex={-1} autoComplete="off"
                      value={botField} onChange={e => setBotField(e.target.value)} />
                  </div>

                  <Field label="Your name">
                    <input ref={firstInputRef} type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="e.g. Alex" style={inputStyle} disabled={loading} required />
                  </Field>

                  <Field label="Email address">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. alex@email.com" style={inputStyle} disabled={loading} required />
                  </Field>

                  <Field label="Discipline">
                    <Choice
                      value={discipline}
                      onChange={v => setDiscipline(v as Discipline)}
                      options={[['BJJ', 'BJJ'], ['MMA', 'MMA'], ['Not sure', 'Not sure']]}
                      disabled={loading}
                    />
                  </Field>

                  <Field label="Where">
                    <Choice
                      value={location}
                      onChange={v => { setLocation(v as Location); setError(''); }}
                      options={[['academy', 'At the academy'], ['home', 'At my home']]}
                      disabled={loading}
                    />
                  </Field>

                  {location === 'home' && (
                    <Field label="Your suburb">
                      <input type="text" value={suburb} onChange={e => setSuburb(e.target.value)}
                        placeholder="e.g. Brighton" style={inputStyle} disabled={loading} required />
                    </Field>
                  )}

                  <Field label="Who's training">
                    <select value={participants} onChange={e => setParticipants(e.target.value)}
                      style={{ ...inputStyle, cursor: 'pointer' }} disabled={loading} required>
                      <option value="">Select…</option>
                      <option value="Just me">Just me</option>
                      <option value="2 people">2 people</option>
                      <option value="3 or more">3 or more</option>
                      <option value="My child / children">My child / children</option>
                    </select>
                  </Field>

                  <Field label="Preferred days & times" optional>
                    <input type="text" value={preferredTimes} onChange={e => setPreferredTimes(e.target.value)}
                      placeholder="e.g. Weekday mornings, Sat after 10am" style={inputStyle} disabled={loading} />
                  </Field>

                  <Field label="Anything else?" optional last>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder="Ages, experience, goals…" rows={3}
                      style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} disabled={loading} />
                  </Field>

                  {error && (
                    <p style={{ fontSize: 12, color: '#dc2626', marginBottom: 12, fontWeight: 600 }}>{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%', padding: '15px 20px',
                      borderRadius: 14, border: 'none',
                      background: loading ? 'rgba(0,0,0,0.12)' : `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
                      color: loading ? '#888' : '#fff',
                      fontSize: 14, fontWeight: 900,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      minHeight: 52,
                    }}
                  >
                    {loading ? (<><Spinner />Connecting…</>) : (<><WhatsAppIcon />Request my session</>)}
                  </button>

                  <p style={{ fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 12, lineHeight: 1.4 }}>
                    Academy sessions from $45/hour. Home sessions: price on request.
                    Times are agreed with you directly.
                  </p>
                </form>
              </div>
            </div>

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
              }}
              aria-label="Close"
            >
              ×
            </button>
          </motion.div>
        </div>
  );
}

function Field({ label, optional, last, children }: {
  label: string; optional?: boolean; last?: boolean; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: last ? 20 : 14 }}>
      <label style={labelStyle}>
        {label}
        {optional && <span style={{ color: '#aaa', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}> (optional)</span>}
      </label>
      {children}
    </div>
  );
}

/** Segmented buttons: faster than a dropdown for 2–3 options, and visible at a glance. */
function Choice({ value, onChange, options, disabled }: {
  value: string; onChange: (v: string) => void; options: [string, string][]; disabled?: boolean;
}) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {options.map(([v, label]) => {
        const active = value === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            disabled={disabled}
            aria-pressed={active}
            style={{
              flex: 1, padding: '11px 8px', borderRadius: 12,
              border: `1.5px solid ${active ? ACCENT_DARK : 'rgba(0,0,0,0.1)'}`,
              background: active ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.8)',
              color: active ? '#92400e' : '#444',
              fontSize: 13, fontWeight: active ? 800 : 600,
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
