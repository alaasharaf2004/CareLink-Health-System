import { useEffect, useState } from "react";
import { CheckCheck, NotebookPen, Send } from "lucide-react";

import { careSystemStore } from "../../care-system/data/careSystemStore";

function ReceptionHandoverPanel({ authorName = "الاستقبال" }) {
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const reload = () => setNotes(careSystemStore.listShiftHandovers(12));

  useEffect(() => {
    reload();
    window.addEventListener("carelink-store-updated", reload);
    return () => window.removeEventListener("carelink-store-updated", reload);
  }, []);

  const submit = (event) => {
    event.preventDefault();
    setError("");
    try {
      careSystemStore.addShiftHandover({ message, authorName });
      setMessage("");
    } catch (err) {
      setError(err.message || "تعذر حفظ الملاحظة");
    }
  };

  return (
    <section className="patient-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <NotebookPen size={18} className="text-blue-600" />
        <div>
          <h2 className="text-base font-extrabold text-[#101860]">تسليم / تسلّم الوردية</h2>
          <p className="text-xs font-semibold text-slate-500">
            ملاحظات تنتقل من وردية لأخرى (مثلاً: مريض ينتظر اعتذار الطبيب)
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input
          className="h-11 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
          placeholder="اكتب ملاحظة للوردية القادمة..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="workspace-btn-press inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          <Send size={15} />
          تسليم
        </button>
      </form>
      {error ? <p className="mb-3 text-xs font-bold text-rose-600">{error}</p> : null}

      <ul className="max-h-64 space-y-2 overflow-y-auto">
        {notes.length === 0 ? (
          <li className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center text-sm text-slate-400">
            لا ملاحظات تسليم بعد
          </li>
        ) : (
          notes.map((note) => (
            <li
              key={note.id}
              className={`rounded-xl border px-3 py-2.5 text-sm ${
                note.acknowledged
                  ? "border-slate-100 bg-slate-50 text-slate-500"
                  : "border-amber-100 bg-amber-50/70 text-slate-800"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-bold leading-6">{note.message}</p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-400">
                    {note.authorName} ·{" "}
                    {note.createdAt
                      ? new Date(note.createdAt).toLocaleString("ar")
                      : ""}
                  </p>
                </div>
                {!note.acknowledged ? (
                  <button
                    type="button"
                    className="workspace-btn-press inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50"
                    onClick={() => careSystemStore.acknowledgeShiftHandover(note.id)}
                  >
                    <CheckCheck size={12} />
                    تم الاستلام
                  </button>
                ) : (
                  <span className="shrink-0 text-[10px] font-bold text-slate-400">مستلمة</span>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

export default ReceptionHandoverPanel;
