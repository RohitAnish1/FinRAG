import React from "react";
import { cn } from "../../lib/utils";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, children, className }) => {
  return (
    <>
      {open && (
        <div className={cn("fixed inset-0 z-50 bg-black bg-opacity-40", className)}>
          <div className="fixed inset-0 flex">
            <div
              className="flex-1 bg-black opacity-40"
              onClick={() => onOpenChange(false)}
              aria-hidden="true"
            />
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export const SheetTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

interface SheetContentProps {
  side?: "left" | "right" | "top" | "bottom";
  className?: string;
  children: React.ReactNode;
}

export const SheetContent: React.FC<SheetContentProps> = ({ side = "left", className, children }) => {
  const sideClasses = {
    left: "translate-x-0 left-0",
    right: "translate-x-0 right-0",
    top: "translate-y-0 top-0",
    bottom: "translate-y-0 bottom-0",
  };

  return (
    <div
      className={cn(
        "fixed z-50 bg-white shadow-lg transition-transform transform h-full w-64",
        sideClasses[side],
        className
      )}
    >
      {children}
    </div>
  );
};