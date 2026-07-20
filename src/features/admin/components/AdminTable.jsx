function AdminTable({ columns, children, emptyMessage, className = "", bordered = true }) {
  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  return (
    <div
      className={`${bordered ? "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" : ""} ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm" dir="rtl">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`whitespace-nowrap px-3 py-3 text-right text-xs font-extrabold text-slate-500 sm:px-4 sm:py-3.5 ${column.className ?? ""}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>

      {isEmpty && (
        <p className="px-4 py-12 text-center text-sm font-semibold text-slate-400">
          {emptyMessage ?? "لا توجد بيانات"}
        </p>
      )}
    </div>
  );
}

export function AdminTableRow({ children, className = "", style }) {
  return (
    <tr
      className={`transition-colors hover:bg-slate-50/60 ${className}`}
      style={style}
    >
      {children}
    </tr>
  );
}

export function AdminTableCell({ children, className = "", ...props }) {
  return (
    <td
      className={`px-3 py-3 align-middle text-sm text-slate-700 sm:px-4 sm:py-3.5 ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}

export default AdminTable;
