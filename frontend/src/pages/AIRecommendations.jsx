import { useSoilData } from "../SoilDataContext";
import AIAdvice from "../components/AIAdvice";
import CropRecommendation from "../components/CropRecommendation";
import RiskScore from "../components/RiskScore";
import Loading from "../components/Loading";
import ErrorBanner from "../components/Error";

// Mini stat chip shown in the hero summary row
function SoilChip({ icon, label, value, unit }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border
      bg-white/70 dark:bg-white/[0.05]
      border-slate-200/80 dark:border-white/10">
      <span className="text-base">{icon}</span>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.12em]
          text-slate-400 dark:text-white/40">{label}</p>
        <p className="text-sm font-black text-slate-800 dark:text-white leading-tight">
          {value ?? "--"}{value != null ? unit : ""}
        </p>
      </div>
    </div>
  );
}

export default function AIRecommendations() {
  const { data, loading, error, refresh } = useSoilData();

  if (loading && !data) return (
    <div className="flex items-center justify-center py-32">
      <Loading />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* ── Hero ── */}
      <div className="mb-10 fade-in">
        {/* Eyebrow chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { icon: "🤖", label: "AI-Powered" },
            { icon: "🌱", label: "Crop Intelligence" },
            { icon: "⚡", label: "Real-Time Analysis" },
          ].map((b) => (
            <div key={b.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold
                bg-violet-50 dark:bg-violet-500/15
                border-violet-200 dark:border-violet-400/35
                text-violet-700 dark:text-violet-300
                dark:shadow-[0_0_10px_rgba(167,139,250,0.12)]">
              <span>{b.icon}</span><span>{b.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between flex-wrap gap-6 mb-7">
          <div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-none mb-4
              text-slate-800 dark:text-white">
              AI<br />
              <span className="shimmer-text">Recommendations</span>
            </h1>
            <p className="text-slate-500 dark:text-white/60 text-base max-w-lg leading-relaxed">
              Smart crop suggestions and actionable farming insights
              based on current soil intelligence.
            </p>
          </div>

          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border
              bg-violet-50 dark:bg-violet-500/20
              border-violet-200 dark:border-violet-400/40
              text-violet-700 dark:text-violet-300
              hover:bg-violet-100 dark:hover:bg-violet-500/30
              shadow-sm dark:shadow-[0_0_14px_rgba(167,139,250,0.18)]"
          >
            🔄 <span>Refresh</span>
          </button>
        </div>

        {/* Current readings summary strip */}
        {data && (
          <div className="flex flex-wrap gap-3">
            <SoilChip icon="🌡️" label="Temperature" value={data.temp}     unit="°C" />
            <SoilChip icon="💧" label="Moisture"    value={data.moisture} unit="%"  />
            <SoilChip icon="🧪" label="pH Level"    value={data.ph}       unit=""   />
            <div className={[
              "flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-bold",
              data.status === "NORMAL"
                ? "bg-emerald-50 dark:bg-emerald-400/12 border-emerald-200 dark:border-emerald-400/25 text-emerald-700 dark:text-emerald-300"
                : "bg-red-50 dark:bg-red-400/12 border-red-200 dark:border-red-400/25 text-red-700 dark:text-red-300",
            ].join(" ")}>
              <span>{data.status === "NORMAL" ? "🌱" : "⚠️"}</span>
              <span>{data.status ?? "--"}</span>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-8">
          <ErrorBanner message={error} onRetry={refresh} />
        </div>
      )}

      {/* ── Risk Score — full width at top ── */}
      {data?.risk && (
        <div className="mb-8">
          <RiskScore risk={data.risk} />
        </div>
      )}

      {/* ── 2-col: AI Insights + Crop Recommendations ── */}
      {data && (
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <AIAdvice advice={data.advice} />
          <CropRecommendation crops={data.crops} />
        </div>
      )}

      {/* Empty state */}
      {!data && !loading && (
        <div className="glass rounded-3xl border p-16 text-center
          dark:border-white/[0.07] border-slate-200/70">
          <div className="text-5xl mb-4 opacity-25">🤖</div>
          <p className="font-bold text-slate-500 dark:text-white/30 mb-1">
            No data available yet
          </p>
          <p className="text-sm text-slate-400 dark:text-white/20">
            Make sure the Flask backend is running and refresh.
          </p>
        </div>
      )}
    </div>
  );
}
