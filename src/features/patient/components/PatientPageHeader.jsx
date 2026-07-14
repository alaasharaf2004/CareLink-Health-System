function PatientPageHeader({ title, description, action, index = 0 }) {
  return (
    <div
      className="mb-6 flex flex-col gap-4 opacity-0 animate-[formFadeUp_0.55s_cubic-bezier(0.22,1,0.36,1)_forwards] sm:flex-row sm:items-end sm:justify-between"
      style={{ animationDelay: `${0.06 + index * 0.05}s` }}
    >
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-blue-950">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default PatientPageHeader;
