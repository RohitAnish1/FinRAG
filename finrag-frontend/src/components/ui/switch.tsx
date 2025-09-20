import React from "react";

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked = false, onChange, className }) => {
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? "bg-primary" : "bg-muted"} ${className || ""}`}
      aria-checked={checked}
      onClick={() => onChange && onChange(!checked)}
      role="switch"
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`}
      />
    </button>
  );
};