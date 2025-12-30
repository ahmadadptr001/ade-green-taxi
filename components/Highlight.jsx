'use client';

export default function Highlight({ title, children }) {
  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-green-900 shadow-sm">
      <div className="font-bold mb-1">{title}</div>
      <div className="text-lg leading-relaxed">{children}</div>
    </div>
  );
}
