interface StatCardProps {
  title: string;
  value: string;
  accent?: string;
  children?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  accent = "blue",
  children,
  className = "",
}: StatCardProps) {
  const accentClasses = {
    blue: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50",
    green: "bg-gradient-to-br from-green-50 to-green-100 border-green-200/50",
    purple:
      "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50",
    yellow:
      "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200/50",
    red: "bg-gradient-to-br from-red-50 to-red-100 border-red-200/50",
  };

  return (
    <div
      className={`rounded-4xl border border-slate-200/80 ${accentClasses[accent as keyof typeof accentClasses] || accentClasses.blue} p-6 shadow-sm backdrop-blur-sm ${className}`}
    >
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-600">
        {title}
      </p>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
      {children ? (
        <p className="mt-2 text-sm text-slate-600">{children}</p>
      ) : null}
    </div>
  );
}
