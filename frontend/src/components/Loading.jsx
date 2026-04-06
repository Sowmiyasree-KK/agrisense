export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
      {/* Layered spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-400/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400 animate-spin" />
        <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-emerald-300/50 animate-spin"
          style={{ animationDuration: "0.7s", animationDirection: "reverse" }} />
        <div className="absolute inset-0 flex items-center justify-center text-xl">🌿</div>
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-slate-700 dark:text-white/80">
          Connecting to sensors
        </p>
        <p className="text-sm text-slate-400 dark:text-white/35 mt-1">
          Fetching live soil data...
        </p>
      </div>
    </div>
  );
}
