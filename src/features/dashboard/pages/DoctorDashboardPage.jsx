import { Link } from "react-router-dom";
import { LogOut, Stethoscope } from "lucide-react";

import { useAuth } from "../../authentication/context/AuthContext";

function DoctorDashboardPage() {
  const { clearSession } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10" dir="rtl">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <Stethoscope size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-blue-950">لوحة الطبيب</h1>
              <p className="text-sm text-slate-500">تم تسجيل الدخول بنجاح</p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearSession}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-red-600"
          >
            <LogOut size={16} />
            تسجيل الخروج
          </button>
        </div>

        <p className="leading-8 text-slate-600">
          هاي صفحة مؤقتة بعد ربط الـ API. لاحقاً هون رح تظهر مواعيد المرضى،
          الاستشارات، والملفات الطبية.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          العودة لتسجيل الدخول
        </Link>
      </div>
    </main>
  );
}

export default DoctorDashboardPage;
