const RANK_STYLE = [
  {
    badge:  "bg-amber-400 text-amber-900",
    border: "border-amber-200/80 dark:border-amber-400/30",
    glow:   "dark:shadow-[0_0_20px_rgba(251,191,36,0.15)]",
    bar:    "from-amber-400 to-yellow-400",
    label:  "text-amber-600 dark:text-amber-300",
  },
  {
    badge:  "bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-200",
    border: "border-slate-200/80 dark:border-slate-500/30",
    glow:   "",
    bar:    "from-slate-400 to-slate-300",
    label:  "text-slate-500 dark:text-slate-400",
  },
];

function CropCard({ crop, rank }) {
  const s = RANK_STYLE[rank] || RANK_STYLE[1];
  const pct = Math.round(crop.score);

  return (
    <div className={`glass card-hover rounded-2xl p-5 border fade-in relative overflow-hidden ${s.border} ${s.glow}`}>
      {/* Rank badge */}
      <div className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${s.badge}`}>
        {rank + 1}
      </div>

      {/* Icon + name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl
          bg-white/60 dark:bg-white/[0.07] border border-slate-100 dark:border-white/10">
          {crop.icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-white/40 mb-0.5">
            {rank === 0 ? "Best Match" : "2nd Choice"}
          </p>
          <p className="text-lg font-black text-slate-800 dark:text-white">{crop.name}</p>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[11px] font-bold mb-1.5
          text-slate-400 dark:text-white/45">
          <span>Suitability</span>
          <span className={`font-black ${s.label}`}>{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 dark:bg-white/[0.08] overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${s.bar}`}
            style={{ width: `${pct}%`, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </div>
      </div>

      {/* Reason */}
      <p className="text-xs text-slate-500 dark:text-white/55 leading-relaxed">{crop.reason}</p>
    </div>
  );
}

export default function CropRecommendation({ crops }) {
  if (!crops || crops.length === 0) return null;

  return (
    <div className="glass rounded-3xl border fade-in overflow-hidden
      dark:border-white/[0.08] border-slate-200/70">

      {/* Header */}
      <div className="px-7 pt-6 pb-5 border-b dark:border-white/[0.06] border-slate-100/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl
            bg-amber-50 dark:bg-amber-400/15 border border-amber-200 dark:border-amber-400/25">
            🌱
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">
              Recommended Crops
            </h2>
            <p className="text-xs text-slate-400 dark:text-white/45 mt-0.5">
              AI-matched to current soil conditions
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full
            bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/25">
            <span className="text-xs">🏆</span>
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">Top Picks</span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="p-6 grid sm:grid-cols-2 gap-4">
        {crops.map((crop, i) => (
          <CropCard key={crop.name} crop={crop} rank={i} />
        ))}
      </div>
    </div>
  );
}
