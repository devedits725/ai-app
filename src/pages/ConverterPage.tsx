import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Ruler, Scale, Thermometer, Zap, Layers, Box, Database } from "lucide-react";

type Unit = { name: string; factor: number };
type Converter = { key: string; label: string; units: Unit[]; icon: any; type?: "temp" };

const converters: Converter[] = [
  { key: "length", label: "Length", icon: Ruler, units: [{ name: "m", factor: 1 }, { name: "km", factor: 0.001 }, { name: "cm", factor: 100 }, { name: "mm", factor: 1000 }, { name: "in", factor: 39.3701 }, { name: "ft", factor: 3.28084 }, { name: "mi", factor: 0.000621371 }] },
  { key: "weight", label: "Weight", icon: Scale, units: [{ name: "kg", factor: 1 }, { name: "g", factor: 1000 }, { name: "mg", factor: 1e6 }, { name: "lb", factor: 2.20462 }, { name: "oz", factor: 35.274 }] },
  { key: "temp", label: "Temp", icon: Thermometer, units: [{ name: "°C", factor: 1 }, { name: "°F", factor: 1 }, { name: "K", factor: 1 }], type: "temp" },
  { key: "speed", label: "Speed", icon: Zap, units: [{ name: "m/s", factor: 1 }, { name: "km/h", factor: 3.6 }, { name: "mph", factor: 2.23694 }, { name: "knot", factor: 1.94384 }] },
  { key: "area", label: "Area", icon: Layers, units: [{ name: "m²", factor: 1 }, { name: "km²", factor: 1e-6 }, { name: "ft²", factor: 10.7639 }, { name: "acre", factor: 0.000247105 }, { name: "ha", factor: 0.0001 }] },
  { key: "volume", label: "Volume", icon: Box, units: [{ name: "L", factor: 1 }, { name: "mL", factor: 1000 }, { name: "gal", factor: 0.264172 }, { name: "m³", factor: 0.001 }, { name: "cup", factor: 4.22675 }] },
  { key: "data", label: "Data", icon: Database, units: [{ name: "B", factor: 1 }, { name: "KB", factor: 1 / 1024 }, { name: "MB", factor: 1 / (1024 ** 2) }, { name: "GB", factor: 1 / (1024 ** 3) }, { name: "TB", factor: 1 / (1024 ** 4) }] },
];

const convertTemp = (val: number, from: string, to: string) => {
  const celsius = from === "°C" ? val : from === "°F" ? (val - 32) * 5 / 9 : val - 273.15;
  if (to === "°C") return celsius;
  if (to === "°F") return celsius * 9 / 5 + 32;
  return celsius + 273.15;
};

const ConverterPage = () => {
  const [activeTab, setActiveTab] = useState("length");

  return (
    <MainLayout title="Unit Converter">
      <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8 pb-20">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Unit Converter</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Convert between different units instantly.</p>
        </div>

        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
          {converters.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveTab(c.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === c.key
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary"
              }`}
            >
              <c.icon className="w-4 h-4" />
              {c.label}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden p-6 lg:p-8">
          <ConverterPanel converter={converters.find(c => c.key === activeTab)!} />
        </div>
      </div>
    </MainLayout>
  );
};

const ConverterPanel = ({ converter }: { converter: Converter }) => {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState(converter.units[0].name);
  const numVal = parseFloat(value);

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Value to Convert</label>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="number"
            placeholder="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xl font-bold px-6 outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="flex flex-wrap gap-2">
            {converter.units.map((u) => (
              <button key={u.name} onClick={() => setFromUnit(u.name)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${fromUnit === u.name ? "bg-primary/10 text-primary border border-primary/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"}`}>{u.name}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {converter.units.filter((u) => u.name !== fromUnit).map((u) => {
          let result: number;
          if (converter.type === "temp") result = convertTemp(numVal, fromUnit, u.name);
          else {
            const fromFactor = converter.units.find((x) => x.name === fromUnit)!.factor;
            result = isNaN(numVal) ? 0 : (numVal / fromFactor) * u.factor;
          }
          return (
            <div key={u.name} className="flex flex-col p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-all hover:border-primary/20">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{u.name}</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white truncate">{result.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConverterPage;
