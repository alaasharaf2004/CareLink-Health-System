import { useState } from "react";

import ImageUploadField from "./ImageUploadField";
import Modal from "./Modal";

const EMPTY_AD = { title: "", link: "", image: "" };

function AdFormModal({ ad, onSubmit, onClose }) {
  const isEditing = Boolean(ad);
  const [form, setForm] = useState(ad ? { ...ad } : EMPTY_AD);
  const [error, setError] = useState("");

  const updateField = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));
// داخل AdFormModal.js
const handleSubmit = (event) => {
  event.preventDefault();
  
  if (!form.title.trim()) {
    setError("عنوان الإعلان مطلوب");
    return;
  }

  // نرسل الـ form كما هو، وهو الآن يحتوي على الـ image كـ File Object
  onSubmit({ 
    ...form, 
    title: form.title.trim(), 
    link: form.link.trim() 
  });
};

  return (
    <Modal
      title={isEditing ? "تعديل الإعلان" : "إضافة إعلان جديد"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <ImageUploadField
          label="صورة الإعلان"
          value={
            form.imagePreview ||
            (typeof form.image === "string" ? form.image : "")
          }
          onChange={(previewUrl, file) => {
            updateField("image", file);
            updateField("imagePreview", previewUrl);
          }}
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
            placeholder="مثال: تخفيضات على الفحوصات"
            className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-blue-950 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-600">
            الرابط (اختياري)
          </label>
          <input
            type="url"
            value={form.link}
            onChange={(event) => updateField("link", event.target.value)}
            placeholder="https://..."
            dir="ltr"
            className="h-11 w-full rounded-xl border border-slate-200 px-4 text-left text-sm text-blue-950 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500"
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
            {isEditing ? "حفظ التعديلات" : "إضافة"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AdFormModal;
