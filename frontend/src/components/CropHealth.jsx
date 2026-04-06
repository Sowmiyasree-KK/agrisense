import { useState, useRef } from "react";
import { predictCrop } from "../api";

function ConfidenceRing({ pct, isHealthy }) {
  const r = 32, circ = 2 * Math.PI * r;
  const dash = (Math.min(pct, 100) / 100) * circ;
  const color = isHealthy ? "#34d399" : "#f87171";
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={r} fill="none" strokeWidth="6" className="progress-ring-track" />
        <circle cx="48" cy="48" r={r} fill="none" strokeWidth="6"
          stroke={color} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div className="text-center">
        <p className={`text-xl font-black leading-none ${isHealthy ? "text-emerald-500 dark:text-emerald-300" : "text-red-500 dark:text-red-300"}`}>{pct}%</p>
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/30 mt-0.5">conf.</p>
      </div>
    </div>
  );
}

function UploadZone({ preview, onFileChange, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFileChange(f);
  };
  return (
    <div
      className={[
        "relative rounded-3xl border-2 border-dashed cursor-pointer overflow-hidden transition-all duration-300",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        dragging ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-400/15 scale-[1.01]"
          : preview ? "border-emerald-300/50 dark:border-emerald-400/35 bg-emerald-50/40 dark:bg-emerald-400/8"
          : "border-slate-200 dark:border-emerald-400/25 bg-white/60 dark:bg-white/[0.04] hover:border-emerald-300 dark:hover:border-emerald-400/50 hover:bg-emerald-50/60 dark:hover:bg-emerald-400/[0.08]",
      ].join(" ")}
      onClick={() => !disabled && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
    >
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden" disabled={disabled}
        onChange={(e) => e.target.files[0] && onFileChange(e.target.files[0])} />
      {preview ? (
        <div className="p-4">
          <img src={preview} alt="Crop preview" className="w-full max-h-72 object-contain rounded-2xl shadow-lg" />
          <p className="text-center text-xs mt-3 text-slate-400 dark:text-white/30 font-medium">✏️ Click to change image</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-400/15 dark:to-teal-400/8 border border-emerald-200 dark:border-emerald-400/20 shadow-md">🌾</div>
            <div className="absolute -inset-2 rounded-[2rem] border-2 border-dashed border-emerald-200/50 dark:border-emerald-400/12" />
          </div>
          <p className="font-black text-slate-700 dark:text-white/90 text-xl mb-2">Drop your crop image</p>
          <p className="text-sm text-slate-400 dark:text-white/55 mb-5">or click to browse files from your device</p>
          <div className="flex gap-2">
            {["PNG", "JPG", "WEBP"].map((f) => (
              <span key={f} className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-emerald-400/15 text-slate-500 dark:text-emerald-300 border border-slate-200 dark:border-emerald-400/30">{f}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ result }) {
  const isHealthy = result.prediction === "Healthy";
  const pct = Math.round(result.confidence * 100);
  return (
    <div className={["glass rounded-3xl border fade-in relative overflow-hidden h-full",
      isHealthy ? "border-emerald-200/70 dark:border-emerald-400/20 glow-emerald"
                : "border-red-200/70 dark:border-red-400/22 glow-red"].join(" ")}>
      <div className={["absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-20 dark:opacity-14",
        isHealthy ? "bg-emerald-400" : "bg-red-400"].join(" ")} />
      {/* Header */}
      <div className={["px-6 pt-6 pb-5 border-b relative",
        isHealthy ? "border-emerald-100/80 dark:border-emerald-400/10"
                  : "border-red-100/80 dark:border-red-400/10"].join(" ")}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={["w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-2 shadow-sm",
              isHealthy ? "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-400/15 dark:to-emerald-600/10 border-emerald-200 dark:border-emerald-400/25"
                        : "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-400/15 dark:to-orange-600/10 border-red-200 dark:border-red-400/25"].join(" ")}>
              {isHealthy ? "✅" : "🚨"}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-white/35 mb-0.5">AI Prediction</p>
              <p className={`text-2xl font-black tracking-tight ${isHealthy ? "text-emerald-600 dark:text-emerald-300" : "text-red-600 dark:text-red-300"}`}>{result.prediction}</p>
            </div>
          </div>
          <ConfidenceRing pct={pct} isHealthy={isHealthy} />
        </div>
      </div>
      {/* Bar */}
      <div className="px-6 py-4 border-b dark:border-white/[0.08] border-slate-100/80">
        <div className="flex justify-between text-[11px] font-bold mb-2 text-slate-400 dark:text-white/55">
          <span>Confidence Score</span><span>{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 dark:bg-white/[0.10] overflow-hidden">
          <div className={`h-full rounded-full ${isHealthy ? "bg-gradient-to-r from-emerald-400 to-teal-400" : "bg-gradient-to-r from-red-400 to-orange-400"}`}
            style={{ width: `${pct}%`, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>
      </div>
      {/* Panels */}
      <div className="p-6 grid gap-3 relative">
        {[{ icon: "🔍", label: "Reason", text: result.reason }, { icon: "💡", label: "Suggestion", text: result.suggestion }].map(({ icon, label, text }) => (
          <div key={label} className="rounded-2xl p-4 border bg-white/50 dark:bg-white/[0.06] border-slate-100/80 dark:border-white/[0.09]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm">{icon}</span>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-white/50">{label}</p>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-white/80">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { icon: "📸", title: "Upload",  desc: "Drop a clear close-up photo of crop leaves",  color: "bg-blue-50 dark:bg-blue-400/15 border-blue-200 dark:border-blue-400/25" },
    { icon: "🎨", title: "Analyze", desc: "Pixel color-tone analysis detects stress",     color: "bg-emerald-50 dark:bg-emerald-400/15 border-emerald-200 dark:border-emerald-400/25" },
    { icon: "📊", title: "Result",  desc: "Confidence score + actionable suggestion",     color: "bg-purple-50 dark:bg-purple-400/15 border-purple-200 dark:border-purple-400/25" },
  ];
  return (
    <div className="glass rounded-3xl p-6 border fade-in dark:border-white/[0.07] border-slate-200/70">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-white/30 mb-4">How it works</p>
      <div className="grid grid-cols-3 gap-3">
        {steps.map((s, i) => (
          <div key={s.title} className={`rounded-2xl p-4 border text-center ${s.color}`}>
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-white/10 text-[9px] font-black flex items-center justify-center text-slate-500 dark:text-white/40">{i + 1}</span>
              <p className="text-xs font-black text-slate-700 dark:text-white/70">{s.title}</p>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-white/35 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CropHealth() {
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleFileChange = (f) => { setFile(f); setResult(null); setError(null); setPreview(URL.createObjectURL(f)); };
  const handlePredict = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    try { setResult(await predictCrop(file)); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  const handleReset = () => { setFile(null); setPreview(null); setResult(null); setError(null); };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-10 fade-in">
        <div className="flex flex-wrap gap-2 mb-5">
          {[{ icon: "⚡", label: "Instant Detection" }, { icon: "🌾", label: "Wheat Health AI" }, { icon: "🔬", label: "Stress Analysis" }].map((b) => (
            <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold bg-emerald-50 dark:bg-emerald-400/10 border-emerald-200 dark:border-emerald-400/20 text-emerald-700 dark:text-emerald-400">
              <span>{b.icon}</span><span>{b.label}</span>
            </div>
          ))}
        </div>
        <h2 className="text-5xl font-black tracking-tight leading-none mb-3 text-slate-800 dark:text-white">
          Crop Health<br /><span className="shimmer-text">Detection</span>
        </h2>
        <p className="text-slate-500 dark:text-white/60 max-w-lg leading-relaxed">
          Upload a crop image for instant AI-powered color-tone analysis. Detects chlorophyll levels and stress indicators in seconds.
        </p>
      </div>

      {/* 2-col layout */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Left */}
        <div className="flex flex-col gap-4">
          <UploadZone preview={preview} onFileChange={handleFileChange} disabled={loading} />
          <div className="flex gap-3">
            <button onClick={handlePredict} disabled={!file || loading}
              className={["flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black text-sm transition-all duration-200",
                file && !loading
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 hover:from-emerald-400 hover:to-teal-400"
                  : "bg-slate-100 dark:bg-white/[0.05] text-slate-400 dark:text-white/20 cursor-not-allowed"].join(" ")}>
              {loading ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</>) : <>🔬 Analyze Crop Health</>}
            </button>
            {(file || result) && (
              <button onClick={handleReset} disabled={loading}
                className="px-5 py-4 rounded-2xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-white/[0.05] dark:hover:bg-white/10 dark:text-white/50 border border-slate-200 dark:border-white/10">
                Reset
              </button>
            )}
          </div>
          {error && (
            <div className="glass rounded-2xl p-4 border flex gap-3 items-start fade-in border-red-200/80 dark:border-red-400/22 bg-red-50/80 dark:bg-red-400/[0.07]">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="font-bold text-sm text-red-700 dark:text-red-300">Analysis Failed</p>
                <p className="text-sm mt-0.5 text-slate-600 dark:text-white/50">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex flex-col">
          {result ? (
            <ResultCard result={result} />
          ) : (
            <div className="glass rounded-3xl border flex flex-col items-center justify-center min-h-[320px] border-slate-200/70 dark:border-white/[0.07] bg-slate-50/40 dark:bg-white/[0.015]">
              <div className="text-center px-8">
                <div className="text-5xl mb-4 opacity-20">🧬</div>
                <p className="font-bold text-slate-500 dark:text-white/25 mb-1">Analysis results will appear here</p>
                <p className="text-sm text-slate-400 dark:text-white/18">Upload an image and click Analyze</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {!result && <HowItWorks />}
    </div>
  );
}
