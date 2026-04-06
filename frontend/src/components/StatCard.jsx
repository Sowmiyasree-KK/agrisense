// Radial SVG progress ring
function RadialRing({ pct, color }) {
  const r = 22, circ = 2 * Math.PI * r;
  const dash = Math.min(pct / 100, 1) * circ;
  return (
    <svg width="56" height="56" className="-rotate-90">
      <circle cx="28" cy="28" r={r} fill="none" strokeWidth="4"
        className="progress-ring-track" />
      <circle cx="28" cy="28" r={r} fill="none" strokeWidth="4"
        stroke={color} strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)" }} />
    </svg>
  );
}

const CONFIG = {
  emerald: {
    orb:     "bg-emerald-400",
    orbDark: "dark:opacity-25",
    border:  "border-emerald-200/70 dark:border-emerald-400/25",
    label:   "text-emerald-600 dark:text-emerald-400",
    iconBg:  "bg-emerald-100 dark:bg-emerald-400/20 border-emerald-200 dark:border-emerald-400/30",
    glow:    "glow-emerald",
    ring:    "#34d399",
    bar:     "from-emerald-400 to-teal-400",
  },
  blue: {
    orb:     "bg-blue-400",
    orbDark: "dark:opacity-25",
    border:  "border-blue-200/70 dark:border-blue-400/25",
    label:   "text-blue-600 dark:text-blue-400",
    iconBg:  "bg-blue-100 dark:bg-blue-400/20 border-blue-200 dark:border-blue-400/30",
    glow:    "glow-blue",
    ring:    "#60a5fa",
    bar:     "from-blue-400 to-cyan-400",
  },
  purple: {
    orb:     "bg-purple-400",
    orbDark: "dark:opacity-25",
    border:  "border-purple-200/70 dark:border-purple-400/25",
    label:   "text-purple-600 dark:text-purple-400",
    iconBg:  "bg-purple-100 dark:bg-purple-400/20 border-purple-200 dark:border-purple-400/30",
    glow:    "glow-purple",
    ring:    "#a78bfa",
    bar:     "from-purple-400 to-pink-400",
  },
};

// Map value to a 0-100 display percentage for the ring
function toRingPct(value, color) {
  if (value === null || value === undefined) return 0;
  if (color === "emerald") return Math.min(((value - 15) / 25) * 100, 100); // temp 15-40
  if (color === "blue")    return Math.min((value / 100) * 100, 100);        // moisture 0-100
  if (color === "purple")  return Math.min(((value - 4) / 6) * 100, 100);   // pH 4-10
  return 70;
}

export default function StatCard({ icon, label, value, unit, color }) {
  const c = CONFIG[color] || CONFIG.emerald;
  const hasValue = value !== null && value !== undefined;
  const ringPct  = toRingPct(value, color);

  return (
    <div className={`glass card-hover rounded-3xl p-6 border fade-in relative overflow-hidden ${c.border} ${c.glow}`}>

      {/* Blurred orb — top right, brighter in dark */}
      <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-20 ${c.orbDark} ${c.orb}`} />

      {/* Top row: icon + label */}
      <div className="flex items-center justify-between mb-5 relative">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl border ${c.iconBg}`}>
          {icon}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-[0.16em] ${c.label}`}>
          {label}
        </span>
      </div>

      {/* Value + ring row */}
      <div className="flex items-center justify-between relative">
        <div>
          <div className="flex items-end gap-1.5 mb-2">
            <span className={`text-[2.8rem] font-black leading-none tracking-tight
              ${hasValue ? "text-slate-800 dark:text-white" : "text-slate-300 dark:text-white/20"}`}>
              {hasValue ? value : "--"}
            </span>
            {hasValue && unit && (
              <span className={`text-lg font-bold mb-1 ${c.label}`}>{unit}</span>
            )}
          </div>

          {/* Gradient bar */}
          <div className="h-1.5 w-32 rounded-full bg-slate-100 dark:bg-white/[0.08] overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${c.bar}`}
              style={{
                width: hasValue ? `${Math.max(ringPct, 8)}%` : "0%",
                transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>
        </div>

        {/* Radial ring */}
        <RadialRing pct={ringPct} color={c.ring} />
      </div>
    </div>
  );
}
