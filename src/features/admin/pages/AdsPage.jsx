import { useEffect, useState } from "react";
import { Megaphone, Pencil, Plus, Trash2 } from "lucide-react";

import AdFormModal from "../components/AdFormModal";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminTable, {
  AdminTableCell,
  AdminTableRow,
} from "../components/AdminTable";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { careSystemStore } from "../../care-system/data/careSystemStore";

const AD_COLUMNS = [
  { key: "title", label: "العنوان" },
  { key: "link", label: "الرابط" },
  { key: "date", label: "التاريخ" },
  { key: "actions", label: "الإجراءات", className: "w-32" },
];

function AdsPage() {
  const [ads, setAds] = useState([]);
  const [editingAd, setEditingAd] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingAd, setDeletingAd] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  const reload = () => setAds(careSystemStore.listAds());

  useEffect(() => {
    reload();
    const onUpdate = () => reload();
    window.addEventListener("carelink-store-updated", onUpdate);
    return () => window.removeEventListener("carelink-store-updated", onUpdate);
  }, []);

  const openCreate = () => {
    setEditingAd(null);
    setIsFormOpen(true);
  };

  const openEdit = (ad) => {
    setEditingAd(ad);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingAd(null);
  };

  const handleSubmit = (data) => {
    careSystemStore.saveAd({ ...data, id: editingAd?.id });
    showToast(editingAd ? "تم تحديث الإعلان" : "تمت إضافة الإعلان", "success");
    closeForm();
    reload();
  };

  return (
    <div>
      <Toast toast={toast} onClose={hideToast} />

      <AdminPageHeader
        title="الإعلانات"
        description="إدارة الإعلانات والعروض الظاهرة للمستخدمين."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            إعلان جديد
          </button>
        }
      />

      {ads.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="لا توجد إعلانات"
          description="أضف إعلاناً ليظهر في المنصة."
        />
      ) : (
        <AdminTable columns={AD_COLUMNS}>
          {ads.map((ad) => (
            <AdminTableRow key={ad.id}>
              <AdminTableCell className="font-bold text-blue-950">
                {ad.title}
              </AdminTableCell>
              <AdminTableCell dir="ltr">{ad.link}</AdminTableCell>
              <AdminTableCell>{ad.date}</AdminTableCell>
              <AdminTableCell>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(ad)}
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingAd(ad)}
                    className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}

      {isFormOpen && (
        <AdFormModal ad={editingAd} onClose={closeForm} onSubmit={handleSubmit} />
      )}

      {deletingAd && (
        <ConfirmDialog
          title="حذف الإعلان"
          message={`هل أنت متأكد من حذف الإعلان «${deletingAd.title}»؟`}
          onConfirm={() => {
            careSystemStore.deleteAd(deletingAd.id);
            setDeletingAd(null);
            showToast("تم حذف الإعلان", "error");
            reload();
          }}
          onClose={() => setDeletingAd(null)}
        />
      )}
    </div>
  );
}

export default AdsPage;
