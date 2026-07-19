import { useEffect, useState } from "react";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";

import AdminPageHeader from "../components/AdminPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../components/AdminTable";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import apiClient from "../../../lib/api/client"; 

const COLUMNS = [
  { key: "title", label: "العنوان" },
  { key: "category", label: "التصنيف" },
  { key: "author", label: "الكاتب" },
  { key: "status", label: "الحالة" },
  { key: "actions", label: "الإجراءات", className: "w-32" },
];

function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({ title: "", category: "", author: "", excerpt: "", status: "published" });
  const { toast, showToast, hideToast } = useToast();

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get("/admin/articles");
      setArticles(res.data.data);
    } catch {
      showToast("خطأ في جلب المقالات", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await apiClient.put(`/admin/articles/${editing.id}`, form);
        showToast("تم تحديث المقال", "success");
      } else {
        await apiClient.post("/admin/articles", form);
        showToast("تمت إضافة المقال", "success");
      }
      setIsOpen(false);
      fetchArticles();
    } catch {
      showToast("حدث خطأ أثناء الحفظ", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/admin/articles/${deleting.id}`);
      showToast("تم حذف المقال", "error");
      fetchArticles();
      setDeleting(null);
    } catch {
      showToast("خطأ في حذف المقال", "error");
    }
  };

  return (
    <div>
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader
        title="المقالات"
        description="إدارة مقالات المدونة."
        action={
          <button type="button" onClick={() => { setEditing(null); setIsOpen(true); }} className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
            <Plus size={16} /> مقال جديد
          </button>
        }
      />

      {isLoading ? (
        <div className="text-center py-10">جاري التحميل...</div>
      ) : articles.length === 0 ? (
        <EmptyState icon={BookOpen} title="لا توجد مقالات" description="أضف أول مقال للمدونة." />
      ) : (
        <AdminTable columns={COLUMNS}>
          {articles.map((article) => (
            <AdminTableRow key={article.id}>
              <AdminTableCell className="font-bold text-blue-950">{article.title}</AdminTableCell>
              <AdminTableCell>{article.category}</AdminTableCell>
              <AdminTableCell>{article.author}</AdminTableCell>
              <AdminTableCell>{article.status === "published" ? "منشور" : "مسودة"}</AdminTableCell>
              <AdminTableCell>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setEditing(article); setForm(article); setIsOpen(true); }} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
                    <Pencil size={16} />
                  </button>
                  <button type="button" onClick={() => setDeleting(article)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)} title={editing ? "تعديل مقال" : "مقال جديد"}>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="العنوان" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
            <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="التصنيف" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} required />
            <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="الكاتب" value={form.author} onChange={(e) => setForm({...form, author: e.target.value})} required />
            <textarea className="min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="المقتطف" value={form.excerpt} onChange={(e) => setForm({...form, excerpt: e.target.value})} required />
            <select className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}>
              <option value="published">منشور</option>
              <option value="draft">مسودة</option>
            </select>
            <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700">حفظ</button>
          </form>
        </Modal>
      )}

      {deleting && <ConfirmDialog title="حذف المقال" message={`هل تريد حذف «${deleting.title}»؟`} onConfirm={handleDelete} onClose={() => setDeleting(null)} />}
    </div>
  );
}

export default ArticlesPage;