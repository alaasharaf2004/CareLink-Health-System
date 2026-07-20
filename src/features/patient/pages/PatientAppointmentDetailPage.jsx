import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import {
  APPOINTMENT_STATUS_LABELS,
  careSystemStore,
} from "../../care-system/data/careSystemStore";
import FadeUp from "../components/FadeUp";
import {
  AppointmentStatusBadge,
  AppointmentTypeBadge,
} from "../components/AppointmentBadges";
import AppointmentChatBox from "../../care-system/components/AppointmentChatBox";

function PatientAppointmentDetailPage() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [labs, setLabs] = useState([]);
  const [imaging, setImaging] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [visit, setVisit] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const reload = () => {
      const apt = careSystemStore.getAppointment(id);
      setAppointment(apt || null);
      if (!apt) return;
      const { staffById } = careSystemStore.resolveNames();
      setDoctor(staffById(apt.doctorId));
      setVisit(careSystemStore.getVisitByAppointment(apt.id) || null);
      setLabs(careSystemStore.listLabOrders().filter((o) => o.appointmentId === apt.id));
      setImaging(
        careSystemStore.listImagingOrders().filter((o) => o.appointmentId === apt.id)
      );
      setPrescriptions(
        careSystemStore.listPrescriptions().filter((rx) => rx.appointmentId === apt.id)
      );
    };
    reload();
    window.addEventListener("carelink-store-updated", reload);
    return () => window.removeEventListener("carelink-store-updated", reload);
  }, [id]);

  if (!appointment) {
    return (
      <div className="space-y-6">
        <FadeUp index={0}>
          <Link
            to="/patient/appointments"
            className="inline-flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-bold text-blue-600 hover:bg-blue-50"
          >
            <ArrowRight size={16} />
            العودة للمواعيد
          </Link>
        </FadeUp>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="font-bold text-slate-600">الموعد غير متاح</p>
        </div>
      </div>
    );
  }

  const type =
    appointment.type === "عن بُعد" || appointment.type === "online"
      ? "online"
      : "in_person";

  return (
    <div className="space-y-6">
      <FadeUp index={0}>
        <Link
          to="/patient/appointments"
          className="inline-flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-bold text-blue-600 hover:bg-blue-50"
        >
          <ArrowRight size={16} />
          العودة للمواعيد
        </Link>
      </FadeUp>

      <FadeUp index={1}>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold text-blue-950">
                {doctor?.name || "الطبيب"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {doctor?.specialty || "—"} · {appointment.date} — {appointment.time}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <AppointmentTypeBadge type={type} />
              <AppointmentStatusBadge status={appointment.status} />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            <span className="font-bold">ملاحظات:</span> {appointment.notes || "—"}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            مسار الزيارة: {APPOINTMENT_STATUS_LABELS[appointment.status] || appointment.status}
          </p>
        </div>
      </FadeUp>

      <FadeUp index={2}>
        <AppointmentChatBox
          appointmentId={id}
          role="patient"
          peerName={doctor?.name || "الطبيب"}
          selfName="المريض"
        />
      </FadeUp>

      {visit?.diagnosis && (
        <FadeUp index={3}>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-extrabold text-blue-950">التشخيص</h2>
            <p className="mt-2 text-sm text-slate-700">{visit.diagnosis}</p>
            {visit.clinicalNotes && (
              <p className="mt-2 text-sm text-slate-500">{visit.clinicalNotes}</p>
            )}
          </div>
        </FadeUp>
      )}

      {labs.length > 0 && (
        <FadeUp index={4}>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 font-extrabold text-blue-950">التحاليل</h2>
            <div className="space-y-2">
              {labs.map((lab) => (
                <div key={lab.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                  <p className="font-bold">{lab.tests}</p>
                  <p className="text-slate-500">
                    {lab.status === "completed" ? "نتيجة جاهزة" : "قيد التنفيذ"}
                  </p>
                  {lab.resultText && <p className="mt-1">{lab.resultText}</p>}
                  {lab.pdfName && (
                    <p className="mt-1 text-xs font-bold text-blue-600">PDF: {lab.pdfName}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      )}

      {imaging.length > 0 && (
        <FadeUp index={5}>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 font-extrabold text-blue-950">الأشعة</h2>
            <div className="space-y-2">
              {imaging.map((order) => (
                <div key={order.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                  <p className="font-bold">{order.studies}</p>
                  <p className="text-slate-500">
                    {order.status === "completed" ? "تقرير جاهز" : "قيد التنفيذ"}
                  </p>
                  {order.resultText && <p className="mt-1">{order.resultText}</p>}
                  {order.pdfName && (
                    <p className="mt-1 text-xs font-bold text-blue-600">PDF: {order.pdfName}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      )}

      {prescriptions.length > 0 && (
        <FadeUp index={6}>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 font-extrabold text-blue-950">الوصفات</h2>
            <div className="space-y-2">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                  <p className="font-bold">{rx.medications}</p>
                  <p className="text-slate-500">
                    {rx.status === "dispensed" ? "تم الصرف" : "بانتظار الصيدلية"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      )}
    </div>
  );
}

export default PatientAppointmentDetailPage;
