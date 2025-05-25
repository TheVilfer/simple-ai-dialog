"use client";

import { Moon, Sun, Laptop } from "lucide-react";
import { useState, useEffect } from "react";

import { useTheme } from "@/lib/providers/theme-provider";

import { Button } from "./button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering once the component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="w-8 h-8 sm:w-9 sm:h-9 opacity-0" />;
  }

  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      <Button
        variant={theme === "light" ? "default" : "ghost"}
        size="icon"
        onClick={() => setTheme("light")}
        title="Light Mode"
        className="w-8 h-8 sm:w-9 sm:h-9"
      >
        <Sun className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="sr-only">Light Mode</span>
      </Button>

      <Button
        variant={theme === "dark" ? "default" : "ghost"}
        size="icon"
        onClick={() => setTheme("dark")}
        title="Dark Mode"
        className="w-8 h-8 sm:w-9 sm:h-9"
      >
        <Moon className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="sr-only">Dark Mode</span>
      </Button>

      <Button
        variant={theme === "system" ? "default" : "ghost"}
        size="icon"
        onClick={() => setTheme("system")}
        title="System Theme"
        className="w-8 h-8 sm:w-9 sm:h-9"
      >
        <Laptop className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="sr-only">System Theme</span>
      </Button>
    </div>
  );
}

// Simple toggle version with dropdown menu
export function ThemeToggleSimple() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="w-8 h-8 sm:w-9 sm:h-9 opacity-0" />;
  }

  // Determine which icon to show based on the current theme
  let Icon = Sun;
  if (theme === "dark") {
    Icon = Moon;
  } else if (theme === "system") {
    Icon = Laptop;
  }

  // Toggle between themes in sequence: light -> dark -> system -> light
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-8 h-8 sm:w-9 sm:h-9"
      title={`Current: ${theme} theme. Click to toggle.`}
    >
      <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
} 