import React from 'react';

interface MetricInputProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number' | 'select' | 'textarea';
  options?: string[];
  suffix?: string;
  description?: string;
  min?: number;
  max?: number;
  rows?: number;
}

export const MetricInput: React.FC<MetricInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  options = [],
  suffix,
  description,
  min,
  max,
  rows = 3
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {type === 'select' ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="block w-full rounded-md border-slate-300 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            value={value}
            rows={rows}
            onChange={(e) => onChange(e.target.value)}
            className="block w-full rounded-md border-0 py-2.5 pl-3 pr-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
        ) : (
          <input
            type={type}
            value={value}
            min={min}
            max={max}
            onChange={(e) => {
              const val = type === 'number' ? parseFloat(e.target.value) : e.target.value;
              onChange(val);
            }}
            className="block w-full rounded-md border-0 py-2.5 pl-3 pr-12 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
        )}
        {suffix && type !== 'select' && type !== 'textarea' && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-slate-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
      {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
    </div>
  );
};