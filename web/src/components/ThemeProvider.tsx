"use client";

import { useEffect, type ReactNode } from "react";

type Theme = "system" | "light" | "dark";

function getSystemPreference(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;
  const resolved = theme === "system" ? getSystemPreference() : theme;

  root.classList.remove("dark", "light");
  root.classList.add(resolved);
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Prevent flash of wrong theme by applying immediately on mount
    const stored = localStorage.getItem("theme") as Theme | null;
    const theme: Theme =
      stored && ["system", "light", "dark"].includes(stored)
        ? stored
        : "system";
    applyThemeToDocument(theme);

    // Listen for system preference changes when in "system" mode
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const current = localStorage.getItem("theme") as Theme | null;
      if (!current || current === "system") {
        applyThemeToDocument("system");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return <>{children}</>;
}
