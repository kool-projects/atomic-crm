import type { Store } from "ra-core";
import { useEffect, useState } from "react";

import type { ColorScheme } from "./colorScheme";
import { CONFIGURATION_STORE_KEY } from "./ConfigurationContext";

/**
 * Follow the color scheme kept in the configuration store. Used above the
 * admin context so the login pages get the client colors too.
 */
export const useStoredColorScheme = (
  store: Store,
  fallback: ColorScheme,
): ColorScheme => {
  const [scheme, setScheme] = useState<ColorScheme | undefined>(
    () => store.getItem(CONFIGURATION_STORE_KEY)?.colorScheme,
  );

  useEffect(
    () =>
      store.subscribe(CONFIGURATION_STORE_KEY, (value) =>
        setScheme(value?.colorScheme),
      ),
    [store],
  );

  return scheme ?? fallback;
};
