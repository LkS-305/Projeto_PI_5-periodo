"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-3xl border border-slate-200 bg-white/90 px-5 py-3 text-slate-900 shadow-sm transition duration-200 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 ${error ? "border-rose-300 focus:ring-rose-100" : ""} ${className}`}
        {...props}
      />
      {error ? (
        <p className="mt-2 text-sm text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="mt-2 text-sm text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
