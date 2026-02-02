import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Topbar } from "./Topbar";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

const THEME_KEY = "flunx-theme";

export type ThemeMode = "light" | "mixed" | "dark";

function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "mixed";
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === "light" || v === "mixed" || v === "dark") return v;
    return "mixed";
  } catch {
    return "mixed";
  }
}

function setStoredTheme(theme: ThemeMode) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isChatPage = location.pathname.startsWith("/chat");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-mixed", "dark");
    if (theme === "light") {
      root.classList.add("theme-light");
    } else if (theme === "mixed") {
      root.classList.add("theme-mixed");
    } else if (theme === "dark") {
      root.classList.add("dark");
    }
  }, [theme]);

  const handleThemeChange = (next: ThemeMode) => {
    setTheme(next);
    setStoredTheme(next);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Full height */}
      <Sidebar isCollapsed={isSidebarCollapsed} />
      
      {/* Main area - Right of sidebar */}
      <div 
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          isSidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <Topbar
          theme={theme}
          onThemeChange={handleThemeChange}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main
          className={cn(
            "flex-1 flex flex-col min-h-0",
            isChatPage ? "p-0 overflow-hidden" : "p-4 lg:p-6"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
