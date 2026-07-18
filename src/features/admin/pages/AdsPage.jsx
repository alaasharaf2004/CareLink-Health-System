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
import apiClient from "../../../lib/api/client";

const AD_COLUMNS = [
  { key: "title", label: "العنوان" },
  { key: "link", label: "الرابط" },
  { key: "date", label: "التاريخ" },
  { key: "actions", label: "الإجراءات", className: "w-32" },
];

function AdsPage() {
 const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAd, setEditingAd] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingAd, setDeletingAd] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  // جلب الإعلانات من الباك إند
  const fetchAds = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/admin/ads");
      setAds(response.data.data || []);
    } catch (error) {
      showToast("خطأ في جلب الإعلانات", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAds(); }, []);


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

  const handleSubmit = async (data) => {
    try {
      if (editingAd) {
        await apiClient.put(`/admin/ads/${editingAd.id}`, data);
        showToast("تم تحديث الإعلان", "success");
      } else {
        await apiClient.post("/admin/ads", data);
        showToast("تمت إضافة الإعلان", "success");
      }
      fetchAds(); // إعادة تحميل البيانات
      closeForm();
    } catch (error) {
      showToast("حدث خطأ أثناء الحفظ", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/admin/ads/${deletingAd.id}`);
      showToast("تم حذف الإعلان", "error");
      fetchAds();
      setDeletingAd(null);
    } catch (error) {
      showToast("خطأ في حذف الإعلان", "error");
    }
  };

  return (
    <div>
      <Toast toast={toast} onClose={hideToast} />

      <AdminPageHeader
        title="الإعلانات"
        description="إدارة الإعلانات المعروضة للمستخدمين في المنصة."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            <Plus size={18} />
            إضافة
          </button>
        }
      />

      {ads.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="لا توجد إعلانات"
          description="اضغط «إضافة» لإنشاء أول إعلان."
        />
      ) : (
        <AdminTable columns={AD_COLUMNS}>
          {ads.map((ad) => (
            <AdminTableRow key={ad.id}>
              <AdminTableCell>
                <span className="font-bold text-blue-950">{ad.title}</span>
              </AdminTableCell>
              <AdminTableCell>
                {ad.link ? (
                  <a
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-blue-600 hover:underline"
                    dir="ltr"
                  >
                    {ad.link}
                  </a>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </AdminTableCell>
              <AdminTableCell>{ad.created_at ?? "—"}</AdminTableCell>
              <AdminTableCell>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(ad)}
                    title="تعديل"
                    className="cursor-pointer rounded-lg p-2 text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Pencil size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingAd(ad)}
                    title="حذف"
                    className="cursor-pointer rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}

      {isFormOpen && (
        <AdFormModal
          ad={editingAd}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}

      {deletingAd && (
        <ConfirmDialog
          message={`هل أنت متأكد من حذف الإعلان «${deletingAd.title}»؟`}
          onConfirm={handleDelete}
          onClose={() => setDeletingAd(null)}
        />
      )}
    </div>
  );
}

export default AdsPage;
