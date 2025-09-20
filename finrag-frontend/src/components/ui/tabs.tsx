import React, { useState } from "react";

interface TabsProps {
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, className, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue || "");
  return (
    <div className={className}> {
      React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === TabsList) {
          return React.cloneElement(child as React.ReactElement<any>, { activeTab, setActiveTab });
        }
        if (React.isValidElement(child) && child.type === TabsContent) {
          return activeTab === (child.props as any).value ? child : null;
        }
        return child;
      })
    } </div>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, activeTab, setActiveTab, className }) => (
  <div className={`flex gap-2 ${className || ""}`}>{
    React.Children.map(children, child => {
      if (React.isValidElement(child) && child.type === TabsTrigger) {
        return React.cloneElement(child as React.ReactElement<TabsTriggerProps>, { activeTab, setActiveTab });
      }
      return child;
    })
  }</div>
);

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, activeTab, setActiveTab, className }) => (
  <button
    type="button"
    className={`px-4 py-2 rounded ${activeTab === value ? "bg-primary text-white" : "bg-muted text-foreground"} ${className || ""}`}
    onClick={() => setActiveTab && setActiveTab(value)}
  >
    {children}
  </button>
);

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ children, className }) => (
  <div className={className}>{children}</div>
);