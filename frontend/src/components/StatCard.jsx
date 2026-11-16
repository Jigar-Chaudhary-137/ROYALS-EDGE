import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'pink', trend }) {
  const colorMap = {
    pink: {
      bg: 'bg-pink-50 text-[#E83E8C]',
      text: 'text-[#E83E8C]',
      border: 'border-pink-100'
    },
    blue: {
      bg: 'bg-blue-50 text-[#174EA6]',
      text: 'text-[#174EA6]',
      border: 'border-blue-100'
    },
    navy: {
      bg: 'bg-slate-100 text-[#14213D]',
      text: 'text-[#14213D]',
      border: 'border-slate-200'
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      text: 'text-emerald-700',
      border: 'border-emerald-100'
    },
    gold: {
      bg: 'bg-amber-50 text-amber-600',
      text: 'text-amber-700',
      border: 'border-amber-100'
    }
  };

  const scheme = colorMap[color] || colorMap.pink;

  return (
    <div className="rr-card p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${scheme.bg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-extrabold text-[#14213D] tracking-tight">{value}</div>
        {subtitle && (
          <div className="text-xs text-slate-500 font-medium mt-0.5 flex items-center justify-between">
            <span>{subtitle}</span>
            {trend && <span className="font-semibold text-[#E83E8C]">{trend}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

