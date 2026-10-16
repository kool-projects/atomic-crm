import { useTranslate } from "ra-core";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ALL_SALES, type SalespersonOption } from "./useSalesScope";

/** "Everyone", then one entry per salesperson. Only admins get to see it. */
export const SalespersonSelect = ({
  value,
  onChange,
  salespeople,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  salespeople: SalespersonOption[];
  className?: string;
}) => {
  const translate = useTranslate();
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={className}
        aria-label={translate("crm.dashboard.filters.salesperson")}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_SALES}>
          {translate("crm.dashboard.filters.everyone")}
        </SelectItem>
        {salespeople.map((person) => (
          <SelectItem key={String(person.id)} value={String(person.id)}>
            {person.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
