import { Icon } from "./Icon";

export type ToastTone = "success" | "danger" | "info";

export interface ToastViewProps {
  message: string;
  tone: ToastTone;
}

const TONES: Record<ToastTone, string> = {
  success: "text-success",
  danger: "text-danger",
  info: "text-accent",
};

const ICONS: Record<ToastTone, "checkmark" | "info"> = {
  success: "checkmark",
  danger: "info",
  info: "info",
};

export function ToastView({ message, tone }: ToastViewProps) {
  return (
    <div
      role="status"
      className={[
        "animate-toast-in flex items-center gap-2 rounded-full px-4 h-11",
        "bg-label text-bg-primary",
        "shadow-elevated",
      ].join(" ")}
    >
      <Icon name={ICONS[tone]} size={16} strokeWidth={2.4} className={`${TONES[tone]}`} />
      <span className="text-footnote font-medium">{message}</span>
    </div>
  );
}