import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/skillbridge-logo";



export function LogoEmblem({ size = 42, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
      aria-label="SkillBridge Logo Emblem"
    >
      <defs>
        <linearGradient id="bridgeGradient" x1="20" y1="50" x2="80" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0D3B2E" />
          <stop offset="45%" stopColor="#145A46" />
          <stop offset="65%" stopColor="#8A6B30" />
          <stop offset="100%" stopColor="#C78C3A" />
        </linearGradient>
      </defs>

      {/* Left Person Head (Deep Green) */}
      <circle cx="38" cy="22" r="9" fill="#0D3B2E" />

      {/* Right Person Head (Amber Gold) */}
      <circle cx="62" cy="22" r="9" fill="#C78C3A" />

      {/* Combined Bridge Body */}
      <path
        d="M26 62 C26 36 40 32 50 32 C60 32 74 36 74 62 L63 62 C63 46 54 44 50 44 C46 44 37 46 37 62 Z"
        fill="url(#bridgeGradient)"
      />

      {/* Left Shoulder Green Fill */}
      <path
        d="M26 62 C26 36 38 32 50 32 L47 38 C39 40 34 46 34 62 Z"
        fill="#0D3B2E"
      />

      {/* Right Shoulder Gold Fill */}
      <path
        d="M74 62 C74 36 62 32 50 32 L53 38 C61 40 66 46 66 62 Z"
        fill="#C78C3A"
      />

      {/* Inner Bridge Arch Cutout */}
      <path
        d="M34 62 C34 47 42 41 50 41 C58 41 66 47 66 62 Z"
        fill="#F7F5EF"
      />

      {/* Elegant Arch Guideline */}
      <path
        d="M26 58 Q 50 34 74 58"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function Logo({
  variant = 'full', // 'full' | 'inline' | 'emblem' | 'image'
  size = 'md',      // 'sm' | 'md' | 'lg' | 'xl'
  showTagline = false,
  to,
  className = '',
}) {
  const sizeMap = {
    sm: { emblem: 32, fontSize: '1.15rem', taglineSize: '0.62rem' },
    md: { emblem: 40, fontSize: '1.45rem', taglineSize: '0.72rem' },
    lg: { emblem: 52, fontSize: '1.85rem', taglineSize: '0.82rem' },
    xl: { emblem: 68, fontSize: '2.4rem', taglineSize: '0.92rem' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div
      className={`skillbridge-logo-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '0.55rem' : '0.75rem',
        textDecoration: 'none',
        lineHeight: 1,
      }}
    >
      {/* Option to use the actual uploaded high-res image logo */}
      {variant === 'image' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img
            src={logo}
            alt="SkillBridge – Freelancer Work Verification Platform"
            style={{
              height: size === 'sm' ? '36px' : size === 'lg' ? '68px' : size === 'xl' ? '92px' : '48px',
              width: 'auto',
              borderRadius: '8px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      ) : (
        <>
          <div
            style={{
              width: currentSize.emblem,
              height: currentSize.emblem,
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(13, 59, 46, 0.08)',
              border: '1px solid #E5DFD2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img
              src={logo}
              alt="SkillBridge Logo Emblem"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scale(1.22) translateY(2%)',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--font-display, inherit)',
                fontSize: currentSize.fontSize,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
              }}
            >
              <span style={{ color: '#0D3B2E' }}>Skill</span>
              <span style={{ color: '#C78C3A' }}>Bridge</span>
            </div>

            {showTagline && (
              <div
                style={{
                  fontSize: currentSize.taglineSize,
                  fontWeight: 600,
                  color: '#0D3B2E',
                  opacity: 0.85,
                  letterSpacing: '0.03em',
                  marginTop: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ color: '#C78C3A', fontWeight: 700 }}>—</span>
                <span>Freelancer & Client Work Verification Platform</span>
                <span style={{ color: '#C78C3A', fontWeight: 700 }}>—</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  return content;
}
