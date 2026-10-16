import { useEffect, useLayoutEffect } from "react";

/**
 * A color scheme is two picked colors. Every theme token is derived from their
 * hue and chroma at fixed lightness steps, so contrast holds for any pick.
 */
export interface ColorScheme {
  /** Buttons, links, focus ring. Also tints the dark surfaces. */
  accent: string;
  /** Warm or cool base tone for the light surfaces and the text. */
  neutral: string;
}

export interface ColorPreset {
  id: string;
  label: string;
  scheme: ColorScheme;
}

export const colorPresets: ColorPreset[] = [
  {
    id: "aurora",
    label: "Aurora",
    scheme: { accent: "#c9a8f0", neutral: "#e9dcc3" },
  },
  {
    id: "ocean",
    label: "Ocean",
    scheme: { accent: "#7eb6e8", neutral: "#e8dfd0" },
  },
  {
    id: "forest",
    label: "Forest",
    scheme: { accent: "#8cc9a0", neutral: "#e6e2cc" },
  },
  {
    id: "rose",
    label: "Rose",
    scheme: { accent: "#eba3b8", neutral: "#f0ddd0" },
  },
  {
    id: "graphite",
    label: "Graphite",
    scheme: { accent: "#a8b0c0", neutral: "#d9d6d0" },
  },
];

export const defaultColorScheme: ColorScheme = colorPresets[0].scheme;

const STYLE_ELEMENT_ID = "crm-color-scheme";
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const srgbToLinear = (channel: number) =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

/** Hex "#rrggbb" to OKLCH (lightness 0-1, chroma, hue in degrees). */
export const hexToOklch = (hex: string) => {
  const value = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map(
    (channel) => srgbToLinear(channel / 255),
  );
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bAxis = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return {
    lightness,
    chroma: Math.hypot(a, bAxis),
    hue: ((Math.atan2(bAxis, a) * 180) / Math.PI + 360) % 360,
  };
};

const sanitizeScheme = (scheme?: Partial<ColorScheme>): ColorScheme => ({
  accent: HEX_COLOR.test(scheme?.accent ?? "")
    ? scheme!.accent!
    : defaultColorScheme.accent,
  neutral: HEX_COLOR.test(scheme?.neutral ?? "")
    ? scheme!.neutral!
    : defaultColorScheme.neutral,
});

const round = (value: number) => Math.round(value * 1000) / 1000;
const wrapHue = (hue: number) => round(((hue % 360) + 360) % 360);

type Tokens = Record<string, string>;

const buildTokens = (scheme: ColorScheme) => {
  const accent = hexToOklch(scheme.accent);
  const neutral = hexToOklch(scheme.neutral);
  const ha = wrapHue(accent.hue);
  const hn = wrapHue(neutral.hue);
  // Grey picks carry no meaningful hue: fade the tint instead of showing noise.
  const accentTint = Math.min(1, accent.chroma / 0.04);
  const neutralTint = Math.min(1, neutral.chroma / 0.02);
  const ca = round(clamp(accent.chroma, 0, 0.16));
  const a = (lightness: number, chroma: number, alpha?: number) =>
    `oklch(${lightness} ${round(chroma * accentTint)} ${ha}${alpha ? ` / ${alpha}%` : ""})`;
  const n = (lightness: number, chroma: number, alpha?: number) =>
    `oklch(${lightness} ${round(chroma * neutralTint)} ${hn}${alpha ? ` / ${alpha}%` : ""})`;
  const hue = (offset: number) => wrapHue(ha + offset);

  const light: Tokens = {
    background: n(0.975, 0.012),
    foreground: a(0.22, 0.04),
    card: n(0.99, 0.008),
    "card-foreground": a(0.22, 0.04),
    popover: n(0.99, 0.008),
    "popover-foreground": a(0.22, 0.04),
    primary: `oklch(0.45 ${ca} ${ha})`,
    "primary-foreground": n(0.98, 0.01),
    secondary: n(0.94, 0.02),
    "secondary-foreground": a(0.28, 0.05),
    muted: n(0.94, 0.02),
    "muted-foreground": a(0.48, 0.04),
    accent: a(0.92, 0.04),
    "accent-foreground": a(0.28, 0.06),
    border: n(0.88, 0.03),
    input: n(0.88, 0.03),
    ring: `oklch(0.6 ${ca} ${ha})`,
    "chart-1": `oklch(0.55 ${ca} ${ha})`,
    "chart-2": n(0.72, 0.09),
    "chart-3": `oklch(0.5 0.12 ${hue(30)})`,
    "chart-4": `oklch(0.6 0.1 ${hue(-50)})`,
    "chart-5": `oklch(0.68 0.11 ${wrapHue(hn - 30)})`,
    sidebar: n(0.96, 0.015),
    "sidebar-foreground": a(0.22, 0.04),
    "sidebar-primary": `oklch(0.45 ${ca} ${ha})`,
    "sidebar-primary-foreground": n(0.98, 0.01),
    "sidebar-accent": a(0.92, 0.04),
    "sidebar-accent-foreground": a(0.28, 0.06),
    "sidebar-border": n(0.88, 0.03),
    "sidebar-ring": `oklch(0.6 ${ca} ${ha})`,
  };

  const dark: Tokens = {
    background: a(0.17, 0.025),
    foreground: n(0.95, 0.015),
    card: a(0.21, 0.03),
    "card-foreground": n(0.95, 0.015),
    popover: a(0.21, 0.03),
    "popover-foreground": n(0.95, 0.015),
    primary: `oklch(0.78 ${ca} ${ha})`,
    "primary-foreground": a(0.18, 0.03),
    secondary: a(0.28, 0.035),
    "secondary-foreground": n(0.92, 0.03),
    muted: a(0.27, 0.03),
    "muted-foreground": n(0.75, 0.03),
    accent: a(0.32, 0.04),
    "accent-foreground": n(0.95, 0.02),
    border: n(0.85, 0.04, 18),
    input: n(0.85, 0.04, 22),
    ring: `oklch(0.72 ${ca} ${ha})`,
    "chart-1": `oklch(0.75 ${ca} ${ha})`,
    "chart-2": n(0.82, 0.08),
    "chart-3": `oklch(0.68 0.12 ${hue(30)})`,
    "chart-4": `oklch(0.72 0.09 ${hue(-50)})`,
    "chart-5": `oklch(0.78 0.1 ${wrapHue(hn - 30)})`,
    sidebar: a(0.21, 0.03),
    "sidebar-foreground": n(0.95, 0.015),
    "sidebar-primary": `oklch(0.78 ${ca} ${ha})`,
    "sidebar-primary-foreground": a(0.18, 0.03),
    "sidebar-accent": a(0.32, 0.04),
    "sidebar-accent-foreground": n(0.95, 0.02),
    "sidebar-border": n(0.85, 0.04, 14),
    "sidebar-ring": `oklch(0.72 ${ca} ${ha})`,
  };

  return { light, dark };
};

const toDeclarations = (tokens: Tokens) =>
  Object.entries(tokens)
    .map(([name, value]) => `--${name}: ${value};`)
    .join(" ");

/** CSS that overrides the theme tokens of src/index.css for both modes. */
export const buildColorSchemeCss = (scheme?: Partial<ColorScheme>) => {
  const { light, dark } = buildTokens(sanitizeScheme(scheme));
  return `:root { ${toDeclarations(light)} }\n.dark { ${toDeclarations(dark)} }`;
};

const writeColorSchemeCss = (css: string) => {
  let element = document.getElementById(
    STYLE_ELEMENT_ID,
  ) as HTMLStyleElement | null;
  if (!element) {
    element = document.createElement("style");
    element.id = STYLE_ELEMENT_ID;
    document.head.appendChild(element);
  }
  element.textContent = css;
};

/** Apply the saved scheme to the whole app (login pages included). */
export const useApplyColorScheme = (scheme?: Partial<ColorScheme>) => {
  const css = buildColorSchemeCss(scheme);
  useLayoutEffect(() => {
    writeColorSchemeCss(css);
  }, [css]);
};

/** Show a not-yet-saved scheme, then put the saved one back on leave. */
export const useColorSchemePreview = (
  preview: Partial<ColorScheme> | undefined,
  saved: Partial<ColorScheme> | undefined,
) => {
  const previewCss = buildColorSchemeCss(preview);
  const savedCss = buildColorSchemeCss(saved);
  useEffect(() => {
    writeColorSchemeCss(previewCss);
    return () => writeColorSchemeCss(savedCss);
  }, [previewCss, savedCss]);
};
