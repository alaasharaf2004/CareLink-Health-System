import { useEffect, useState } from "react";
import { Newspaper, Pencil, Plus, Trash2, CheckCircle } from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../components/AdminTable";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import PostFormModal from "../components/PostFormModal";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import apiClient from "../../../lib/api/client";

const POST_COLUMNS = [
  { key: "title", label: "العنوان" },
  { key: "content", label: "المحتوى" },
  { key: "status", label: "الحالة" },
  { key: "actions", label: "الإجراءات", className: "w-32" },
];

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingPost, setDeletingPost] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      // تأكد أن هذا الرابط في الباك إند يعيد كل المنشورات (المقبولة وغير المقبولة)
      const res = await apiClient.get("/admin/posts");
      setPosts(res.data.data || []);
    } catch {
      showToast("خطأ في جلب المنشورات", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  // دالة قبول المنشور
  const handleApprove = async (id) => {
    try {
      await apiClient.patch(`/admin/posts/${id}/approve`);
      showToast("تم قبول المنشور بنجاح", "success");
      fetchPosts();
    } catch {
      showToast("خطأ أثناء قبول المنشور", "error");
    }
  };

  const handleSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      if (data.image instanceof File) formData.append("image", data.image);

      if (editingPost) {
        formData.append("_method", "PUT");
        await apiClient.post(`/admin/posts/${editingPost.id}`, formData);
        showToast("تم تحديث المنشور", "success");
      } else {
        await apiClient.post("/admin/posts", formData);
        showToast("تم نشر المنشور", "success");
      }
      fetchPosts();
      setIsFormOpen(false);
      setEditingPost(null);
    } catch (error) {
      showToast("خطأ أثناء الحفظ", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/admin/posts/${deletingPost.id}`);
      showToast("تم حذف المنشور", "success");
      fetchPosts();
      setDeletingPost(null);
    } catch {
      showToast("خطأ أثناء الحذف", "error");
    }
  };

  return (
    <div>
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader title="إدارة المنشورات" action={<button onClick={() => { setEditingPost(null); setIsFormOpen(true); }} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"><Plus size={16} />منشور جديد</button>} />

      {isLoading ? <div className="text-center py-10">جاري التحميل...</div> : posts.length === 0 ? (
        <EmptyState icon={Newspaper} title="لا توجد منشورات" description="ابدأ بنشر أول تحديث للمستخدمين." />
      ) : (
        <AdminTable columns={POST_COLUMNS}>
          {posts.map((post) => (
            <AdminTableRow key={post.id}>
              <AdminTableCell className="font-bold text-blue-950">{post.title}</AdminTableCell>
              <AdminTableCell className="max-w-xs truncate">{post.content}</AdminTableCell>
              <AdminTableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${post.is_approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {post.is_approved ? "مقبول" : "بانتظار القبول"}
                </span>
              </AdminTableCell>
              <AdminTableCell>
                <div className="flex gap-2">
                  {!post.is_approved && (
                    <button onClick={() => handleApprove(post.id)} className="p-2 text-green-600 hover:bg-green-50" title="قبول المنشور">
                      <CheckCircle size={16} />
                    </button>
                  )}
                   <button onClick={() => setDeletingPost(post)} className="p-2 text-rose-600 hover:bg-rose-50"><Trash2 size={16} /></button>
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}

      {isFormOpen && <PostFormModal post={editingPost} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} />}
      {deletingPost && <ConfirmDialog title="حذف المنشور" message={`حذف «${deletingPost.title}»؟`} onConfirm={handleDelete} onClose={() => setDeletingPost(null)} />}
    </div>
  );
}

export default PostsPage;