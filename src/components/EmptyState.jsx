import React from 'react';
import { Link } from 'react-router-dom';
import { FolderSearch, PlusCircle, RotateCcw } from 'lucide-react';

export default function EmptyState({
  icon: Icon = FolderSearch,
  title = 'No items found',
  description = 'There are no items matching your criteria right now.',
  actionText,
  actionLink,
  onAction,
  resetText,
  onReset,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        background: 'var(--color-white)',
        border: '1px dashed var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        margin: '1.5rem 0',
      }}
    >
      <div
        style={{
          width: '4.5rem',
          height: '4.5rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-cream)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-emerald)',
          marginBottom: '1.25rem',
        }}
      >
        <Icon size={34} strokeWidth={1.8} />
      </div>

      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
        {title}
      </h3>

      <p style={{ fontSize: '0.95rem', color: 'var(--color-muted-text)', maxWidth: '440px', marginBottom: '1.5rem' }}>
        {description}
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {actionLink && actionText && (
          <Link to={actionLink} className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
            <PlusCircle size={15} />
            <span>{actionText}</span>
          </Link>
        )}

        {onAction && actionText && (
          <button type="button" onClick={onAction} className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
            <PlusCircle size={15} />
            <span>{actionText}</span>
          </button>
        )}

        {onReset && (
          <button type="button" onClick={onReset} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
            <RotateCcw size={14} />
            <span>{resetText || 'Clear Filters'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
