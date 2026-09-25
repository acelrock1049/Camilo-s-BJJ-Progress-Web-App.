// Form styles shared by the booking modals (trial and private coaching).
// Kept out of the component files so React Fast Refresh keeps working there.
import type { CSSProperties } from 'react';

export const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: 11, fontWeight: 700,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  color: '#555', marginBottom: 6,
};

export const inputStyle: CSSProperties = {
  width: '100%', padding: '12px 14px',
  borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.1)',
  background: 'rgba(255,255,255,0.8)',
  fontSize: 14, color: '#111',
  outline: 'none', transition: 'border-color 0.2s',
  boxSizing: 'border-box',
  appearance: 'none',
  WebkitAppearance: 'none',
};
