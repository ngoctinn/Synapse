"use client";

import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { CreditCard, Wallet } from "lucide-react";

interface PaymentMethodsProps {
  value: string;
  onChange: (value: "COD" | "ONLINE") => void;
}

export const PaymentMethods = ({ value, onChange }: PaymentMethodsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Phương thức thanh toán</h3>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as "COD" | "ONLINE")}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div>
          <RadioGroupItem value="COD" id="cod" className="peer sr-only" />
          <Label
            htmlFor="cod"
            className="selection-card-ring"
          >
            <Wallet className="mb-3 h-6 w-6" />
            Thanh toán tại quầy
          </Label>
        </div>

        <div>
          <RadioGroupItem value="ONLINE" id="online" className="peer sr-only" />
          <Label
            htmlFor="online"
            className="selection-card-ring"
          >
            <CreditCard className="mb-3 h-6 w-6" />
            Chuyển khoản ngân hàng
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
