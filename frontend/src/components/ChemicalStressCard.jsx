/**
 * ChemicalStressCard — AI-estimated herbicide residue risk indicator.
 *
 * ⚠️  This is NOT a lab measurement. It is a frontend-computed estimate
 *     derived from soil conditions (moisture, pH) and crop stress signals.
 *     Treat it as an AI-based indicator only.
 */

// ── Radial ring (same component pattern as StatCard) ─────────────────────
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

// ── Stress calculation logic ──────────────────────────────────────────────
/**
 * Derives a chemical stress estimate from soil readings.
 * Returns { pct, status, confidence, ringColor, barFrom, barTo }
 *
 * Rules (additive scoring):
 *  - moisture > 75  → +35  (waterlogged soil traps residues)
 *  - moisture > 70  → +20
 *  - pH < 5.5       → +30  (acidic soil slows herbicide breakdown)
 *  - pH > 7.8       → +25  (alkaline soil alters residue chemistry)
 *  - pH < 6.0       → +15
 *  - pH > 7.5       → +12
 *  - ABNORMAL status → ×1.25 multiplier
 */
export function calcChemicalStress(moisture, ph, status) {
  if (moisture == null || ph == null) {
    return { pct: 0, status: "--", confidence: "--", ringColor: "#94a3b8", barFrom: "from-slate-300", barTo: "to-slate-400" };
  }

  let score = 0;

  // Moisture contribution
  if (moisture > 75)      score += 35;
  else if (moisture > 70) score += 20;
  else if (moisture > 65) score += 10;

  // pH contribution
  if (ph < 5.5)           score += 30;
  else if (ph < 6.0)      score += 15;
  else if (ph > 7.8)      score += 25;
  else if (ph > 7.5)      score += 12;

  // Status multiplier
  if (status === "ABNORMAL") score = Math.round(score * 1.25);

  // Clamp to 0–100
  const pct = Math.min(Math.max(score, 4), 100);

  // Derive level + confidence
  let level, confidence, ringColor, barFrom, barTo;

  if (pct >= 60) {
    level      = "High";
    confidence = "High Confidence";
    ringColor  = "#f87171";   // red-400
    barFrom    = "from-red-400";
    barTo      = "to-orange-400";
  } else if (pct >= 30) {
    level      = "Medium";
    confidence = "Moderate Confidence";
    ringColor  = "#fb923c";   // orange-400
    barFrom    = "from-orange-400";
    barTo      = "to-amber-400";
  } else {
    level      = "Low";
    confidence = "High Confidence";
    ringColor  = "#34d399";   // emerald-400
    barFrom    = "from-emerald-400";
    barTo      = "to-teal-400";
  }

  return { pct, status: level, confidence, ringColor, barFrom, barTo };
}

// ── Theme config per stress level ─────────────────────────────────────────
const LEVEL_CONFIG = {
  Low: {
    orb:     "bg-emerald-400",
    border:  "border-emerald-200/70 dark:border-emerald-400/25",
    label:   "text-emerald-600 dark:text-emerald-400",
    iconBg:  "bg-emerald-100 dark:bg-emerald-400/20 border-emerald-200 dark:border-emerald-400/30",
    glow:    "glow-emerald",
    badge:   "bg-emerald-100 dark:bg-emerald-400/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-400/25",
  },
  Medium: {
    orb:     "bg-orange-400",
    border:  "border-orange-200/70 dark:border-orange-400/25",
    label:   "text-orange-600 dark:text-orange-400",
    iconBg:  "bg-orange-100 dark:bg-orange-400/20 border-orange-200 dark:border-orange-400/30",
    glow:    "dark:shadow-[0_0_0_1px_rgba(251,146,60,0.28),0_0_20px_rgba(251,146,60,0.22),0_8px_40px_rgba(251,146,60,0.15)]",
    badge:   "bg-orange-100 dark:bg-orange-400/15 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-400/25",
  },
  High: {
    orb:     "bg-red-400",
    border:  "border-red-200/70 dark:border-red-400/25",
    label:   "text-red-600 dark:text-red-400",
    iconBg:  "bg-red-100 dark:bg-red-400/20 border-red-200 dark:border-red-400/30",
    glow:    "glow-red",
    badge:   "bg-red-100 dark:bg-red-400/15 text-red-700 dark:text-red-300 border-red-200 dark:border-red-400/25",
  },
  "--": {
    orb:     "bg-slate-300",
    border:  "border-slate-200/70 dark:border-white/10",
    label:   "text-slate-500 dark:text-white/40",
    iconBg:  "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10",
    glow:    "",
    badge:   "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 border-slate-200 dark:border-white/10",
  },
};

// ── Card component ────────────────────────────────────────────────────────
export default function ChemicalStressCard({ moisture, ph, status }) {
  const stress = calcChemicalStress(moisture, ph, status);
  const c = LEVEL_CONFIG[stress.status] || LEVEL_CONFIG["--"];
  const hasValue = moisture != null && ph != null;

  return (
    <div className={`glass card-hover rounded-3xl p-6 border fade-in relative overflow-hidden ${c.border} ${c.glow}`}>

      {/* Decorative orb */}
      <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-20 dark:opacity-25 ${c.orb}`} />

      {/* Top row: icon + label */}
      <div className="flex items-center justify-between mb-5 relative">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl border ${c.iconBg}`}>
          ⚗️
        </div>
        <span className={`text-[10px] font-black uppercase tracking-[0.16em] ${c.label}`}>
          Chemical Stress
        </span>
      </div>

      {/* Value + ring row */}
      <div className="flex items-center justify-between relative">
        <div className="flex-1">
          {/* Percentage value */}
          <div className="flex items-end gap-1.5 mb-2">
            <span className={`text-[2.8rem] font-black leading-none tracking-tight
              ${hasValue ? "text-slate-800 dark:text-white" : "text-slate-300 dark:text-white/20"}`}>
              {hasValue ? stress.pct : "--"}
            </span>
            {hasValue && (
              <span className={`text-lg font-bold mb-1 ${c.label}`}>%</span>
            )}
          </div>

          {/* Gradient bar */}
          <div className="h-1.5 w-28 rounded-full bg-slate-100 dark:bg-white/[0.08] overflow-hidden mb-3">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${stress.barFrom} ${stress.barTo}`}
              style={{
                width: hasValue ? `${Math.max(stress.pct, 4)}%` : "0%",
                transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>

          {/* Status badge + confidence */}
          <div className="flex flex-col gap-1">
            {hasValue && (
              <span className={`inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full text-[10px] font-black border ${c.badge}`}>
                {stress.status === "Low" ? "🟢" : stress.status === "Medium" ? "🟡" : "🔴"}
                {stress.status}
              </span>
            )}
            <span className="text-[10px] text-slate-400 dark:text-white/35 font-medium">
              {hasValue ? stress.confidence : "Awaiting data"}
            </span>
          </div>
        </div>

        {/* Radial ring */}
        <RadialRing pct={stress.pct} color={stress.ringColor} />
      </div>

      {/* AI disclaimer footer */}
      <p className="text-[9px] text-slate-400 dark:text-white/25 mt-3 leading-relaxed relative">
        AI-estimated · not lab-measured
      </p>
    </div>
  );
}
