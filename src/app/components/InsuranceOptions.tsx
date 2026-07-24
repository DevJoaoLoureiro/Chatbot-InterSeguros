"use client";

import {
  insuranceOptions,
  type InsuranceType,
} from "@/src/types/chat";

interface InsuranceOptionsProps {
  disabled?: boolean;
  onSelect: (insurance: InsuranceType) => void;
}

export default function InsuranceOptions({
  disabled = false,
  onSelect,
}: InsuranceOptionsProps) {
  return (
    <div className="insurance-options">
      {insuranceOptions.map((insurance) => (
        <button
          key={insurance}
          className="insurance-option"
          type="button"
          disabled={disabled}
          onClick={() => onSelect(insurance)}
        >
          {insurance}
        </button>
      ))}
    </div>
  );
}