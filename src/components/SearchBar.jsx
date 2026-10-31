import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search by keyword, skill, or title...',
  categories = [],
  selectedCategory = 'All Categories',
  onCategoryChange,
  showCategorySelect = true,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        background: 'var(--color-white)',
        padding: '0.65rem 0.85rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        width: '100%',
      }}
    >
      {/* Search Input Box */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: '220px' }}>
        <Search size={19} color="var(--color-emerald)" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            border: 'none',
            outline: 'none',
            width: '100%',
            fontSize: '0.96rem',
            color: 'var(--color-charcoal)',
            background: 'transparent',
          }}
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            style={{ color: 'var(--color-muted-text)', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category Dropdown */}
      {showCategorySelect && categories.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid var(--color-border)', paddingLeft: '0.75rem' }}>
          <Filter size={16} color="var(--color-muted-text)" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              background: 'transparent',
              cursor: 'pointer',
              paddingRight: '0.5rem',
            }}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
