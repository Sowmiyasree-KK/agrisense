// Icon → colour mapping based on the leading emoji in each advice string
function chipStyle(text) {
  if (text.startsWith("💧")) return "bg-blue-50 dark:bg-blue-400/12 border-blue-200 dark:border-blue-400/25 text-blue-700 dark:text-blue-300";
  if (text.startsWith("🌡️")) return "bg-rose-50 dark:bg-rose-400/12 border-rose-200 dark:border-rose-400/25 text-rose-700 dark:text-rose-300";
  if (text.startsWith("⚗️")) return "bg-purple-50 dark:bg-purple-400/12 border-purple-200 dark:border-purple-400/25 text-purple-700 dark:text-purple-300";
  if (text.startsWith("✅")) return "bg-emerald-50 dark:bg-emerald-400/12 border-emerald-200 dark:border-emerald-400/25 text-emerald-700 dark:text-emerald-300";
  if (text.startsWith("⚠️")) return "bg-amber-50 dark:bg-amber-400/12 border-amber-200 dark:border-amber-400/25 text-amber-700 dark:text-amber-300";
  return "bg-slate-50 dark:bg-white/[0.05] border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70";
}

export default function AIAdvice({ advice }) {
  if (!advice || advice.length === 0) return null;

  return (
    <div className="glass rounded-3xl border fade-in overflow-hidden
      dark:border-white/[0.08] border-slate-200/70
      dark:shadow-[0_0_24px_rgba(52,211,153,0.08)]">

      {/* Header */}
      <div className="px-7 pt-6 pb-5 border-b dark:border-white/[0.06] border-slate-100/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl
            bg-violet-50 dark:bg-violet-400/15 border border-violet-200 dark:border-violet-400/25
            dark:shadow-[0_0_12px_rgba(167,139,250,0.20)]">
            🤖
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">
              AI Insights
            </h2>
            <p className="text-xs text-slate-400 dark:text-white/45 mt-0.5">
              Actionable recommendations based on live soil data
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full
            bg-violet-50 dark:bg-violet-400/10 border border-violet-200 dark:border-violet-400/25">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 pulse-dot" />
            <span className="text-[11px] font-bold text-violet-700 dark:text-violet-300">Live Analysis</span>
          </div>
        </div>
      </div>

      {/* Advice list */}
      <div className="p-6 flex flex-col gap-3">
        {advice.map((item, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-4 rounded-2xl border fade-in ${chipStyle(item)}`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Leading emoji as icon */}
            <span className="text-lg flex-shrink-0 mt-0.5">{item.slice(0, 2)}</span>
            <p className="text-sm leading-relaxed font-medium">{item.slice(2).trim()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
