/**
 * Currency utilities for SkillBridge
 * Formats all monetary values using Indian Rupees (INR) with the standard Indian numbering format.
 */

export const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/**
 * Format a number or numeric string to INR currency (e.g. ₹15,000)
 * @param {number|string} amount
 * @returns {string}
 */
export function formatINR(amount) {
  const numeric = typeof amount === 'number' ? amount : Number(amount) || 0;
  return inrFormatter.format(numeric);
}

/**
 * Compact Indian currency format (e.g., ₹2.5L, ₹50K) for badges or summary stats
 * @param {number|string} amount
 * @returns {string}
 */
export function formatINRCompact(amount) {
  const numeric = typeof amount === 'number' ? amount : Number(amount) || 0;
  if (numeric >= 10000000) {
    return `₹${(numeric / 10000000).toFixed(1).replace(/\.0$/, '')} Cr`;
  }
  if (numeric >= 100000) {
    return `₹${(numeric / 100000).toFixed(1).replace(/\.0$/, '')} L`;
  }
  if (numeric >= 1000) {
    return `₹${(numeric / 1000).toFixed(1).replace(/\.0$/, '')} K`;
  }
  return formatINR(numeric);
}
