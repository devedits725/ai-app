import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Unit = { name: string; factor: number };
type Converter = { key: string; label: string; units: Unit[]; type?: "temp" };

const converters: Converter[] = [
  { key: "length", label: "Length", units: [{ name: "m", factor: 1 }, { name: "km", factor: 0.001 }, { name: "cm", factor: 100 }, { name: "mm", factor: 1000 }, { name: "in", factor: 39.3701 }, { name: "ft", factor: 3.28084 }, { name: "mi", factor: 0.000621371 }] },
  { key: "weight", label: "Weight", units: [{ name: "kg", factor: 1 }, { name: "g", factor: 1000 }, { name: "mg", factor: 1e6 }, { name: "lb", factor: 2.20462 }, { name: "oz", factor: 35.274 }] },
  { key: "temp", label: "Temp", units: [{ name: "°C", factor: 1 }, { name: "°F", factor: 1 }, { name: "K", factor: 1 }], type: "temp" },
  { key: "speed", label: "Speed", units: [{ name: "m/s", factor: 1 }, { name: "km/h", factor: 3.6 }, { name: "mph", factor: 2.23694 }, { name: "knot", factor: 1.94384 }] },
  { key: "area", label: "Area", units: [{ name: "m²", factor: 1 }, { name: "km²", factor: 1e-6 }, { name: "ft²", factor: 10.7639 }, { name: "acre", factor: 0.000247105 }, { name: "ha", factor: 0.0001 }] },
  { key: "volume", label: "Volume", units: [{ name: "L", factor: 1 }, { name: "mL", factor: 1000 }, { name: "gal", factor: 0.264172 }, { name: "m³", factor: 0.001 }, { name: "cup", factor: 4.22675 }] },
  { key: "data", label: "Data", units: [{ name: "B", factor: 1 }, { name: "KB", factor: 1 / 1024 }, { name: "MB", factor: 1 / (1024 ** 2) }, { name: "GB", factor: 1 / (1024 ** 3) }, { name: "TB", factor: 1 / (1024 ** 4) }] },
];

const convertTemp = (val: number, from: string, to: string) => {
  const celsius = from === "°C" ? val : from === "°F" ? (val - 32) * 5 / 9 : val - 273.15;
  if (to === "°C") return celsius;
  if (to === "°F") return celsius * 9 / 5 + 32;
  return celsius + 273.15;
};

const ConverterPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader title="Unit Converter" />
      <Tabs defaultValue="length" className="flex-1 flex flex-col">
        <div className="px-4 pt-2 overflow-x-auto">
          <TabsList className="w-full grid grid-cols-7 h-auto">
            {converters.map((c) => <TabsTrigger key={c.key} value={c.key} className="text-xs py-1.5">{c.label}</TabsTrigger>)}
          </TabsList>
        </div>
        {converters.map((conv) => (
          <TabsContent key={conv.key} value={conv.key} className="flex-1 p-4 pb-20">
            <ConverterPanel converter={conv} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const ConverterPanel = ({ converter }: { converter: Converter }) => {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState(converter.units[0].name);

  const numVal = parseFloat(value);

  return (
    <div className="space-y-4">
      <Input type="number" placeholder="Enter value" value={value} onChange={(e) => setValue(e.target.value)} className="text-lg" />
      <div className="flex gap-2 flex-wrap">
        {converter.units.map((u) => (
          <button key={u.name} onClick={() => setFromUnit(u.name)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${fromUnit === u.name ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
            {u.name}
          </button>
        ))}
      </div>
      {!isNaN(numVal) && value && (
        <div className="space-y-2">
          {converter.units.filter((u) => u.name !== fromUnit).map((u) => {
            let result: number;
            if (converter.type === "temp") {
              result = convertTemp(numVal, fromUnit, u.name);
            } else {
              const fromFactor = converter.units.find((x) => x.name === fromUnit)!.factor;
              result = (numVal / fromFactor) * u.factor;
            }
            return (
              <div key={u.name} className="flex justify-between items-center p-3 rounded-xl bg-card border border-border">
                <span className="text-sm font-medium">{u.name}</span>
                <span className="font-mono text-primary font-semibold">{result.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConverterPage;
