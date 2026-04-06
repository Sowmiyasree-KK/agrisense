export default function StatusCard({ status, reason, suggestion, time }) {
  const isNormal  = status === "NORMAL";
  const hasStatus = !!status;

  const accent = isNormal
    ? { orb: "bg-emerald-400", glow: "glow-emerald", border: "border-emerald-200/70 dark:border-emerald-400/20" }
    : hasStatus
      ? { orb: "bg-red-400",     glow: "abnormal-glow", border: "border-red-200/70 dark:border-red-400/22" }
      : { orb: "bg-slate-300",   glow: "",              border: "border-slate-200 dark:border-white/10" };

  return (
    <div className={`glass rounded-3xl border fade-in relative overflow-hidden ${accent.border} ${accent.glow}`}>

      {/* Large background orb */}
      <div className={`absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[80px] opacity-20 dark:opacity-12 ${accent.orb}`} />
      {/* Second orb bottom-left for depth */}
      <div className={`absolute -bottom-16 -left-16 w-56 h-56 rounded-full blur-[60px] opacity-10 dark:opacity-8 ${accent.orb}`} />

      {/* ── Top strip: status + blockchain badge ── */}
      <div className={[
        "px-7 pt-7 pb-5 border-b relative",
        isNormal
          ? "border-emerald-100/80 dark:border-emerald-400/10"
          : hasStatus
            ? "border-red-100/80 dark:border-red-400/10"
            : "border-slate-100 dark:border-white/[0.06]",
      ].join(" ")}>
        <div className="flex items-center justify-between flex-wrap gap-4">

          {/* Icon + status text */}
          <div className="flex items-center gap-5">
            <div className={[
              "w-18 h-18 w-[4.5rem] h-[4.5rem] rounded-2xl flex items-center justify-center text-4xl border-2 shadow-md",
              isNormal
                ? "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-400/15 dark:to-emerald-600/10 border-emerald-200 dark:border-emerald-400/25"
                : hasStatus
                  ? "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-400/15 dark:to-orange-600/10 border-red-200 dark:border-red-400/25"
                  : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10",
            ].join(" ")}>
              {isNormal ? "🌱" : hasStatus ? "⚠️" : "⏳"}
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-1
                text-slate-400 dark:text-white/50">
                Soil Status
              </p>
              <p className={[
                "text-4xl font-black tracking-tight leading-none",
                isNormal
                  ? "text-emerald-600 dark:text-emerald-300"
                  : hasStatus
                    ? "text-red-600 dark:text-red-300"
                    : "text-slate-400 dark:text-white/30",
              ].join(" ")}>
                {status ?? "Waiting..."}
              </p>
              {hasStatus && (
                <div className={[
                  "inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  isNormal
                    ? "bg-emerald-100 dark:bg-emerald-400/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-red-100 dark:bg-red-400/15 text-red-700 dark:text-red-300",
                ].join(" ")}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isNormal ? "bg-emerald-500" : "bg-red-500 pulse-dot"}`} />
                  {isNormal ? "All parameters optimal" : "Attention required"}
                </div>
              )}
            </div>
          </div>

          {/* Blockchain badge */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border
              bg-amber-50 dark:bg-amber-400/10
              border-amber-200/80 dark:border-amber-400/22
              shadow-sm">
              <span className="text-base">🔒</span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-600 dark:text-amber-400">
                  Blockchain
                </p>
                <p className="text-[10px] font-semibold text-amber-500 dark:text-amber-500/80">
                  Secured
                </p>
              </div>
            </div>
            {time && (
              <p className="text-[10px] text-slate-400 dark:text-white/25">
                {new Date(time).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Reason & Suggestion ── */}
      <div className="p-7 grid sm:grid-cols-2 gap-4 relative">
        {[
          { icon: "🔍", label: "Reason",     text: reason },
          { icon: "💡", label: "Suggestion", text: suggestion },
        ].map(({ icon, label, text }) => (
          <div key={label}
            className="rounded-2xl p-5 border
              bg-white/50 dark:bg-white/[0.06]
              border-slate-100/80 dark:border-white/[0.09]">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-base">{icon}</span>
              <p className="text-[10px] font-black uppercase tracking-[0.14em]
                text-slate-400 dark:text-white/50">
                {label}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-white/80">
              {text ?? "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
