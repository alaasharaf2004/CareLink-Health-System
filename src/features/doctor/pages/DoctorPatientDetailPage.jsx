import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Loader2,
  User,
  Phone,
  Calendar,
  FileText,
} from "lucide-react";

import FadeUp from "../../patient/components/FadeUp";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import apiClient from "../../../lib/api/client";

function DoctorPatientDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  const fetchPatientDetails = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/doctor/patients/${id}`);
      setPatient(response.data.data || null);
    } catch {
      showToast("خطأ في جلب بيانات المريض", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={36} />
      </div>
    );
  }

  if (!patient) {
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
            المريض غير متوفر حالياً أو ليس لديك صلاحية لعرضه
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />
      <FadeUp index={0}>
        <Link
          to="/doctor/patients"
          className="inline-flex items-center gap-2 rounded-xl border border-transparent px-2 py-1 text-sm font-bold text-blue-600 transition-all duration-200 hover:-translate-x-1 hover:border-blue-100 hover:bg-blue-50"
        >
          <ArrowRight size={16} />
          العودة للمرضى
        </Link>
      </FadeUp>

      {/* معلومات المريض الأساسية */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-blue-950">
              {patient.full_name}
            </h1>
            <p className="text-sm text-slate-500">رقم الملف: #{patient.id}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
          <p className="flex items-center gap-2 text-slate-600">
            <Phone size={16} className="text-slate-400" />
            <span className="font-bold">الهاتف:</span>{" "}
            <span dir="ltr">{patient.phone || "—"}</span>
          </p>
          <p className="flex items-center gap-2 text-slate-600">
            <span className="font-bold">رقم الهوية:</span>{" "}
            {patient.national_id || "—"}
          </p>
          <p className="flex items-center gap-2 text-slate-600">
            <span className="font-bold">فصيلة الدم:</span>{" "}
            {patient.blood_type || "—"}
          </p>
        </div>
      </div>

      {/* سجل المواعيد والتشخيصات السابقة */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950">
          <Calendar size={18} className="text-blue-600" />
          سجل الزيارات والتشخيصات
        </h2>

        {!patient.appointments || patient.appointments.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">
            لا توجد زيارات مسجلة لهذا المريض معك.
          </p>
        ) : (
          <div className="space-y-3">
            {patient.appointments.map((app) => (
              <div
                key={app.id}
                className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-950" dir="ltr">
                    {app.scheduled_at}
                  </span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                    {app.status}
                  </span>
                </div>
                {app.diagnosis ? (
                  <p className="text-slate-700">
                    <span className="font-bold">التشخيص:</span> {app.diagnosis}
                  </p>
                ) : (
                  <p className="text-slate-400 italic">
                    لم يتم تسجيل تشخيص لهذه الزيارة
                  </p>
                )}
                {app.medications && (
                  <p className="text-slate-600 text-xs">
                    <span className="font-bold">الأدوية:</span>{" "}
                    {app.medications}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorPatientDetailPage;
