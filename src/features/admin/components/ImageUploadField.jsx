import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";

/**
 * حقل رفع صورة مع معاينة.
 * value: رابط المعاينة الحالي (string) أو فارغ.
 * onChange(previewUrl, file): يُستدعى عند اختيار صورة أو إزالتها.
 */
function ImageUploadField({ label = "الصورة", value, onChange }) {
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onChange(URL.createObjectURL(file), file);
  };

  const handleRemove = () => {
    onChange("", null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-600">
        {label}
      </label>

      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-slate-200">
          <img
            src={value}
            alt="معاينة"
            className="h-40 w-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute left-2 top-2 cursor-pointer rounded-lg bg-slate-900/60 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-red-600"
            aria-label="إزالة الصورة"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-colors hover:border-blue-400 hover:bg-blue-50/40 hover:text-blue-500"
        >
          <ImagePlus size={26} />
          <span className="text-sm font-bold">اختر صورة</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default ImageUploadField;
