import { Button } from "./Button";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";

interface EmptyStateProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Layered illustration: a jelly "stash jar" collecting coins with two drifting
 * receipt cards, floating rupee coins and sparkles. Pure CSS depth that reads
 * like a native Apple empty state. Coin colors follow the category palette.
 */
function EmptyArtwork({ icon }: { icon: IconName }) {
  return (
    <div aria-hidden className="relative mb-8 h-44 w-48 select-none">
      {/* Soft glow */}
      <div className="absolute left-1/2 top-1/2 h-32 w-40 -translate-x-1/2 -translate-y-1/2 rounded-[48px] bg-accent-soft blur-2xl" />

      {/* Back receipt — left tilt */}
      <div className="absolute left-1/2 top-1/2 w-32 -translate-x-[61%] -translate-y-1/2 rotate-[-8deg] animate-float-slow rounded-ioscard border border-card-stroke bg-card p-3 shadow-card">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-accent-soft text-accent">
            <Icon name="receipt" size={15} weight="fill" />
          </span>
          <span className="flex-1 space-y-1.5">
            <span className="block h-2 w-4/5 rounded-full bg-bg-quaternary" />
            <span className="block h-2 w-1/2 rounded-full bg-bg-quaternary" />
          </span>
        </div>
      </div>

      {/* Back receipt — right tilt */}
      <div className="absolute left-1/2 top-1/2 w-28 -translate-x-[39%] -translate-y-1/2 rotate-[8deg] animate-float rounded-ioscard border border-card-stroke bg-card p-3 shadow-card">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-accent-soft text-accent">
            <Icon name="receipt" size={15} weight="fill" />
          </span>
          <span className="flex-1 space-y-1.5">
            <span className="block h-2 w-3/5 rounded-full bg-bg-quaternary" />
            <span className="block h-2 w-2/3 rounded-full bg-bg-quaternary" />
          </span>
        </div>
      </div>

      {/* The jar — raised coin stack */}
      <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-[28px] border border-card-stroke bg-card shadow-elevated">
        <div className="flex items-end justify-center">
          <CoinRise />
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-accent-soft text-accent">
          <Icon name={icon} size={18} weight="fill" />
        </span>
      </div>

      {/* Floating coins */}
      <span className="absolute left-1/2 top-1/2 -translate-x-[150%] -translate-y-[150%] animate-float rounded-full text-[var(--cat-food)]">
        <Icon name="coin" size={26} weight="fill" />
      </span>
      <span className="absolute left-1/2 top-1/2 translate-x-[55%] -translate-y-[190%] animate-float-slow rounded-full text-[var(--cat-success)]">
        <Icon name="coin" size={18} weight="fill" />
      </span>

      {/* Sparkle */}
      <span className="animate-float-slow absolute right-[12%] top-[8%] text-accent">
        <Icon name="sparkle" size={16} weight="fill" />
      </span>
      <span className="animate-float absolute left-[8%] bottom-[10%] text-[var(--cat-other)]">
        <Icon name="sparkle" size={12} weight="fill" />
      </span>
    </div>
  );
}

/** Three stacked ₹ coins rendered in the category palette. */
function CoinRise() {
  const coins = [
    { color: "var(--cat-food)", offset: "-16px", delay: "0s" },
    { color: "var(--cat-success)", offset: "-7px", delay: "0.12s" },
    { color: "var(--cat-accent)", offset: "1px", delay: "0.24s" },
  ];
  return (
    <div className="relative h-7 w-9">
      {coins.map((c, i) => (
        <span
          key={i}
          className="absolute bottom-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/40 text-[10px] font-bold text-white shadow-card animate-float"
          style={{ backgroundColor: c.color, left: "50%", marginLeft: "-14px", marginBottom: c.offset, animationDelay: c.delay }}
        >
          ₹
        </span>
      ))}
    </div>
  );
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