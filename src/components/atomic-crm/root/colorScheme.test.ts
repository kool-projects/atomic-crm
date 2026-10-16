import { describe, expect, it } from "vitest";

import {
  buildColorSchemeCss,
  colorPresets,
  defaultColorScheme,
  hexToOklch,
} from "./colorScheme";

describe("hexToOklch", () => {
  it("maps white to full lightness and no chroma", () => {
    const { lightness, chroma } = hexToOklch("#ffffff");
    expect(lightness).toBeCloseTo(1, 2);
    expect(chroma).toBeCloseTo(0, 2);
  });

  it("maps pure red to a red hue", () => {
    const { hue, chroma } = hexToOklch("#ff0000");
    expect(hue).toBeGreaterThan(20);
    expect(hue).toBeLessThan(40);
    expect(chroma).toBeGreaterThan(0.2);
  });
});

describe("buildColorSchemeCss", () => {
  it("defines every token for both light and dark mode", () => {
    const css = buildColorSchemeCss(defaultColorScheme);
    const [light, dark] = css.split("\n");
    expect(light.startsWith(":root")).toBe(true);
    expect(dark.startsWith(".dark")).toBe(true);
    for (const token of ["--background", "--primary", "--sidebar-ring"]) {
      expect(light).toContain(token);
      expect(dark).toContain(token);
    }
  });

  it("keeps the primary button lightness fixed whatever color is picked", () => {
    const pale = buildColorSchemeCss({ accent: "#ffff99", neutral: "#e9dcc3" });
    const deep = buildColorSchemeCss({ accent: "#220044", neutral: "#e9dcc3" });
    for (const css of [pale, deep]) {
      expect(css).toMatch(/--primary: oklch\(0\.45 /);
      expect(css).toMatch(/--primary: oklch\(0\.78 /);
    }
  });

  it("falls back to the default scheme when a color is not valid hex", () => {
    const css = buildColorSchemeCss({ accent: "lavender", neutral: "" });
    expect(css).toBe(buildColorSchemeCss(defaultColorScheme));
  });

  it("changes the surfaces when the accent hue changes", () => {
    const [lavender, ocean] = [colorPresets[0], colorPresets[1]].map((preset) =>
      buildColorSchemeCss(preset.scheme),
    );
    expect(lavender).not.toBe(ocean);
  });
});
