import {
  AirplaneTilt,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  Briefcase,
  Calendar,
  CaretDown,
  CaretLeft,
  CaretRight,
  ChartBar,
  ChartLineUp,
  ChartPieSlice,
  Check,
  CheckCircle,
  Clock,
  Coin,
  Coins,
  DotsThree,
  FilmSlate,
  ForkKnife,
  GraduationCap,
  Heartbeat,
  House,
  Info,
  MagnifyingGlass,
  PencilSimple,
  PiggyBank,
  Plus,
  Receipt,
  ShoppingBag,
  Sparkle,
  Stack,
  SunDim,
  TrashSimple,
  TrendDown,
  TrendUp,
  Wallet,
  X,
} from "@phosphor-icons/react";
import type { Icon as PhosphorIcon, IconProps as PhosphorIconProps, IconWeight } from "@phosphor-icons/react";

export type IconName =
  | "house"
  | "chart"
  | "chartLine"
  | "chartPie"
  | "plus"
  | "chevronRight"
  | "chevronLeft"
  | "chevronDown"
  | "xmark"
  | "mag"
  | "trash"
  | "pencil"
  | "calendar"
  | "checkmark"
  | "checkmarkCircle"
  | "info"
  | "food"
  | "travel"
  | "shopping"
  | "bills"
  | "receipt"
  | "health"
  | "entertainment"
  | "education"
  | "work"
  | "other"
  | "coin"
  | "coins"
  | "sparkle"
  | "wallet"
  | "piggyBank"
  | "arrowUpRight"
  | "arrowDown"
  | "arrowUp"
  | "arrowLeft"
  | "trendUp"
  | "trendDown"
  | "sunDim"
  | "clock"
  | "stack"
  | "dotsThree";

const ICONS: Record<Exclude<IconName, "other">, PhosphorIcon> = {
  house: House,
  chart: ChartBar,
  chartLine: ChartLineUp,
  chartPie: ChartPieSlice,
  plus: Plus,
  chevronRight: CaretRight,
  chevronLeft: CaretLeft,
  chevronDown: CaretDown,
  xmark: X,
  mag: MagnifyingGlass,
  trash: TrashSimple,
  pencil: PencilSimple,
  calendar: Calendar,
  checkmark: Check,
  checkmarkCircle: CheckCircle,
  info: Info,
  food: ForkKnife,
  travel: AirplaneTilt,
  shopping: ShoppingBag,
  bills: Receipt,
  receipt: Receipt,
  health: Heartbeat,
  entertainment: FilmSlate,
  education: GraduationCap,
  work: Briefcase,
  coin: Coin,
  coins: Coins,
  sparkle: Sparkle,
  wallet: Wallet,
  piggyBank: PiggyBank,
  arrowUpRight: ArrowUpRight,
  arrowDown: ArrowDown,
  arrowUp: ArrowUp,
  arrowLeft: ArrowLeft,
  trendUp: TrendUp,
  trendDown: TrendDown,
  sunDim: SunDim,
  clock: Clock,
  stack: Stack,
  dotsThree: DotsThree,
};

/** Map the previous stroke-weight API onto Phosphor's discrete weights. */
function weightFor(strokeWidth?: number): IconWeight {
  if (strokeWidth == null) return "regular";
  if (strokeWidth >= 2.2) return "bold";
  if (strokeWidth <= 1.4) return "thin";
  return "regular";
}

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  /** Explicit Phosphor weight — overrides the strokeWidth mapping. */
  weight?: IconWeight;
  title?: string;
}

export function Icon({ name, size = 22, className, strokeWidth = 1.7, weight, title }: IconProps) {
  const Glyph = ICONS[name as Exclude<IconName, "other">] ?? DotsThree;
  const props: PhosphorIconProps = {
    size,
    weight: weight ?? weightFor(strokeWidth),
    className,
  };
  return <Glyph {...props} alt={title} />;
}