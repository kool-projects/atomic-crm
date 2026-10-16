import { Columns3, Eye, Focus } from "lucide-react";
import { useStore, useTranslate } from "ra-core";

import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { useDealView } from "./useDealView";

/** Board or Focus, and whether cards show their details at all times. */
export const DealViewSwitcher = () => {
  const translate = useTranslate();
  const [view, setView] = useDealView();
  const [showDetails, setShowDetails] = useStore<boolean>(
    "deals.showDetails",
    false,
  );

  return (
    <div className="flex items-center gap-2" data-tour="deal-view-switcher">
      <ToggleGroup
        type="single"
        variant="outline"
        value={view}
        onValueChange={(value) => {
          if (value === "board" || value === "focus") setView(value);
        }}
        aria-label={translate("resources.deals.view.label")}
      >
        <ToggleGroupItem value="board" className="gap-1.5">
          <Columns3 className="size-4" />
          {translate("resources.deals.view.board")}
        </ToggleGroupItem>
        <ToggleGroupItem value="focus" className="gap-1.5">
          <Focus className="size-4" />
          {translate("resources.deals.view.focus")}
        </ToggleGroupItem>
      </ToggleGroup>
      {view === "board" ? (
        <Toggle
          variant="outline"
          pressed={showDetails}
          onPressedChange={setShowDetails}
          className="gap-1.5"
        >
          <Eye className="size-4" />
          {translate("resources.deals.view.show_details")}
        </Toggle>
      ) : null}
    </div>
  );
};
