export default function Alert({ open, type = 'loading', message }) {
  if (!open) return null;

  const config = {
    loading: {
      ring: 'border-zinc-300 border-t-zinc-600',
      accent: 'text-zinc-700',
    },
    success: {
      ring: 'border-emerald-200',
      accent: 'text-emerald-700',
      icon: '✓',
    },
    error: {
      ring: 'border-rose-200',
      accent: 'text-rose-700',
      icon: '!',
    },
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[92%] max-w-sm rounded-3xl bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] p-6">
        <div className="flex flex-col items-center gap-4">
          {/* ICON */}
          {type === 'loading' ? (
            <div
              className={`w-10 h-10 rounded-full border-2 animate-spin ${config.loading.ring}`}
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${config[type].accent} bg-zinc-100`}
            >
              {config[type].icon}
            </div>
          )}

          {/* MESSAGE */}
          <p className="text-sm text-zinc-600 text-center leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
