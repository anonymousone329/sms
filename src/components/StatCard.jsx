import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  badgeText,
}) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
      badge: 'bg-blue-100 text-blue-700',
      ring: 'group-hover:border-blue-300',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
      badge: 'bg-emerald-100 text-emerald-700',
      ring: 'group-hover:border-emerald-300',
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600',
      border: 'border-rose-100',
      badge: 'bg-rose-100 text-rose-700',
      ring: 'group-hover:border-rose-300',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600',
      border: 'border-purple-100',
      badge: 'bg-purple-100 text-purple-700',
      ring: 'group-hover:border-purple-300',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
      badge: 'bg-amber-100 text-amber-700',
      ring: 'group-hover:border-amber-300',
    },
  }[color] || {
    bg: 'bg-slate-50 text-slate-600',
    border: 'border-slate-100',
    badge: 'bg-slate-100 text-slate-700',
    ring: 'group-hover:border-slate-300',
  };

  return (
    <div
      className={`group bg-white p-6 rounded-2xl border ${colorMap.border} ${colorMap.ring} shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`p-3 rounded-xl ${colorMap.bg}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
        {badgeText && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorMap.badge}`}>
            {badgeText}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p>
      )}
    </div>
  );
}
