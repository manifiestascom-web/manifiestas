"use client";

import React from 'react';
import Link from 'next/link';
import { IconSparkles } from '@tabler/icons-react';

interface UsageBadgeProps {
  used: number;
  limit: number;
  label?: string;
  isPro: boolean;
}

export default function UsageBadge({ used, limit, label = 'hoy', isPro }: UsageBadgeProps) {
  if (isPro) return null;

  const remaining = Math.max(limit - used, 0);
  const percentage = limit > 0 ? (used / limit) * 100 : 0;

  // Color coding: green (0-50%), amber (51-99%), red (100%)
  const colorClass = percentage >= 100
    ? 'bg-red-500/10 border-red-500/25 text-red-500'
    : percentage > 50
      ? 'bg-amber-500/10 border-amber-500/25 text-amber-500'
      : 'bg-green-500/10 border-green-500/25 text-green-500';

  const isExhausted = remaining <= 0;

  if (isExhausted) {
    return (
      <Link
        href="/paywall"
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent-gold/15 border border-accent-gold/30 text-accent-gold hover:bg-accent-gold/25 transition-all"
      >
        <IconSparkles size={10} className="animate-pulse" /> Obtener Pro
      </Link>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
      {remaining}/{limit} {label}
    </span>
  );
}
