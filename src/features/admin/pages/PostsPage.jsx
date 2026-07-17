import { useState } from "react";
import { Newspaper, Pencil, Plus, Trash2 } from "lucide-react";

import AdminPageHeader from "../components/AdminPageHeader";
import AdminTable, {
  AdminTableCell,
  AdminTableRow,
} from "../components/AdminTable";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import PostFormModal from "../components/PostFormModal";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

const POST_COLUMNS = [
  { key: "title", label: "العنوان" },
  { key: "content", label: "المحتوى" },
  { key: "date", label: "التاريخ" },
  { key: "actions", label: "الإجراءات", className: "w-32" },
];

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingPost, setDeletingPost] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  const openCreate = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };

  const handleSubmit = (data) => {
    if (editingPost) {
      setPosts((current) =>
        current.map((post) =>
          post.id === editingPost.id ? { ...post, ...data } : post
        )
      );
      showToast("تم تحديث المنشور بنجاح", "success");
    } else {
      setPosts((current) => [
        { ...data, id: Date.now(), created_at: new Date().toISOString().slice(0, 10) },
        ...current,
      ]);
      showToast("تم نشر المنشور بنجاح", "success");
    }
    closeForm();
  };

  const handleDelete = () => {
    setPosts((current) => current.filter((post) => post.id !== deletingPost.id));
    showToast("تم حذف المنشور", "error");
    setDeletingPost(null);
  };

  return (
    <div>
      <Toast toast={toast} onClose={hideToast} />

      <AdminPageHeader
        title="المنشورات"
        description="إدارة المنشورات والتحديثات المعروضة للمستخدمين."
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

      {posts.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="لا توجد منشورات"
          description="اضغط «إضافة» لنشر أول منشور."
        />
      ) : (
        <AdminTable columns={POST_COLUMNS}>
          {posts.map((post) => (
            <AdminTableRow key={post.id}>
              <AdminTableCell>
                <span className="font-bold text-blue-950">{post.title}</span>
              </AdminTableCell>
              <AdminTableCell>
                <p className="line-clamp-2 max-w-xs text-slate-600">
                  {post.content}
                </p>
              </AdminTableCell>
              <AdminTableCell>{post.created_at}</AdminTableCell>
              <AdminTableCell>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(post)}
                    title="تعديل"
                    className="cursor-pointer rounded-lg p-2 text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Pencil size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingPost(post)}
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
        <PostFormModal
          post={editingPost}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}

      {deletingPost && (
        <ConfirmDialog
          message={`هل أنت متأكد من حذف المنشور «${deletingPost.title}»؟`}
          onConfirm={handleDelete}
          onClose={() => setDeletingPost(null)}
        />
      )}
    </div>
  );
}

export default PostsPage;
