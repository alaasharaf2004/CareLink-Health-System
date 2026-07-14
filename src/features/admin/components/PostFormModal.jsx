import { useState } from "react";

import ImageUploadField from "./ImageUploadField";
import Modal from "./Modal";

const EMPTY_POST = { title: "", content: "", image: "" };

function PostFormModal({ post, onSubmit, onClose }) {
  const isEditing = Boolean(post);
  const [form, setForm] = useState(post ? { ...post } : EMPTY_POST);
  const [error, setError] = useState("");

  const updateField = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("عنوان المنشور مطلوب");
      return;
    }
    if (!form.content.trim()) {
      setError("محتوى المنشور مطلوب");
      return;
    }

    onSubmit({
      ...form,
      title: form.title.trim(),
      content: form.content.trim(),
    });
  };

  return (
    <Modal
      title={isEditing ? "تعديل المنشور" : "إضافة منشور جديد"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <ImageUploadField
          label="صورة المنشور (اختياري)"
          value={form.image}
          onChange={(preview) => updateField("image", preview)}
        />

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-600">
            العنوان
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(event) => {
              updateField("title", event.target.value);
              if (error) setError("");
            }}
            placeholder="مثال: حملة التبرع بالدم"
            className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-blue-950 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-600">
            المحتوى
          </label>
          <textarea
            value={form.content}
            onChange={(event) => {
              updateField("content", event.target.value);
              if (error) setError("");
            }}
            rows={4}
            placeholder="اكتب تفاصيل المنشور هنا..."
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-blue-950 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500"
          />
        </div>

        {error && <p className="text-sm font-bold text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="flex-1 cursor-pointer rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            {isEditing ? "حفظ التعديلات" : "نشر"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default PostFormModal;
