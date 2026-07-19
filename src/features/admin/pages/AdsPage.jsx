import { useEffect, useState } from "react";
import { Megaphone, Pencil, Plus, Trash2 } from "lucide-react";

import AdFormModal from "../components/AdFormModal";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../components/AdminTable";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import apiClient from "../../../lib/api/client"; // التأكد من المسار الصحيح

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

  // دالة لجلب الإعلانات
  const fetchAds = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/admin/ads");
      setAds(response.data.data || []);
    } catch (error) {
      showToast("حدث خطأ أثناء جلب الإعلانات", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
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

  const handleSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("link", data.link || "");
      formData.append("date", data.date || new Date().toISOString().slice(0, 10));

      // هنا التأكد من إرسال الملف الحقيقي
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      if (editingAd) {
        formData.append("_method", "PUT");
        await apiClient.post(`/admin/ads/${editingAd.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("تم تحديث الإعلان", "success");
      } else {
        await apiClient.post("/admin/ads", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("تمت إضافة الإعلان", "success");
      }
      fetchAds();
      closeForm();
    } catch (error) {
      // الآن ستظهر لك رسائل الخطأ الحقيقية من لارافيل
      console.error("خطأ:", error.response?.data);
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
      showToast("خطأ أثناء حذف الإعلان", "error");
    }
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

      {isLoading ? (
        <div className="text-center py-10">جاري تحميل الإعلانات...</div>
      ) : ads.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="لا توجد إعلانات"
          description="أضف إعلاناً ليظهر في المنصة."
        />
      ) : (
        <AdminTable columns={AD_COLUMNS}>
          {ads.map((ad) => (
            <AdminTableRow key={ad.id}>
              <AdminTableCell className="font-bold text-blue-950">{ad.title}</AdminTableCell>
              <AdminTableCell dir="">{ad.link}</AdminTableCell>
              <AdminTableCell>
  <span className="text-slate-600 font-medium">
    {ad.created_at ? new Date(ad.created_at).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : "—"}
  </span>
</AdminTableCell>
              <AdminTableCell>
                <div className="flex gap-2">
                  <button type="button" onClick={() => openEdit(ad)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
                    <Pencil size={16} />
                  </button>
                  <button type="button" onClick={() => setDeletingAd(ad)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50">
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
          onConfirm={handleDelete}
          onClose={() => setDeletingAd(null)}
        />
      )}
    </div>
  );
}

export default AdsPage;