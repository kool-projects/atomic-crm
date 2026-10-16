import { render } from "vitest-browser-react";

import { AnimatedNumber } from "./AnimatedNumber";

describe("AnimatedNumber", () => {
  it("ends on the final value once the count is over", async () => {
    const screen = await render(
      <AnimatedNumber value={42} format={(n) => `${Math.round(n)} sales`} />,
    );

    await expect
      .element(screen.getByText("42 sales"), { timeout: 3000 })
      .toBeVisible();
  });

  it("counts again towards a new value", async () => {
    const screen = await render(
      <AnimatedNumber value={10} format={(n) => `${Math.round(n)} leads`} />,
    );
    await expect
      .element(screen.getByText("10 leads"), { timeout: 3000 })
      .toBeVisible();

    await screen.rerender(
      <AnimatedNumber value={25} format={(n) => `${Math.round(n)} leads`} />,
    );

    await expect
      .element(screen.getByText("25 leads"), { timeout: 3000 })
      .toBeVisible();
  });
});
