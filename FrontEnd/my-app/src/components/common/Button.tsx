import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "danger";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variantClass = variant === "danger" ? "btn-delete" : "";

  return (
    <button className={`btn ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
