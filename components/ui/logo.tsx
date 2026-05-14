import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "dark" | "white";
  size?: "sm" | "md" | "lg";
  className?: string;
  iconOnly?: boolean;
}

export function Logo({
  variant = "dark",
  size = "md",
  className,
  iconOnly = false,
}: LogoProps) {
  const iconSizes = { sm: 28, md: 32, lg: 40 };
  const textSizes = { sm: "text-base", md: "text-lg", lg: "text-2xl" };
  const iconSize = iconSizes[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="yelk-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0a1f9c" />
            <stop offset="58%" stopColor="#1a39ff" />
            <stop offset="100%" stopColor="#4f6dff" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="url(#yelk-grad)" />
        <path
          d="M8.5 9.5 L16 20 L23.5 9.5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="16"
          y1="20"
          x2="16"
          y2="26.5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Wordmark */}
      {!iconOnly && (
        <span
          className={cn(
            "font-bold tracking-tight leading-none",
            textSizes[size],
            variant === "white" ? "text-white" : "text-slate-900"
          )}
        >
          Yelk{" "}
          <span
            className={cn(
              variant === "white" ? "text-yelk-300" : "text-yelk-500"
            )}
          >
            Finance
          </span>
        </span>
      )}
    </div>
  );
}
