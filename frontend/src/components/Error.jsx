export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="glass rounded-2xl p-5 border flex items-start gap-4
      border-red-200/80 dark:border-red-400/25 bg-red-50/80 dark:bg-red-400/[0.07]">
      <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-400/15 flex items-center justify-center flex-shrink-0">
        <span className="text-lg">⚠️</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-red-700 dark:text-red-300">Connection Error</p>
        <p className="text-sm mt-0.5 text-slate-600 dark:text-white/55 break-words">{message}</p>
        <p className="text-xs mt-1 text-slate-400 dark:text-white/35">
          Ensure Flask is running on port 5000 with CORS enabled.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg
          bg-red-100 hover:bg-red-200 text-red-700
          dark:bg-red-400/15 dark:hover:bg-red-400/25 dark:text-red-300"
      >
        Retry
      </button>
    </div>
  );
}
