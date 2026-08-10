import { Button } from "./Button";
import { EmptyArtwork } from "./EmptyArtwork";
import type { IconName } from "./Icon";

interface EmptyStateProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-8 py-14 text-center">
      <EmptyArtwork icon={icon} />
      <h2 className="text-title-2 font-semibold">{title}</h2>
      {subtitle ? (
        <p className="mt-2 max-w-[260px] text-footnote leading-relaxed text-label-secondary">{subtitle}</p>
      ) : null}
      {actionLabel && onAction ? (
        <div className="mt-6">
          <Button onClick={onAction} icon="plus">
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   LEGACY JAR ARTWORK — commented out for easy rollback.
   To restore: delete ./EmptyArtwork import, uncomment the jar code below,
   and point EmptyState at the local EmptyArtwork again.
---------------------------------------------------------------------------- */
// import { Icon } from "./Icon";
// import type { IconName } from "./Icon";
//
// function EmptyArtwork({ icon }: { icon: IconName }) { ... }
// function CoinRise() { ... }