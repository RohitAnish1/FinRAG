import React from "react";

interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ value, onChange, children, className }) => {
  return <div className={className}>{children}</div>;
};

export const SelectTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <button type="button" className={`border rounded px-3 py-2 w-full text-left bg-card ${className || ""}`}>{children}</button>
);

export const SelectValue: React.FC<{ placeholder?: string; children?: React.ReactNode }> = ({ placeholder, children }) => (
  <span className="text-muted-foreground">{children || placeholder}</span>
);

export const SelectContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`mt-1 border rounded bg-card shadow-lg ${className || ""}`}>{children}</div>
);

export const SelectItem: React.FC<{ value: string; children: React.ReactNode; onSelect?: (value: string) => void }> = ({ value, children, onSelect }) => (
  <div
    className="px-3 py-2 cursor-pointer hover:bg-muted"
    onClick={() => onSelect && onSelect(value)}
    role="option"
    aria-selected={false}
  >
    {children}
  </div>
);