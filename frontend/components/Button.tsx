"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantStyles = {
  primary:
    "bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  ghost: "bg-transparent text-slate-900 hover:bg-slate-100",
  danger: "bg-rose-600 text-white hover:bg-rose-500",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-base",
  lg: "px-6 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex min-w-[110px] items-center justify-center rounded-full font-semibold transition duration-200 ${variantStyles[variant]} ${sizeStyles[size]} ${disabled || loading ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-flex animate-spin text-base">⏳</span>
      ) : null}
      <span className={loading ? "ml-2" : ""}>{children}</span>
    </button>
  );
}
