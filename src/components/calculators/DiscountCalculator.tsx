import { useState } from "react";
import { Input } from "@/components/ui/input";

const DiscountCalculator = () => {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const original = parseFloat(price);
  const disc = parseFloat(discount);
  const saved = original && disc ? (original * disc) / 100 : null;
  const final_price = saved !== null ? original - saved : null;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">Discount Calculator</h2>
      <div className="space-y-3">
        <Input type="number" placeholder="Original price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Input type="number" placeholder="Discount (%)" value={discount} onChange={(e) => setDiscount(e.target.value)} />
      </div>
      {final_price !== null && saved !== null && (
        <div className="p-4 rounded-xl bg-success/10 space-y-1 text-center">
          <p className="text-sm text-muted-foreground">You save</p>
          <p className="text-2xl font-bold text-success">${saved.toFixed(2)}</p>
          <p className="text-sm">Final price: <span className="font-semibold">${final_price.toFixed(2)}</span></p>
        </div>
      )}
    </div>
  );
};

export default DiscountCalculator;
