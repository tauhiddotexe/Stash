import { Icon } from "./Icon";
import type { IconName } from "./Icon";

interface EmptyArtworkProps {
  icon: IconName;
}

/**
 * Hand-drawn wallet illustration in a DrawKit-inspired style.
 * Wallet + floating coins + card. Uses the category palette so it feels
 * native to Stash. Fully theme-aware via currentColor + palette vars.
 */
export function EmptyArtwork({ icon }: EmptyArtworkProps) {
  return (
    <div aria-hidden className="relative mb-8 h-44 w-52 select-none">
      {/* Soft glow */}
      <div className="absolute left-1/2 top-1/2 h-28 w-36 -translate-x-1/2 -translate-y-1/2 rounded-[48px] bg-accent-soft blur-2xl" />

      {/* Floating coin — left, food orange */}
      <span className="animate-float absolute left-1 top-3 text-[var(--cat-food)]">
        <Icon name="coin" size={28} weight="fill" />
      </span>

      {/* Floating coin — right, success green */}
      <span className="animate-float-slow absolute right-2 top-1 text-[var(--cat-success)]">
        <Icon name="coin" size={20} weight="fill" />
      </span>

      {/* Card sticking out — shopping pink, tilted */}
      <div className="animate-float absolute left-6 top-6 w-20 rotate-[-12deg] rounded-[10px] border border-card-stroke bg-[var(--cat-shopping)] p-2 shadow-card">
        <div className="h-1.5 w-6 rounded-full bg-white/40" />
        <div className="mt-2 h-1 w-full rounded-full bg-white/25" />
        <div className="mt-1 h-1 w-3/4 rounded-full bg-white/25" />
      </div>

      {/* The wallet body */}
      <svg
        viewBox="0 0 160 120"
        className="absolute left-1/2 top-8 w-40 -translate-x-1/2 drop-shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
        fill="none"
      >
        <defs>
          <linearGradient id="wallet-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--accent-strong)" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Wallet body */}
        <rect x="8" y="28" width="144" height="84" rx="16" fill="url(#wallet-body)" />
        {/* Stitch line */}
        <path
          d="M24 42 Q32 38 40 42 T56 42 T72 42 T88 42 T104 42 T120 42 T136 42"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
          fill="none"
        />
        {/* Flap */}
        <path
          d="M8 52 L8 44 Q8 28 24 28 L136 28 Q152 28 152 44 L152 52 Q132 64 80 64 Q28 64 8 52 Z"
          fill="var(--accent-strong)"
          opacity="0.55"
        />
        {/* Flap edge highlight */}
        <path
          d="M8 52 Q28 64 80 64 Q132 64 152 52"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Clasp / button */}
        <circle cx="80" cy="58" r="6" fill="rgba(255,255,255,0.4)" />
        <circle cx="80" cy="58" r="3" fill="rgba(255,255,255,0.7)" />
        {/* Icon pocket */}
        <rect x="60" y="78" width="40" height="22" rx="8" fill="rgba(255,255,255,0.18)" />
      </svg>

      {/* Category icon badge on wallet */}
      <span className="absolute left-1/2 top-[60px] flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-[11px] bg-white/85 text-accent shadow-card">
        <Icon name={icon} size={18} weight="fill" />
      </span>

      {/* Sparkle — top right */}
      <span className="animate-float-slow absolute right-6 top-0 text-accent">
        <Icon name="sparkle" size={14} weight="fill" />
      </span>
      {/* Sparkle — bottom left */}
      <span className="animate-float absolute left-3 bottom-2 text-[var(--cat-travel)]">
        <Icon name="sparkle" size={11} weight="fill" />
      </span>
    </div>
  );
}
