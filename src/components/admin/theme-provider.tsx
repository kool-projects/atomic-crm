import { useCallback, useLayoutEffect, useState } from "react";

import { ThemeProviderContext, type Theme } from "./theme-context";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

const THEMES: Theme[] = ["dark", "light", "system"];

const readStoredTheme = (storageKey: string): Theme | undefined => {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return THEMES.includes(stored as Theme) ? (stored as Theme) : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Theme provider that enables light, dark, and system theme modes.
 *
 * The choice is kept in localStorage on its own key, not in the admin store:
 * the store is wiped on logout and is in memory in demo mode, which would
 * silently bring the default theme back.
 *
 * @internal
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "crm-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => readStoredTheme(storageKey) ?? defaultTheme,
  );

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // Storage blocked (private mode): the choice lasts for this session.
      }
    },
    [storageKey],
  );

  useLayoutEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
