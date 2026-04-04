interface PageHeaderProps {
  title: string;
  description?: string;
  cta?: React.ReactNode;
}

export function PageHeader({ title, description, cta }: PageHeaderProps) {
  return (
    <div className="rounded-4xl border border-slate-200/80 bg-white/85 p-8 shadow-[0_40px_80px_-40px_rgba(15,23,42,0.2)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Visão geral
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              {description}
            </p>
          ) : null}
        </div>
        {cta ? <div className="mt-4 sm:mt-0">{cta}</div> : null}
      </div>
    </div>
  );
}
