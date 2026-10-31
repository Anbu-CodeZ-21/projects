import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';
  const isInfo = type === 'info';

  const Icon = isSuccess ? CheckCircle2 : isError ? AlertCircle : Info;
  const iconColor = isSuccess ? 'var(--color-emerald)' : isError ? 'var(--color-terracotta)' : 'var(--color-primary)';

  return (
    <div className={`toast toast-${type}`}>
      <Icon size={20} color={iconColor} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1, fontSize: '0.92rem', color: 'var(--color-charcoal)' }}>
        {message}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{ color: 'var(--color-muted-text)', padding: '0.2rem' }}
          aria-label="Close notification"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
