import type { CategoryId } from "../../types/expense";
import { getCategory } from "../../lib/categories";
import { Icon } from "../ui/Icon";
import type { IconName } from "../ui/Icon";

interface CategoryTileProps {
  category?: CategoryId;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TILE_CLASS: Record<"sm" | "md" | "lg", string> = {
  sm: "h-8 w-8 rounded-[10px]",
  md: "h-10 w-10 rounded-iosgroup",
  lg: "h-12 w-12 rounded-[14px]",
};

const ICON_SIZE: Record<"sm" | "md" | "lg", number> = { sm: 15, md: 19, lg: 22 };

/** Colored iOS-style squircle tile carrying the category glyph. */
export function CategoryTile({ category, size = "md", className = "" }: CategoryTileProps) {
  const meta = getCategory(category);
  return (
    <span
      className={`inline-flex items-center justify-center text-white shadow-card ${TILE_CLASS[size]} ${className}`}
      style={{ backgroundColor: `var(${meta.colorVar})` }}
      aria-hidden
    >
      <Icon name={meta.icon as IconName} size={ICON_SIZE[size]} weight="fill" />
    </span>
  );
}