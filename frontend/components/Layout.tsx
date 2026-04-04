"use client";

import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className = "" }: LayoutProps) {
  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${className}`}>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={`rounded-4xl border border-slate-200/70 bg-white/90 p-8 shadow-[0_32px_80px_-30px_rgba(15,23,42,0.18)] ${className}`}
    >
      {children}
    </div>
  );
}

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-6 shadow-sm ${className}`}
    >
      {title && (
        <h3 className="text-xl font-semibold text-slate-900 mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
}
