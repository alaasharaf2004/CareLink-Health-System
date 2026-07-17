import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import FadeUp from "../../patient/components/FadeUp";

function DoctorPatientDetailPage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <FadeUp index={0}>
        <Link
          to="/doctor/patients"
          className="inline-flex items-center gap-2 rounded-xl border border-transparent px-2 py-1 text-sm font-bold text-blue-600 transition-all duration-200 hover:-translate-x-1 hover:border-blue-100 hover:bg-blue-50"
        >
          <ArrowRight size={16} />
          العودة للمرضى
        </Link>
      </FadeUp>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="font-bold text-slate-600">
          المريض غير متاح حالياً
          {id ? ` (رقم ${id})` : ""}
        </p>
        <p className="mt-2 text-sm text-slate-400">
          سيتم عرض الملف الطبي بعد ربط واجهة الـ API.
        </p>
      </div>
    </div>
  );
}

export default DoctorPatientDetailPage;
