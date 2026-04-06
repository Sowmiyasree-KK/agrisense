import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Tooltip, Legend, Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useTheme } from "../ThemeContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

function avg(arr, key) {
  if (!arr.length) return null;
  return (arr.reduce((s, d) => s + d[key], 0) / arr.length).toFixed(1);
}

function KpiChip({ icon, label, value, unit, colorClass }) {
  return (
    <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border ${colorClass}`}>
      <span className="text-base">{icon}</span>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.12em] opacity-60">{label}</p>
        <p className="text-sm font-black leading-tight">
          {value ?? "--"}{value ? unit : ""}
        </p>
      </div>
    </div>
  );
}

export default function ChartSection({ history }) {
  const { dark } = useTheme();

  const tick     = dark ? "rgba(255,255,255,0.50)" : "rgba(15,23,42,0.40)";
  const grid     = dark ? "rgba(255,255,255,0.06)"  : "rgba(0,0,0,0.045)";
  const legend   = dark ? "rgba(255,255,255,0.80)"  : "rgba(15,23,42,0.70)";
  const ttBg     = dark ? "rgba(2,8,17,0.98)"       : "rgba(255,255,255,0.99)";
  const ttTitle  = dark ? "#ffffff"                 : "#0f172a";
  const ttBody   = dark ? "rgba(255,255,255,0.75)"  : "rgba(15,23,42,0.60)";
  const ttBorder = dark ? "rgba(52,211,153,0.20)"   : "rgba(0,0,0,0.07)";

  const labels = history.map((_, i) => `#${i + 1}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Temp °C",
        data: history.map((d) => d.temp),
        borderColor: "#fb7185",
        backgroundColor: dark ? "rgba(251,113,133,0.09)" : "rgba(251,113,133,0.07)",
        tension: 0.45, fill: true, pointRadius: 3.5, pointHoverRadius: 7,
        borderWidth: 2.5, pointBackgroundColor: "#fb7185",
        pointBorderColor: dark ? "#030a06" : "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "Moisture %",
        data: history.map((d) => d.moisture),
        borderColor: "#38bdf8",
        backgroundColor: dark ? "rgba(56,189,248,0.09)" : "rgba(56,189,248,0.07)",
        tension: 0.45, fill: true, pointRadius: 3.5, pointHoverRadius: 7,
        borderWidth: 2.5, pointBackgroundColor: "#38bdf8",
        pointBorderColor: dark ? "#030a06" : "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "pH",
        data: history.map((d) => d.ph),
        borderColor: "#a78bfa",
        backgroundColor: dark ? "rgba(167,139,250,0.09)" : "rgba(167,139,250,0.07)",
        tension: 0.45, fill: true, pointRadius: 3.5, pointHoverRadius: 7,
        borderWidth: 2.5, pointBackgroundColor: "#a78bfa",
        pointBorderColor: dark ? "#030a06" : "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          color: legend,
          font: { size: 11, family: "Inter", weight: "700" },
          usePointStyle: true, pointStyleWidth: 7, padding: 16,
        },
      },
      tooltip: {
        backgroundColor: ttBg, titleColor: ttTitle, bodyColor: ttBody,
        borderColor: ttBorder, borderWidth: 1, padding: 14, cornerRadius: 14,
        titleFont: { size: 12, weight: "800" },
        bodyFont: { size: 12, weight: "500" },
        displayColors: true, boxWidth: 8, boxHeight: 8, boxPadding: 4,
      },
    },
    scales: {
      x: {
        ticks: { color: tick, font: { size: 11, weight: "600" }, padding: 6 },
        grid: { color: grid },
        border: { display: false },
      },
      y: {
        ticks: { color: tick, font: { size: 11, weight: "600" }, padding: 8 },
        grid: { color: grid },
        border: { display: false },
      },
    },
  };

  return (
    <div className="glass rounded-3xl border fade-in overflow-hidden
      dark:border-white/[0.08] border-slate-200/70">

      {/* Header strip */}
      <div className="px-7 pt-6 pb-5 border-b dark:border-white/[0.06] border-slate-100/80">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
              Sensor Trends
            </h2>
            <p className="text-xs text-slate-400 dark:text-white/50 mt-0.5 font-medium">
              Live readings · {history.length} samples collected
            </p>
          </div>

          {/* KPI chips */}
          {history.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <KpiChip icon="🌡️" label="Avg Temp"
                value={avg(history,"temp")} unit="°C"
                colorClass="bg-rose-50 dark:bg-rose-400/15 border-rose-200/70 dark:border-rose-400/30 text-rose-700 dark:text-rose-300" />
              <KpiChip icon="💧" label="Avg Moisture"
                value={avg(history,"moisture")} unit="%"
                colorClass="bg-sky-50 dark:bg-sky-400/15 border-sky-200/70 dark:border-sky-400/30 text-sky-700 dark:text-sky-300" />
              <KpiChip icon="🧪" label="Avg pH"
                value={avg(history,"ph")} unit=""
                colorClass="bg-purple-50 dark:bg-purple-400/15 border-purple-200/70 dark:border-purple-400/30 text-purple-700 dark:text-purple-300" />
            </div>
          )}
        </div>
      </div>

      {/* Chart area — much darker in dark mode for contrast */}
      <div className="px-6 py-6 bg-slate-50/60 dark:bg-black/35">
        {history.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center gap-3
            text-slate-400 dark:text-white/20">
            <span className="text-5xl opacity-30">📡</span>
            <p className="text-sm font-medium">Waiting for sensor data...</p>
          </div>
        ) : (
          <div className="h-72">
            <Line data={chartData} options={options} />
          </div>
        )}
      </div>
    </div>
  );
}
