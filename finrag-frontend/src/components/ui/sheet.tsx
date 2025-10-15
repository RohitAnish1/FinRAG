import React from "react";
import { cn } from "../../lib/utils";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, children, className }) => {
  if (!open) return null;
  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40", className)}>
      <div className="bg-white rounded-lg shadow-lg p-6 relative min-w-[300px] max-w-lg w-full">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => onOpenChange(false)}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export const SheetTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

interface SheetContentProps {
  side?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
  children: React.ReactNode;
}

export const SheetContent: React.FC<SheetContentProps> = ({ className, children }) => {
  // You can add logic for different sides if needed
  return (
    <div className={cn(
      `fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40`,
      className
    )}>
      <div className="bg-white rounded-lg shadow-lg p-6 relative min-w-[300px] max-w-lg w-full">
        {children}
      </div>
    </div>
  );
};