import { useInput, useTranslate } from "ra-core";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

import {
  colorPresets,
  defaultColorScheme,
  useColorSchemePreview,
  type ColorScheme,
} from "../root/colorScheme";
import { useConfigurationContext } from "../root/ConfigurationContext";

const COLOR_INPUT_CLASS =
  "w-9 h-9 shrink-0 cursor-pointer appearance-none rounded border bg-transparent p-0.5 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:rounded-sm [&::-moz-color-swatch]:border-none";

const sameColor = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

const ColorField = ({
  source,
  label,
}: {
  source: "colorScheme.accent" | "colorScheme.neutral";
  label: string;
}) => {
  const { field } = useInput({ source });
  const value: string = field.value || "#000000";
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="color"
        {...field}
        value={value}
        className={COLOR_INPUT_CLASS}
      />
      <span className="flex flex-col leading-tight">
        <span>{label}</span>
        <span className="font-mono text-xs text-muted-foreground uppercase">
          {value}
        </span>
      </span>
    </label>
  );
};

/** Presets plus two color pickers. The whole app previews live while editing. */
export const ColorSchemePanel = () => {
  const translate = useTranslate();
  const { watch, setValue } = useFormContext();
  const saved = useConfigurationContext().colorScheme;

  const scheme: ColorScheme = {
    accent: watch("colorScheme.accent") ?? defaultColorScheme.accent,
    neutral: watch("colorScheme.neutral") ?? defaultColorScheme.neutral,
  };

  useColorSchemePreview(scheme, saved);

  const applyPreset = (preset: ColorScheme) => {
    setValue("colorScheme.accent", preset.accent, { shouldDirty: true });
    setValue("colorScheme.neutral", preset.neutral, { shouldDirty: true });
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-medium text-muted-foreground">
          {translate("crm.settings.color_scheme.title")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {translate("crm.settings.color_scheme.help")}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {colorPresets.map((preset) => {
          const isSelected =
            sameColor(preset.scheme.accent, scheme.accent) &&
            sameColor(preset.scheme.neutral, scheme.neutral);
          return (
            <button
              key={preset.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => applyPreset(preset.scheme)}
              className={cn(
                "flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted",
                isSelected && "border-primary ring-2 ring-primary/40",
              )}
            >
              <span className="flex -space-x-1">
                <span
                  className="size-4 rounded-full border"
                  style={{ backgroundColor: preset.scheme.accent }}
                />
                <span
                  className="size-4 rounded-full border"
                  style={{ backgroundColor: preset.scheme.neutral }}
                />
              </span>
              {preset.label}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-8">
        <ColorField
          source="colorScheme.accent"
          label={translate("crm.settings.color_scheme.accent")}
        />
        <ColorField
          source="colorScheme.neutral"
          label={translate("crm.settings.color_scheme.neutral")}
        />
      </div>
    </div>
  );
};
