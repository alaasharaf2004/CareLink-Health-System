import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import FadeUp from "../../patient/components/FadeUp";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import {
  APPOINTMENT_STATUS_LABELS,
  careSystemStore,
} from "../../care-system/data/careSystemStore";

function DoctorAppointmentDetailPage() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [visit, setVisit] = useState(null);
  const [patient, setPatient] = useState(null);
  const [labOrders, setLabOrders] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [tests, setTests] = useState("");
  const [medications, setMedications] = useState("");
  const { toast, showToast, hideToast } = useToast();

  const reload = () => {
    const apt = careSystemStore.getAppointment(id);
    setAppointment(apt || null);
    if (!apt) return;
    setPatient(careSystemStore.getPatient(apt.patientId));
    const currentVisit = careSystemStore.getVisitByAppointment(apt.id);
    setVisit(currentVisit || null);
    setDiagnosis(currentVisit?.diagnosis || "");
    setNotes(currentVisit?.clinicalNotes || "");
    setLabOrders(
      careSystemStore.listLabOrders().filter((order) => order.appointmentId === apt.id)
    );
  };

  useEffect(() => {
    reload();
    window.addEventListener("carelink-store-updated", reload);
    return () => window.removeEventListener("carelink-store-updated", reload);
  }, [id]);

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

  const names = careSystemStore.resolveNames();

  const saveDiagnosis = () => {
    careSystemStore.upsertVisit({
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      status: appointment.status === "results_ready" ? "results_ready" : "with_doctor",
      diagnosis,
      clinicalNotes: notes,
    });
    careSystemStore.setAppointmentStatus(appointment.id, "with_doctor");
    showToast("تم حفظ التشخيص", "success");
  };

  const requestLabs = () => {
    if (!tests.trim()) return;
    careSystemStore.saveLabOrder({
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      tests: tests.trim(),
      status: "pending",
    });
    careSystemStore.setAppointmentStatus(appointment.id, "awaiting_lab");
    careSystemStore.upsertVisit({
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      status: "awaiting_lab",
      diagnosis,
      clinicalNotes: notes,
    });
    setTests("");
    showToast("تم إرسال طلب التحاليل للمختبر", "success");
  };

  const writePrescription = () => {
    if (!medications.trim()) return;
    careSystemStore.savePrescription({
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      medications: medications.trim(),
      status: "pending",
    });
    careSystemStore.setAppointmentStatus(appointment.id, "awaiting_pharmacy");
    careSystemStore.upsertVisit({
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      status: "awaiting_pharmacy",
      diagnosis,
      clinicalNotes: notes,
    });
    setMedications("");
    showToast("تم إرسال الوصفة للصيدلية", "success");
  };

  const endVisit = () => {
    careSystemStore.setAppointmentStatus(appointment.id, "completed");
    careSystemStore.upsertVisit({
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      status: "completed",
      diagnosis,
      clinicalNotes: notes,
      endedAt: new Date().toISOString(),
    });
    showToast("تم إنهاء الزيارة", "success");
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

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-blue-950">{patient?.name}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {appointment.date} — {appointment.time} · {names.doctorName(appointment.doctorId)}
            </p>
            <p className="mt-2 text-sm font-bold text-slate-600">
              الحالة: {APPOINTMENT_STATUS_LABELS[appointment.status]}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 text-sm">
          <p><span className="font-bold">الجوال:</span> {patient?.phone || "—"}</p>
          <p><span className="font-bold">الهوية:</span> {patient?.nationalId || "—"}</p>
          <p className="sm:col-span-2"><span className="font-bold">ملاحظة الموعد:</span> {appointment.notes || "—"}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-extrabold text-blue-950">التشخيص والملاحظات</h2>
          <textarea
            className="mt-3 min-h-24 w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="التشخيص"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
          <textarea
            className="mt-3 min-h-24 w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="ملاحظات سريرية"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button
            type="button"
            onClick={saveDiagnosis}
            className="mt-3 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            حفظ التشخيص
          </button>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-extrabold text-blue-950">طلب تحاليل</h2>
          <textarea
            className="mt-3 min-h-24 w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="مثال: صورة دم كاملة، سكر صائم"
            value={tests}
            onChange={(e) => setTests(e.target.value)}
          />
          <button
            type="button"
            onClick={requestLabs}
            className="mt-3 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
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
                  {order.resultText && <p className="mt-1 text-slate-700">{order.resultText}</p>}
                  {order.pdfName && <p className="text-xs text-blue-600">PDF: {order.pdfName}</p>}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-extrabold text-blue-950">وصفة طبية</h2>
          <textarea
            className="mt-3 min-h-24 w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="اسم الدواء والجرعة"
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
          />
          <button
            type="button"
            onClick={writePrescription}
            className="mt-3 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
          >
            إرسال للصيدلية
          </button>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-extrabold text-blue-950">إنهاء الزيارة</h2>
          <p className="mt-2 text-sm text-slate-500">
            استخدم الإنهاء إذا لم تحتج الزيارة لتحاليل أو صرف دواء، أو بعد اكتمال المسار.
          </p>
          <button
            type="button"
            onClick={endVisit}
            disabled={appointment.status === "completed"}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            إنهاء الزيارة
          </button>
          {visit?.endedAt && (
            <p className="mt-2 text-xs font-bold text-emerald-700">
              انتهت في {new Date(visit.endedAt).toLocaleString("ar")}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default DoctorAppointmentDetailPage;
