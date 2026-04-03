'use client';

import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className = '' }: LayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 dark:bg-gray-900 dark:text-white ${className}`}
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

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-4 dark:bg-gray-800 dark:text-white ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
}
