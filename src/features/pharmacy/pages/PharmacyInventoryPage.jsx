import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Package, Plus, Save } from "lucide-react";

import AdminPageHeader from "../../admin/components/AdminPageHeader";
import Modal from "../../admin/components/Modal";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import { careSystemStore } from "../../care-system/data/careSystemStore";

const emptyForm = {
  id: null,
  name: "",
  quantity: 0,
  minQuantity: 10,
  unit: "علبة",
  keywords: "",
};

function PharmacyInventoryPage() {
  const [items, setItems] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { toast, showToast, hideToast } = useToast();

  const reload = () => setItems(careSystemStore.listInventory());

  useEffect(() => {
    reload();
    window.addEventListener("carelink-store-updated", reload);
    return () => window.removeEventListener("carelink-store-updated", reload);
  }, []);

  const lowCount = useMemo(
    () => items.filter((item) => Number(item.quantity) <= Number(item.minQuantity)).length,
    [items]
  );

  const openCreate = () => {
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      minQuantity: item.minQuantity,
      unit: item.unit || "علبة",
      keywords: (item.keywords || []).join("، "),
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      careSystemStore.saveInventoryItem({
        id: form.id,
        name: form.name,
        quantity: Number(form.quantity),
        minQuantity: Number(form.minQuantity),
        unit: form.unit,
        keywords: form.keywords,
      });
      showToast(form.id ? "تم تحديث الصنف" : "تمت إضافة الصنف", "success");
      setIsFormOpen(false);
      reload();
    } catch (error) {
      showToast(error.message || "تعذر حفظ الصنف", "error");
    }
  };

  const bump = (item, delta) => {
    careSystemStore.adjustInventoryQuantity(item.id, delta);
    reload();
  };

  return (
    <div className="space-y-6" dir="rtl">
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader
        title="المخزون"
        description="تتبع كميات الأدوية وتنبيه عند الوصول للحد الأدنى."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            صنف جديد
          </button>
        }
      />

      {lowCount > 0 ? (
        <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          يوجد {lowCount} صنف عند الحد الأدنى أو أقل — راجع الكميات قبل الموافقة على صرف جديد.
        </div>
      ) : null}

      <div className="space-y-3">
        {items.map((item) => {
          const low = Number(item.quantity) <= Number(item.minQuantity);
          return (
            <article
              key={item.id}
              className={`rounded-2xl border bg-white p-4 shadow-sm sm:p-5 ${
                low ? "border-amber-200" : "border-slate-200"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      low ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-blue-950">{item.name}</h3>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      الحد الأدنى: {item.minQuantity} {item.unit}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p
                    className={`text-2xl font-black tabular-nums ${
                      low ? "text-amber-700" : "text-[#101860]"
                    }`}
                  >
                    {item.quantity}
                  </p>
                  <p className="text-[11px] font-bold text-slate-400">{item.unit}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => bump(item, -1)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  −1
                </button>
                <button
                  type="button"
                  onClick={() => bump(item, 1)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => bump(item, 10)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  +10 توريد
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
                >
                  تعديل
                </button>
                {low ? (
                  <span className="inline-flex items-center rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">
                    كمية منخفضة
                  </span>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {isFormOpen ? (
        <Modal
          title={form.id ? "تعديل صنف" : "إضافة صنف للمخزون"}
          onClose={() => setIsFormOpen(false)}
          maxWidth="max-w-lg"
        >
          <form className="space-y-3" onSubmit={handleSubmit} dir="rtl">
            <label className="block space-y-1">
              <span className="text-sm font-bold text-slate-700">اسم الدواء</span>
              <input
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="block space-y-1">
                <span className="text-sm font-bold text-slate-700">الكمية</span>
                <input
                  type="number"
                  min="0"
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                  value={form.quantity}
                  onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-bold text-slate-700">الحد الأدنى</span>
                <input
                  type="number"
                  min="0"
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                  value={form.minQuantity}
                  onChange={(e) => setForm((f) => ({ ...f, minQuantity: e.target.value }))}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-bold text-slate-700">الوحدة</span>
                <input
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                  value={form.unit}
                  onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                />
              </label>
            </div>
            <label className="block space-y-1">
              <span className="text-sm font-bold text-slate-700">كلمات مطابقة للوصفة</span>
              <input
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none"
                placeholder="مثال: أملوديبين، amlodipine"
                value={form.keywords}
                onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
              />
            </label>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              <Save size={16} />
              حفظ
            </button>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}

export default PharmacyInventoryPage;
