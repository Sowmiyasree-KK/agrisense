import { useState } from "react";
import { BASE_URL } from "./api";
import { useTheme } from "./ThemeContext";
import { useSoilData } from "./SoilDataContext";
import StatCard from "./components/StatCard";
import StatusCard from "./components/StatusCard";
import ChartSection from "./components/ChartSection";
import Loading from "./components/Loading";
import ErrorBanner from "./components/Error";
import CropHealth from "./components/CropHealth";
import AIRecommendations from "./pages/AIRecommendations";
import ChemicalStressCard from "./components/ChemicalStressCard";

const TABS = [
  { id: "dashboard", label: "Dashboard",        icon: "🌿" },
  { id: "crop",      label: "Crop Health",       icon: "🌾" },
  { id: "ai",        label: "AI Recommendations", icon: "🤖" },
];

// ── Theme Toggle ──────────────────────────────────────────────────────────
function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border
        bg-white dark:bg-white/8
        border-slate-200 dark:border-white/15
        text-slate-600 dark:text-white/90
        hover:bg-slate-50 dark:hover:bg-white/15
        shadow-sm dark:shadow-none"
    >
      <span className="text-base leading-none">{dark ? "☀️" : "🌙"}</span>
      <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}

// ── Live Badge ────────────────────────────────────────────────────────────
function LiveBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border
      bg-white dark:bg-emerald-500/10
      border-slate-200 dark:border-emerald-400/30
      shadow-sm dark:shadow-[0_0_12px_rgba(52,211,153,0.15)]">
      <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
      <span className="text-xs font-bold text-slate-500 dark:text-emerald-300">Live</span>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────
// Reads from shared SoilDataContext — no local fetch needed.
function Dashboard() {
  const { data, history, loading, error, lastFetch, refresh } = useSoilData();

  if (loading && !data) return (
    <div className="flex items-center justify-center py-32">
      <Loading />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* ── Hero ── */}
      <div className="mb-12 fade-in">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { icon: "📡", label: "Real-Time Monitoring" },
            { icon: "🔒", label: "Blockchain Secured" },
            { icon: "🤖", label: "AI Insights" },
          ].map((b) => (
            <div key={b.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold
                bg-emerald-50 dark:bg-emerald-500/15
                border-emerald-200 dark:border-emerald-400/35
                text-emerald-700 dark:text-emerald-300
                dark:shadow-[0_0_10px_rgba(52,211,153,0.12)]">
              <span>{b.icon}</span><span>{b.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-none mb-4
              text-slate-800 dark:text-white">
              Smart Soil<br />
              <span className="shimmer-text">Monitor</span>
            </h1>
            <p className="text-slate-500 dark:text-white/60 text-base max-w-lg leading-relaxed">
              Blockchain-secured soil intelligence platform. Real-time temperature,
              moisture &amp; pH analytics for precision agriculture.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <LiveBadge />
            <button
              onClick={refresh}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border
                bg-emerald-50 dark:bg-emerald-500/20
                border-emerald-200 dark:border-emerald-400/40
                text-emerald-700 dark:text-emerald-300
                hover:bg-emerald-100 dark:hover:bg-emerald-500/30
                shadow-sm dark:shadow-[0_0_14px_rgba(52,211,153,0.20)]"
            >
              🔄 <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-8">
          <ErrorBanner message={error} onRetry={refresh} />
        </div>
      )}

      {/* ── Stat Cards — 2 cols on tablet, 4 cols on desktop ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="slide-up">
          <StatCard icon="🌡️" label="Temperature" value={data?.temp}     unit="°C" color="emerald" />
        </div>
        <div className="slide-up">
          <StatCard icon="💧" label="Moisture"    value={data?.moisture} unit="%"  color="blue"    />
        </div>
        <div className="slide-up">
          <StatCard icon="🧪" label="pH Level"    value={data?.ph}       unit=""   color="purple"  />
        </div>
        <div className="slide-up">
          <ChemicalStressCard
            moisture={data?.moisture}
            ph={data?.ph}
            status={data?.status}
          />
        </div>
      </div>

      {/* ── Status Card ── */}
      <div className="mb-8">
        <StatusCard
          status={data?.status}
          reason={data?.reason}
          suggestion={data?.suggestion}
          time={data?.time}
        />
      </div>

      {/* ── Chart ── */}
      <div className="mb-10">
        <ChartSection history={history} />
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between text-[11px] flex-wrap gap-2
        text-slate-400 dark:text-white/30 border-t border-slate-100 dark:border-white/[0.08] pt-6">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-500 dark:text-white/30">🌿 Smart Soil Monitor</span>
          <span>·</span>
          <span>Hackathon Demo</span>
        </div>
        <div className="flex items-center gap-3">
          <span>API: {BASE_URL}</span>
          {lastFetch && (
            <>
              <span>·</span>
              <span>Updated {lastFetch.toLocaleTimeString()}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen">

      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px]
          bg-emerald-300/20 dark:bg-emerald-500/20" />
        <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-full blur-[120px]
          bg-teal-300/15 dark:bg-teal-400/15" />
        <div className="absolute -bottom-40 left-1/4 w-[450px] h-[450px] rounded-full blur-[120px]
          bg-blue-300/12 dark:bg-blue-500/12" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[700px] h-[400px] rounded-full blur-[140px] opacity-0 dark:opacity-100
          bg-emerald-900/60" />
      </div>

      {/* ── Sticky Nav ── */}
      <nav className="sticky top-0 z-30 border-b backdrop-blur-xl
        bg-white/85 dark:bg-[#020817]/85
        border-slate-200/80 dark:border-white/[0.08]">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 py-2.5">

          {/* Logo */}
          <div className="flex items-center gap-2 mr-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-sm
              shadow-sm shadow-emerald-500/30 dark:shadow-emerald-500/40">
              🌿
            </div>
            <span className="font-black text-sm text-slate-700 dark:text-white hidden sm:block">
              SoilAI
            </span>
          </div>

          {/* Tabs */}
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200",
                activeTab === tab.id
                  ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-400/35 dark:shadow-[0_0_12px_rgba(52,211,153,0.15)]"
                  : "text-slate-500 dark:text-white/55 hover:text-slate-700 dark:hover:text-white/85 hover:bg-slate-100 dark:hover:bg-white/8",
              ].join(" ")}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}

          <div className="flex-1" />
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Pages ── */}
      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "crop"      && <CropHealth />}
      {activeTab === "ai"        && <AIRecommendations />}
    </div>
  );
}
