import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2, FileText, FlaskConical, Pill, CheckCircle2 } from "lucide-react";

import FadeUp from "../../patient/components/FadeUp";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import apiClient from "../../../lib/api/client";

const STATUS_LABELS = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  with_doctor: "مع الطبيب",
  awaiting_lab: "بانتظار المختبر",
  awaiting_pharmacy: "بانتظار الصيدلية",
  completed: "مكتمل",
  cancelled: "ملغي",
};

function DoctorAppointmentDetailPage() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [labOrders, setLabOrders] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [tests, setTests] = useState("");
  const [medications, setMedications] = useState("");
  
  const { toast, showToast, hideToast } = useToast();

  const fetchAppointmentDetails = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/doctor/appointments/${id}`);
      const data = response.data.data || response.data;
      
      setAppointment(data);
      setPatient(data.patient || null);
      
      // تعبئة الحقول بالبيانات المخزنة مسبقاً إن وجدت في الموعد
      setDiagnosis(data.diagnosis || "");
      setNotes(data.clinical_notes || "");
      if (data.lab_tests) {
        setTests(data.lab_tests);
      }
      if (data.medications) {
        setMedications(data.medications);
      }

      if (data.lab_orders) {
        setLabOrders(data.lab_orders);
      }
    } catch {
      showToast("خطأ في جلب تفاصيل الموعد", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={36} />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="font-bold text-slate-600">الموعد غير متاح</p>
        <Link to="/doctor/appointments" className="mt-4 inline-flex text-sm font-bold text-blue-600">
          العودة للمواعيد
        </Link>
      </div>
    );
  }

  const saveDiagnosis = async () => {
    try {
      const response = await apiClient.post(`/doctor/appointments/${id}/diagnosis`, {
        diagnosis,
        clinical_notes: notes,
      });
      setAppointment(response.data.data || response.data);
      showToast("تم حفظ التشخيص بنجاح", "success");
      fetchAppointmentDetails();
    } catch {
      showToast("خطأ أثناء حفظ التشخيص", "error");
    }
  };

  const requestLabs = async () => {
    if (!tests.trim()) return;
    try {
      const response = await apiClient.post(`/doctor/appointments/${id}/lab-orders`, {
        tests: tests.trim(),
      });
      setAppointment(response.data.data || response.data);
      showToast("تم إرسال طلب التحاليل للمختبر", "success");
      fetchAppointmentDetails();
    } catch {
      showToast("خطأ أثناء إرسال التحاليل", "error");
    }
  };

  const writePrescription = async () => {
    if (!medications.trim()) return;
    try {
      const response = await apiClient.post(`/doctor/appointments/${id}/prescriptions`, {
        medications: medications.trim(),
      });
      setAppointment(response.data.data || response.data);
      showToast("تم إرسال الوصفة للصيدلية", "success");
      fetchAppointmentDetails();
    } catch {
      showToast("خطأ أثناء إرسال الوصفة", "error");
    }
  };

  const endVisit = async () => {
    try {
      const response = await apiClient.post(`/doctor/appointments/${id}/complete`);
      setAppointment(response.data.data || response.data);
      showToast("تم إنهاء الزيارة بنجاح", "success");
      fetchAppointmentDetails();
    } catch {
      showToast("خطأ أثناء إنهاء الزيارة", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />
      <FadeUp index={0}>
        <Link
          to="/doctor/appointments"
          className="inline-flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-bold text-blue-600 hover:bg-blue-50"
        >
          <ArrowRight size={16} />
          العودة للمواعيد
        </Link>
      </FadeUp>

      {/* معلومات الموعد الأساسية */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-blue-950">{patient?.full_name || "مريض"}</h1>
            <p className="mt-1 text-sm text-slate-500" dir="ltr">
              {appointment.scheduled_at}
            </p>
            <p className="mt-2 text-sm font-bold text-slate-600">
              الحالة الحالية: <span className="text-blue-600">{STATUS_LABELS[appointment.status] || appointment.status}</span>
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 text-sm border-t border-slate-100 pt-4">
          <p><span className="font-bold">الجوال:</span> {patient?.phone || "—"}</p>
          <p><span className="font-bold">الهوية:</span> {patient?.national_id || "—"}</p>
          <p className="sm:col-span-2"><span className="font-bold">ملاحظة الموعد:</span> {appointment.description || "—"}</p>
        </div>
      </div>

      {/* كارد ملخص ما تم إنجازه للحالة */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-blue-950 mb-4">
          <CheckCircle2 size={20} className="text-blue-600" />
          ملخص الإجراءات الطبية المسجلة لهذه الحالة
        </h2>
        <div className="grid gap-4 md:grid-cols-3 text-sm">
          <div className="rounded-xl bg-white p-4 border border-blue-100 shadow-xs">
            <span className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
              <FileText size={16} className="text-blue-600" /> التشخيص والملاحظات:
            </span>
            <p className="text-slate-600 mt-1">{appointment.diagnosis || "لم يُسجل تشخيص بعد"}</p>
            {appointment.clinical_notes && (
              <p className="text-xs text-slate-400 mt-1">ملاحظات: {appointment.clinical_notes}</p>
            )}
          </div>

          <div className="rounded-xl bg-white p-4 border border-teal-100 shadow-xs">
            <span className="flex items-center gap-1.5 font-bold text-teal-900 mb-1">
              <FlaskConical size={16} className="text-teal-600" /> التحاليل المطلوبة:
            </span>
            <p className="text-slate-600 mt-1">{appointment.lab_tests || "لا توجد تحاليل مطلوبة"}</p>
          </div>

          <div className="rounded-xl bg-white p-4 border border-indigo-100 shadow-xs">
            <span className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
              <Pill size={16} className="text-indigo-600" /> الوصفة الطبية:
            </span>
            <p className="text-slate-600 mt-1">{appointment.medications || "لم تُسجل وصفة طبية بعد"}</p>
          </div>
        </div>
      </div>

      {/* النماذج وأزرار التعديل والإدخال */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-extrabold text-blue-950">التشخيص والملاحظات</h2>
          <textarea
            className="mt-3 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="التشخيص"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
          <textarea
            className="mt-3 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="ملاحظات سريرية"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button
            type="button"
            onClick={saveDiagnosis}
            className="mt-3 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 cursor-pointer transition-colors"
          >
            حفظ التشخيص
          </button>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-extrabold text-blue-950">طلب تحاليل</h2>
          <textarea
            className="mt-3 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            placeholder="مثال: صورة دم كاملة، سكر صائم"
            value={tests}
            onChange={(e) => setTests(e.target.value)}
          />
          <button
            type="button"
            onClick={requestLabs}
            className="mt-3 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 cursor-pointer transition-colors"
          >
            إرسال للمختبر
          </button>

          {labOrders.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-extrabold text-slate-700">نتائج / طلبات سابقة</h3>
              {labOrders.map((order) => (
                <div key={order.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                  <p className="font-bold">{order.tests}</p>
                  <p className="text-slate-500">{order.status === "completed" ? "نتيجة جاهزة" : "بانتظار المختبر"}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-extrabold text-blue-950">وصفة طبية</h2>
          <textarea
            className="mt-3 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="اسم الدواء والجرعة"
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
          />
          <button
            type="button"
            onClick={writePrescription}
            className="mt-3 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 cursor-pointer transition-colors"
          >
            إرسال للصيدلية
          </button>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-extrabold text-blue-950">إنهاء الزيارة</h2>
          <p className="mt-2 text-sm text-slate-500">
            استخدم الإنهاء إذا لم تحتج الزيارة لتحاليل أو صرف دواء، أو بعد اكتمال المسار.
          </p>
          <button
            type="button"
            onClick={endVisit}
            disabled={appointment.status === "completed"}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer transition-colors"
          >
            إنهاء الزيارة
          </button>
          {appointment.status === "completed" && (
            <p className="mt-2 text-xs font-bold text-emerald-700">
              تم إكمال الزيارة بنجاح.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default DoctorAppointmentDetailPage;