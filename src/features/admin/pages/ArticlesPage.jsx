import { useEffect, useState } from "react";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";

import AdminPageHeader from "../components/AdminPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../components/AdminTable";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { careSystemStore } from "../../care-system/data/careSystemStore";

const COLUMNS = [
  { key: "title", label: "العنوان" },
  { key: "category", label: "التصنيف" },
  { key: "author", label: "الكاتب" },
  { key: "status", label: "الحالة" },
  { key: "actions", label: "الإجراءات", className: "w-32" },
];

function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "صحة عامة",
    author: "",
    excerpt: "",
    status: "published",
  });
  const { toast, showToast, hideToast } = useToast();

  const reload = () => setArticles(careSystemStore.listArticles());

  useEffect(() => {
    reload();
    const onUpdate = () => reload();
    window.addEventListener("carelink-store-updated", onUpdate);
    return () => window.removeEventListener("carelink-store-updated", onUpdate);
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      category: "صحة عامة",
      author: "",
      excerpt: "",
      status: "published",
    });
    setIsOpen(true);
  };

  const openEdit = (article) => {
    setEditing(article);
    setForm({
      title: article.title,
      category: article.category,
      author: article.author,
      excerpt: article.excerpt,
      status: article.status || "published",
    });
    setIsOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    careSystemStore.saveArticle({
      ...form,
      id: editing?.id,
      slug: editing?.slug || form.title.replace(/\s+/g, "-").slice(0, 40),
      image: editing?.image || "/images/carelink-blog-family.png",
    });
    showToast(editing ? "تم تحديث المقال" : "تمت إضافة المقال", "success");
    setIsOpen(false);
    reload();
  };

  return (
    <div>
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader
        title="المقالات"
        description="إدارة مقالات المدونة المعروضة في صفحة اللاندينغ."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            مقال جديد
          </button>
        }
      />

      {articles.length === 0 ? (
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
                  <button type="button" onClick={() => openEdit(article)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
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
          <form className="space-y-3" onSubmit={handleSubmit} dir="rtl">
            <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="العنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="التصنيف" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="الكاتب" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
            <textarea className="min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="المقتطف" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required />
            <select className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="published">منشور</option>
              <option value="draft">مسودة</option>
            </select>
            <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700">حفظ</button>
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="حذف المقال"
          message={`هل تريد حذف «${deleting.title}»؟`}
          onConfirm={() => {
            careSystemStore.deleteArticle(deleting.id);
            setDeleting(null);
            showToast("تم حذف المقال", "error");
            reload();
          }}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

export default ArticlesPage;
