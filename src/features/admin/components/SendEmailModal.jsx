import { useState } from "react";
import { Send } from "lucide-react";

import Modal from "./Modal";

const DEFAULT_SUBJECT = "CareLink — إشعار من الإدارة";

function SendEmailModal({ doctor, onSend, onClose }) {
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [message, setMessage] = useState(
    `مرحباً د. ${doctor?.name ?? ""},\n\n`
  );
  const [error, setError] = useState("");

  if (!doctor) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!message.trim()) {
      setError("نص الرسالة مطلوب");
      return;
    }
    onSend({ subject: subject.trim(), message: message.trim() });
  };

  return (
    <Modal title="إرسال بريد للطبيب" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-600">
            إلى
          </label>
          <input
            type="email"
            value={doctor.email}
            readOnly
            dir="ltr"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-left text-sm text-slate-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-600">
            الموضوع
          </label>
          <input
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-blue-950 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-600">
            الرسالة
          </label>
          <textarea
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              if (error) setError("");
            }}
            rows={5}
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-blue-950 outline-none focus:border-blue-500"
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
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            <Send size={16} />
            إرسال
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default SendEmailModal;
