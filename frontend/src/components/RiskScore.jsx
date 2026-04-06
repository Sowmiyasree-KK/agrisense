const RISK_CONFIG = {
  LOW: {
    label:   "Low Risk",
    color:   "text-emerald-600 dark:text-emerald-300",
    badge:   "bg-emerald-50 dark:bg-emerald-400/15 border-emerald-200 dark:border-emerald-400/30",
    bar:     "from-emerald-400 to-teal-400",
    glow:    "dark:shadow-[0_0_16px_rgba(52,211,153,0.20)]",
    icon:    "🟢",
    desc:    "Soil conditions are healthy. No immediate action required.",
  },
  MEDIUM: {
    label:   "Medium Risk",
    color:   "text-amber-600 dark:text-amber-300",
    badge:   "bg-amber-50 dark:bg-amber-400/15 border-amber-200 dark:border-amber-400/30",
    bar:     "from-amber-400 to-orange-400",
    glow:    "dark:shadow-[0_0_16px_rgba(251,191,36,0.18)]",
    icon:    "🟡",
    desc:    "Some parameters need attention. Monitor closely.",
  },
  HIGH: {
    label:   "High Risk",
    color:   "text-red-600 dark:text-red-300",
    badge:   "bg-red-50 dark:bg-red-400/15 border-red-200 dark:border-red-400/30",
    bar:     "from-red-500 to-orange-500",
    glow:    "dark:shadow-[0_0_16px_rgba(248,113,113,0.25)]",
    icon:    "🔴",
    desc:    "Critical conditions detected. Immediate intervention recommended.",
  },
};

export default function RiskScore({ risk }) {
  if (!risk) return null;

  const level = risk.level || "LOW";
  const score = risk.score ?? 0;
  const cfg   = RISK_CONFIG[level] || RISK_CONFIG.LOW;

  return (
    <div className={`glass rounded-3xl p-6 border fade-in
      dark:border-white/[0.08] border-slate-200/70 ${cfg.glow}`}>

      <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl border ${cfg.badge}`}>
            {cfg.icon}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em]
              text-slate-400 dark:text-white/40 mb-0.5">
              Risk Assessment
            </p>
            <p className={`text-xl font-black ${cfg.color}`}>{cfg.label}</p>
          </div>
        </div>

        {/* Score badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border font-black text-sm ${cfg.badge} ${cfg.color}`}>
          <span>{score}</span>
          <span className="font-medium opacity-60">/ 100</span>
        </div>
      </div>

      {/* Progress meter */}
      <div className="mb-4">
        <div className="h-3 rounded-full bg-slate-100 dark:bg-white/[0.08] overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${cfg.bar} transition-all duration-1000`}
            style={{ width: `${score}%` }}
          />
        </div>
        {/* Scale labels */}
        <div className="flex justify-between text-[10px] font-bold mt-1.5
          text-slate-400 dark:text-white/30">
          <span>LOW</span>
          <span>MEDIUM</span>
          <span>HIGH</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">{cfg.desc}</p>
    </div>
  );
}
