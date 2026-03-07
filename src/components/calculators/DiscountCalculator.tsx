import { useState } from "react";

const DiscountCalculator = () => {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const original = parseFloat(price);
  const disc = parseFloat(discount);
  const saved = original && disc ? (original * disc) / 100 : null;
  const final_price = saved !== null ? original - saved : null;

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Original Price</label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">$</span>
            <input
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xl font-bold pl-12 pr-6 outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Discount (%)</label>
          <input
            type="number"
            placeholder="0"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xl font-bold px-6 outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {final_price !== null && saved !== null && (
        <div className="space-y-4 animate-in fade-in zoom-in-95">
          <div className="p-8 rounded-2xl bg-green-500/5 border border-green-500/10 text-center">
            <p className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-2">Final Price</p>
            <p className="text-5xl font-black text-slate-900 dark:text-white">${final_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">You Save</p>
              <p className="text-lg font-bold text-green-600">${saved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Off</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{discount}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountCalculator;
