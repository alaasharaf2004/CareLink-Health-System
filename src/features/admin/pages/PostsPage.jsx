import { useEffect, useState } from "react";
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
import { careSystemStore } from "../../care-system/data/careSystemStore";

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

  const reload = () => setPosts(careSystemStore.listPosts());

  useEffect(() => {
    reload();
    const onUpdate = () => reload();
    window.addEventListener("carelink-store-updated", onUpdate);
    return () => window.removeEventListener("carelink-store-updated", onUpdate);
  }, []);

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
    careSystemStore.savePost({ ...data, id: editingPost?.id });
    showToast(editingPost ? "تم تحديث المنشور بنجاح" : "تم نشر المنشور بنجاح", "success");
    closeForm();
    reload();
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
            <Plus size={16} />
            منشور جديد
          </button>
        }
      />

      {posts.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="لا توجد منشورات"
          description="ابدأ بنشر أول تحديث للمستخدمين."
        />
      ) : (
        <AdminTable columns={POST_COLUMNS}>
          {posts.map((post) => (
            <AdminTableRow key={post.id}>
              <AdminTableCell className="font-bold text-blue-950">
                {post.title}
              </AdminTableCell>
              <AdminTableCell className="max-w-xs truncate">
                {post.content}
              </AdminTableCell>
              <AdminTableCell>{post.created_at}</AdminTableCell>
              <AdminTableCell>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(post)}
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingPost(post)}
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
        <PostFormModal
          post={editingPost}
          onClose={closeForm}
          onSubmit={handleSubmit}
        />
      )}

      {deletingPost && (
        <ConfirmDialog
          title="حذف المنشور"
          message={`هل أنت متأكد من حذف المنشور «${deletingPost.title}»؟`}
          onConfirm={() => {
            careSystemStore.deletePost(deletingPost.id);
            setDeletingPost(null);
            showToast("تم حذف المنشور", "error");
            reload();
          }}
          onClose={() => setDeletingPost(null)}
        />
      )}
    </div>
  );
}

export default PostsPage;
