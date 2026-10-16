import {
  AlarmClock,
  BadgeCheck,
  CalendarHeart,
  Clock,
  Crown,
  Compass,
  Filter,
  Flame,
  Flower2,
  Gem,
  Heart,
  ListChecks,
  NotebookPen,
  Palette,
  Snowflake,
  Sparkles,
  Sprout,
  Store,
  Tag,
  Target,
  Ticket,
  TrendingUp,
  UsersRound,
} from "lucide-react";

/**
 * The icon vocabulary of the app, in one place. Soft, organic shapes (flowers,
 * sprouts, gems, hearts) keep the interface warm. To restyle the icons, change
 * this map: every screen reads from it.
 */
export const crmIcons = {
  // Main navigation
  dashboard: Sparkles,
  contacts: Heart,
  companies: Store,
  deals: Gem,
  tasks: ListChecks,
  notes: NotebookPen,
  tags: Tag,
  // Dashboard sections
  sales: Gem,
  leads: Sprout,
  team: UsersRound,
  clients: Heart,
  activity: Clock,
  calendar: CalendarHeart,
  tour: Compass,
  // Dashboard figures and charts
  conversion: Target,
  ticket: Ticket,
  overdue: AlarmClock,
  trend: TrendingUp,
  funnel: Filter,
  procedures: Flower2,
  ranking: Crown,
  followUp: BadgeCheck,
  hot: Flame,
  cooling: Snowflake,
  appearance: Palette,
} as const;

export type CrmIconName = keyof typeof crmIcons;
