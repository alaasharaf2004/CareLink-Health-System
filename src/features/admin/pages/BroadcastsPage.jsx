import { useEffect, useMemo, useState } from "react";
import { Megaphone, Plus, Trash2, Radio } from "lucide-react";

import AdminPageHeader from "../components/AdminPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../components/AdminTable";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import apiClient from "../../../lib/api/client";
import { careSystemStore } from "../../care-system/data/careSystemStore";

/**
 * فئات البث حسب نظام الباك:
 * target: all | doctors | pharmacists | patients | laboratory | reception | radiology
 */
const TARGET_OPTIONS = [
  { value: "all", label: "الكل", hint: "كل عناصر النظام" },
  { value: "doctors", label: "الأطباء", hint: "لوحة الطبيب فقط" },
  { value: "pharmacists", label: "الصيادلة", hint: "لوحة الصيدلية فقط" },
  { value: "patients", label: "المرضى", hint: "لوحة المريض فقط" },
  { value: "laboratory", label: "المختبر", hint: "لوحة المختبر فقط" },
  { value: "radiology", label: "الأشعة", hint: "لوحة فني الأشعة فقط" },
  { value: "reception", label: "الاستقبال", hint: "لوحة الاستقبال فقط" },
];

const TARGET_LABELS = {
  all: "الكل",
  doctors: "الأطباء",
  doctor: "الأطباء",
  pharmacists: "الصيادلة",
  pharmacist: "الصيادلة",
  pharmacy: "الصيادلة",
  patients: "المرضى",
  patient: "المرضى",
  laboratory: "المختبر",
  lab: "المختبر",
  radiology: "الأشعة",
  reception: "الاستقبال",
};

const COLUMNS = [
  { key: "message", label: "الرسالة" },
  { key: "target", label: "الفئة المستهدفة" },
  { key: "created_at", label: "التاريخ" },
  { key: "actions", label: "إجراء", className: "w-28" },
];

function BroadcastsPage() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [targets, setTargets] = useState(["all"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  const loadLocal = () => setBroadcasts(careSystemStore.listBroadcasts());

  const fetchBroadcasts = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/admin/broadcasts");
      const list = response.data?.data ?? response.data ?? [];
      if (Array.isArray(list) && list.length) {
        careSystemStore.syncBroadcasts(list);
        setBroadcasts(careSystemStore.listBroadcasts());
      } else {
        loadLocal();
      }
    } catch {
      loadLocal();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
    const onStore = () => loadLocal();
    window.addEventListener("carelink-store-updated", onStore);
    return () => window.removeEventListener("carelink-store-updated", onStore);
  }, []);

  const selectedSummary = useMemo(() => {
    if (targets.includes("all")) return "الكل";
    return targets.map((value) => TARGET_LABELS[value] || value).join(" · ");
  }, [targets]);

  const toggleTarget = (value) => {
    setTargets((current) => {
      // اختيار «الكل» يلغي كل الفئات الأخرى
      if (value === "all") {
        return current.includes("all") ? [] : ["all"];
      }

      // اختيار فئة محددة يلغي «الكل» تلقائياً
      const withoutAll = current.filter((item) => item !== "all");
      if (withoutAll.includes(value)) {
        return withoutAll.filter((item) => item !== value);
      }
      return [...withoutAll, value];
    });
  };

  const openForm = () => {
    setMessage("");
    setTargets([]);
    setIsFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const text = message.trim();
    if (!text) {
      showToast("اكتب نص الإعلان أولاً", "error");
      return;
    }
    if (!targets.length) {
      showToast("اختر فئة مستهدفة واحدة على الأقل", "error");
      return;
    }

    // الباك يستقبل: { message, target } لكل إعلان
    const targetList = targets.includes("all") ? ["all"] : targets;
    setIsSubmitting(true);

    try {
      let apiOk = false;
      for (const target of targetList) {
        try {
          await apiClient.post("/admin/broadcasts", { message: text, target });
          apiOk = true;
        } catch {
          // تجاهل فشل الـ API لهذه الفئة
        }
        // دائماً نحفظ محلياً حتى تظهر للمستهدفين في الفرونت
        careSystemStore.saveBroadcast({ message: text, target });
      }

      showToast(
        apiOk ? "تم إرسال الإعلان بنجاح" : "تم حفظ الإعلان محلياً (تعذر الاتصال بالخادم)",
        apiOk ? "success" : "info"
      );
      setIsFormOpen(false);
      setMessage("");
      setTargets([]);
      await fetchBroadcasts();
    } catch (error) {
      showToast(error.message || "تعذر إرسال الإعلان", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      try {
        await apiClient.delete(`/admin/broadcasts/${deleting.id}`);
      } catch {
        // fallback محلي
      }
      careSystemStore.deleteBroadcast(deleting.id);
      showToast("تم حذف الإعلان", "success");
      setDeleting(null);
      await fetchBroadcasts();
    } catch {
      showToast("تعذر حذف الإعلان", "error");
    }
  };

  return (
    <div dir="rtl">
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader
        title="نظام البث"
        description="أنشئ إعلاناً من لوحة الأدمن وحدّد الفئة: الكل، الأطباء، الصيادلة، المرضى، أو غيرهم."
        action={
          <button
            type="button"
            onClick={openForm}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            إعلان جديد
          </button>
        }
      />

      {isLoading ? (
        <div className="py-12 text-center font-bold text-slate-500">جاري التحميل...</div>
      ) : broadcasts.length === 0 ? (
        <EmptyState
          icon={Radio}
          title="لا توجد إعلانات بث"
          description="أنشئ أول إعلان ليصل للفئة المستهدفة في النظام."
        />
      ) : (
        <AdminTable columns={COLUMNS}>
          {broadcasts.map((item) => (
            <AdminTableRow key={item.id}>
              <AdminTableCell className="max-w-md font-semibold text-blue-950">
                {item.message}
              </AdminTableCell>
              <AdminTableCell>
                <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                  {TARGET_LABELS[item.target] || item.target}
                </span>
              </AdminTableCell>
              <AdminTableCell className="text-sm text-slate-500">
                {item.created_at || item.createdAt
                  ? new Date(item.created_at || item.createdAt).toLocaleString("ar")
                  : "—"}
              </AdminTableCell>
              <AdminTableCell>
                <button
                  type="button"
                  onClick={() => setDeleting(item)}
                  className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                  title="حذف"
                >
                  <Trash2 size={16} />
                </button>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}

      {isFormOpen && (
        <Modal title="إنشاء إعلان بث" onClose={() => setIsFormOpen(false)} maxWidth="max-w-xl">
          <form className="space-y-5" onSubmit={handleSubmit} dir="rtl">
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-slate-700">نص الرسالة / الإعلان</span>
              <textarea
                className="min-h-28 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="مثال: عفواً، تم تحديث النظام"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                required
              />
              <span className="text-[11px] font-semibold text-slate-400">
                {message.trim().length}/1000
              </span>
            </label>

            <fieldset className="space-y-2.5">
              <legend className="text-sm font-bold text-slate-700">
                لمن هذا الإعلان؟
              </legend>
              <p className="text-xs font-semibold text-slate-500">
                اختر فئة واحدة أو أكثر بالضغط على المربع. اختيار «الكل» يلغي باقي الفئات.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {TARGET_OPTIONS.map((option) => {
                  const checked = targets.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleTarget(option.value)}
                      className={`flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-right transition ${
                        checked
                          ? "border-blue-400 bg-blue-50 text-blue-900 ring-2 ring-blue-100"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition ${
                          checked
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white text-transparent"
                        }`}
                        aria-hidden
                      >
                        ✓
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-extrabold">{option.label}</span>
                        <span className="mt-0.5 block text-[11px] font-semibold text-slate-500">
                          {option.hint}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                سيتم الإرسال إلى:{" "}
                <span className="text-blue-700">
                  {targets.length ? selectedSummary : "لم يتم الاختيار بعد"}
                </span>
              </p>
            </fieldset>

            <button
              type="submit"
              disabled={isSubmitting || !message.trim() || targets.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <Megaphone size={16} />
              {isSubmitting ? "جاري الإرسال..." : "إرسال الإعلان"}
            </button>
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="حذف الإعلان"
          message={`هل تريد حذف الإعلان «${deleting.message}»؟`}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

export default BroadcastsPage;
