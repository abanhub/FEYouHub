import * as React from "react";

type Props = {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
};

export const Switch = ({ checked, onCheckedChange, className = "" }: Props) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        checked ? "bg-brand-orange" : "bg-gray-700"
      } ${className}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
          checked ? "translate-x-4" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default Switch;

