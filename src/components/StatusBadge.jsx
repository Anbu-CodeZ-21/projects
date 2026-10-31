import React from 'react';
import { Clock, CheckCircle2, AlertCircle, FileText, Send, CheckSquare } from 'lucide-react';

export default function StatusBadge({ status, className = '' }) {
  const normalized = (status || 'Open').toLowerCase();

  let badgeClass = 'badge-open';
  let Icon = Clock;
  let label = status;

  if (normalized.includes('proposal submitted') || normalized === 'proposal submitted') {
    badgeClass = 'badge-proposal-submitted';
    Icon = Send;
    label = 'Proposal Submitted';
  } else if (normalized.includes('in progress') || normalized === 'in progress') {
    badgeClass = 'badge-in-progress';
    Icon = Clock;
    label = 'In Progress';
  } else if (normalized.includes('submitted for review') || normalized === 'submitted for review') {
    badgeClass = 'badge-submitted-for-review';
    Icon = FileText;
    label = 'Submitted for Review';
  } else if (normalized.includes('revision requested') || normalized === 'revision requested') {
    badgeClass = 'badge-revision-requested';
    Icon = AlertCircle;
    label = 'Revision Requested';
  } else if (normalized.includes('completed') || normalized === 'completed') {
    badgeClass = 'badge-completed';
    Icon = CheckCircle2;
    label = 'Completed';
  } else {
    badgeClass = 'badge-open';
    Icon = CheckSquare;
    label = 'Open';
  }

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      <Icon size={13} strokeWidth={2.5} />
      <span>{label}</span>
    </span>
  );
}
