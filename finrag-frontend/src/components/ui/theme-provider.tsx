import React, { createContext, useEffect } from "react";

interface ThemeProviderProps {
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  children: React.ReactNode;
}

const ThemeContext = createContext({});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // You can add theme logic here if needed
  useEffect(() => {
    // Example: set a default theme class on body
    document.body.classList.add("bg-background");
    return () => {
      document.body.classList.remove("bg-background");
    };
  }, []);
  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
};