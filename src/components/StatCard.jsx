import React from 'react';

export default function StatCard({ title, value, icon: Icon, theme = 'emerald', subtitle }) {
  const iconThemeClass = `stat-icon-${theme}`;

  return (
    <div className="stat-card">
      <div className="stat-card-info">
        <h4>{title}</h4>
        <div className="stat-card-value">{value}</div>
        {subtitle && (
          <div style={{ fontSize: '0.82rem', color: 'var(--color-muted-text)', marginTop: '0.35rem' }}>
            {subtitle}
          </div>
        )}
      </div>
      {Icon && (
        <div className={`stat-card-icon ${iconThemeClass}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}
