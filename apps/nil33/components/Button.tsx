import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  external?: boolean;
}

const base = "inline-flex items-center justify-center font-semibold transition-all rounded-xl";

const variants = {
  primary: "bg-nil-green text-nil-black hover:bg-nil-green/90 hover:shadow-[0_0_24px_rgba(0,255,136,0.15)]",
  secondary: "bg-nil-dark border border-nil-border text-nil-white hover:border-nil-green/30 hover:bg-nil-gray/50",
  ghost: "text-nil-muted hover:text-nil-white",
};

const sizes = {
  sm: "text-[13px] px-4 py-2 rounded-lg",
  md: "text-sm px-6 py-3",
  lg: "text-sm px-8 py-3.5",
};

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  disabled,
  className = "",
  external,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`;

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
