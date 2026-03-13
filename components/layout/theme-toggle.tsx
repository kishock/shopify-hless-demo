"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme-preference";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme =
      window.localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
    setTheme(storedTheme);
    applyTheme(storedTheme);
    setMounted(true);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={mounted ? `Switch to ${nextTheme} mode` : "Toggle theme"}
      title={mounted ? `Switch to ${nextTheme} mode` : "Toggle theme"}
      onClick={() => {
        const updatedTheme = theme === "dark" ? "light" : "dark";
        setTheme(updatedTheme);
        window.localStorage.setItem(STORAGE_KEY, updatedTheme);
        applyTheme(updatedTheme);
      }}
      className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 bg-white text-black transition-colors hover:border-neutral-300 dark:border-neutral-600 dark:bg-zinc-800 dark:text-neutral-100 dark:hover:border-neutral-500"
    >
      {mounted && theme === "dark" ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
}
