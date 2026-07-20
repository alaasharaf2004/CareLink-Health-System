import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  FlaskConical,
  Loader2,
  Pill,
  Scan,
} from "lucide-react";

import FadeUp from "../../patient/components/FadeUp";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import { useAuth } from "../../authentication/context/AuthContext";
import {
  APPOINTMENT_STATUS_LABELS,
  careSystemStore,
} from "../../care-system/data/careSystemStore";
import apiClient from "../../../lib/api/client";
import AppointmentChatBox from "../../care-system/components/AppointmentChatBox";

const STATUS_LABELS = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  completed: "مكتمل",
  cancelled: "ملغي",
  ...APPOINTMENT_STATUS_LABELS,
};

function loadLocalAppointment(id) {
  const apt = careSystemStore.getAppointment(id);
  if (!apt) return null;

  const patient = careSystemStore.getPatient(apt.patientId);
  const visit = careSystemStore.getVisitByAppointment(apt.id);
  const labs = careSystemStore.listLabOrders().filter((o) => o.appointmentId === apt.id);
  const imaging = careSystemStore
    .listImagingOrders()
    .filter((o) => o.appointmentId === apt.id);
  const prescriptions = careSystemStore
    .listPrescriptions()
    .filter((rx) => rx.appointmentId === apt.id);

  return {
    appointment: {
      id: apt.id,
      patientId: apt.patientId,
      doctorId: apt.doctorId,
      scheduled_at: `${apt.date} ${apt.time || "00:00"}`,
      status: apt.status,
      description: apt.notes || "",
      diagnosis: visit?.diagnosis || "",
      clinical_notes: visit?.clinicalNotes || "",
      lab_tests: labs.map((o) => o.tests).filter(Boolean).join("، ") || "",
      imaging_studies:
        imaging.map((o) => o.studies).filter(Boolean).join("، ") || "",
      medications: prescriptions.map((rx) => rx.medications).filter(Boolean).join("\n") || "",
    },
    patient: patient
      ? {
          id: patient.id,
          full_name: patient.name,
          name: patient.name,
          phone: patient.phone,
          national_id: patient.nationalId,
        }
      : null,
    labOrders: labs,
    imagingOrders: imaging,
  };
}

function VisitEndCeremony({ patientName, onDone }) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const timer = window.setTimeout(() => onDoneRef.current(), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="visit-end-overlay" role="status" aria-live="polite">
      <div className="visit-end-card">
        <div className="visit-end-check-wrap">
          <span className="visit-end-ring" aria-hidden="true" />
          <span className="visit-end-ring visit-end-ring--delay" aria-hidden="true" />
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="visit-end-spark" aria-hidden="true" />
          ))}
          <div className="visit-end-check">
            <Check size={34} strokeWidth={3} />
          </div>
        </div>
        <p className="text-lg font-extrabold text-[#101860]">تم إنهاء الزيارة</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          اكتملت زيارة{" "}
          <span className="font-bold text-emerald-700">{patientName || "المريض"}</span>{" "}
          بنجاح.
        </p>
      </div>
    </div>
  );
}

function DoctorAppointmentDetailPage() {
  const { id } = useParams();
  const { profile } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [labOrders, setLabOrders] = useState([]);
  const [imagingOrders, setImagingOrders] = useState([]);
  const [useLocal, setUseLocal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [tests, setTests] = useState("");
  const [imagingStudies, setImagingStudies] = useState("");
  const [medications, setMedications] = useState("");
  const [isEndingVisit, setIsEndingVisit] = useState(false);
  const [showEndCeremony, setShowEndCeremony] = useState(false);

  const { toast, showToast, hideToast } = useToast();

  const resolvePartyIds = () => {
    const localApt = careSystemStore.getAppointment(id);
    return {
      patientId:
        appointment?.patientId ||
        appointment?.patient_id ||
        patient?.id ||
        localApt?.patientId ||
        null,
      doctorId:
        appointment?.doctorId ||
        appointment?.doctor_id ||
        profile?.staffId ||
        localApt?.doctorId ||
        null,
    };
  };

  const applyLocal = ({ keepDrafts = false } = {}) => {
    const local = loadLocalAppointment(id);
    if (!local) {
      const labs = careSystemStore
        .listLabOrders()
        .filter((o) => String(o.appointmentId) === String(id));
      const imaging = careSystemStore
        .listImagingOrders()
        .filter((o) => String(o.appointmentId) === String(id));
      setLabOrders(labs);
      setImagingOrders(imaging);
      setAppointment((prev) =>
        prev
          ? {
              ...prev,
              lab_tests: labs.map((o) => o.tests).filter(Boolean).join("، ") || prev.lab_tests,
              imaging_studies:
                imaging.map((o) => o.studies).filter(Boolean).join("، ") ||
                prev.imaging_studies,
              medications:
                careSystemStore
                  .listPrescriptions()
                  .filter((rx) => String(rx.appointmentId) === String(id))
                  .map((rx) => rx.medications)
                  .filter(Boolean)
                  .join("\n") || prev.medications,
            }
          : prev
      );
      if (!keepDrafts) {
        setTests("");
        setImagingStudies("");
        setMedications("");
      }
      return false;
    }

    setUseLocal(true);
    setAppointment(local.appointment);
    setPatient(local.patient);
    setLabOrders(local.labOrders);
    setImagingOrders(local.imagingOrders || []);
    setDiagnosis(local.appointment.diagnosis || "");
    setNotes(local.appointment.clinical_notes || "");
    if (!keepDrafts) {
      setTests("");
      setImagingStudies("");
      setMedications("");
    }
    return true;
  };

  const fetchAppointmentDetails = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/doctor/appointments/${id}`);
      const data = response.data?.data || response.data;

      setUseLocal(false);
      setAppointment(data);
      setPatient(data.patient || null);
      setDiagnosis(data.diagnosis || "");
      setNotes(data.clinical_notes || "");
      setTests("");
      setImagingStudies("");
      setMedications("");
      setLabOrders(data.lab_orders || []);
      setImagingOrders(data.imaging_orders || []);
    } catch {
      if (!applyLocal({ keepDrafts: true })) {
        showToast("خطأ في جلب تفاصيل الموعد", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchAppointmentDetails();
    const onStore = () => {
      if (useLocal) applyLocal({ keepDrafts: true });
    };
    window.addEventListener("carelink-store-updated", onStore);
    return () => window.removeEventListener("carelink-store-updated", onStore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, useLocal]);

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
    const { patientId, doctorId } = resolvePartyIds();
    try {
      if (!useLocal) {
        try {
          const response = await apiClient.post(`/doctor/appointments/${id}/diagnosis`, {
            diagnosis,
            clinical_notes: notes,
          });
          setAppointment(response.data.data || response.data);
        } catch {
          setUseLocal(true);
        }
      }

      careSystemStore.upsertVisit({
        appointmentId: id,
        patientId,
        doctorId,
        status: "with_doctor",
        diagnosis,
        clinicalNotes: notes,
      });
      if (careSystemStore.getAppointment(id)) {
        careSystemStore.setAppointmentStatus(id, "with_doctor");
      }
      applyLocal({ keepDrafts: true });
      showToast("تم حفظ التشخيص بنجاح", "success");
    } catch {
      showToast("خطأ أثناء حفظ التشخيص", "error");
    }
  };

  const requestLabs = async () => {
    if (!tests.trim()) return;
    const { patientId, doctorId } = resolvePartyIds();
    const testsText = tests.trim();

    try {
      if (!useLocal) {
        try {
          await apiClient.post(`/doctor/appointments/${id}/lab-orders`, {
            tests: testsText,
          });
        } catch {
          setUseLocal(true);
        }
      }

      careSystemStore.saveLabOrder({
        appointmentId: id,
        patientId,
        doctorId,
        tests: testsText,
        status: "pending",
      });
      if (careSystemStore.getAppointment(id)) {
        careSystemStore.setAppointmentStatus(id, "awaiting_lab");
      }
      careSystemStore.upsertVisit({
        appointmentId: id,
        patientId,
        doctorId,
        status: "awaiting_lab",
        diagnosis,
        clinicalNotes: notes,
      });

      applyLocal();
      setTests("");
      showToast("تم إرسال طلب التحاليل للمختبر", "success");
    } catch {
      showToast("خطأ أثناء إرسال التحاليل", "error");
    }
  };

  const requestImaging = async () => {
    if (!imagingStudies.trim()) return;
    const { patientId, doctorId } = resolvePartyIds();
    const studiesText = imagingStudies.trim();

    try {
      careSystemStore.saveImagingOrder({
        appointmentId: id,
        patientId,
        doctorId,
        studies: studiesText,
        status: "pending",
      });
      if (careSystemStore.getAppointment(id)) {
        careSystemStore.setAppointmentStatus(id, "awaiting_radiology");
      }
      careSystemStore.upsertVisit({
        appointmentId: id,
        patientId,
        doctorId,
        status: "awaiting_radiology",
        diagnosis,
        clinicalNotes: notes,
      });

      applyLocal();
      setImagingStudies("");
      showToast("تم إرسال طلب الأشعة لفني التصوير", "success");
    } catch {
      showToast("خطأ أثناء إرسال طلب الأشعة", "error");
    }
  };

  const writePrescription = async () => {
    if (!medications.trim()) return;
    const { patientId, doctorId } = resolvePartyIds();
    const medsText = medications.trim();

    const localPatient = patientId ? careSystemStore.getPatient(patientId) : null;
    const patientName =
      patient?.full_name || patient?.name || localPatient?.name || "مريض";
    const patientPhone = patient?.phone || localPatient?.phone || "";
    const nationalId =
      patient?.national_id ||
      patient?.nationalId ||
      localPatient?.nationalId ||
      "";

    try {
      if (!useLocal) {
        try {
          await apiClient.post(`/doctor/appointments/${id}/prescriptions`, {
            medications: medsText,
          });
        } catch {
          setUseLocal(true);
        }
      }

      careSystemStore.savePrescription({
        appointmentId: id,
        patientId,
        doctorId,
        medications: medsText,
        status: "pending",
        patientName,
        patientPhone,
        nationalId,
      });
      if (careSystemStore.getAppointment(id)) {
        careSystemStore.setAppointmentStatus(id, "awaiting_pharmacy");
      }
      careSystemStore.upsertVisit({
        appointmentId: id,
        patientId,
        doctorId,
        status: "awaiting_pharmacy",
        diagnosis,
        clinicalNotes: notes,
      });

      applyLocal();
      setMedications("");
      showToast(`تم إرسال وصفة ${patientName} للصيدلية`, "success");
    } catch {
      showToast("خطأ أثناء إرسال الوصفة", "error");
    }
  };

  const endVisit = async () => {
    if (isEndingVisit || appointment.status === "completed") return;

    const { patientId, doctorId } = resolvePartyIds();
    setIsEndingVisit(true);
    setShowEndCeremony(true);

    try {
      if (!useLocal) {
        try {
          await apiClient.post(`/doctor/appointments/${id}/complete`);
        } catch {
          setUseLocal(true);
        }
      }

      if (careSystemStore.getAppointment(id)) {
        careSystemStore.setAppointmentStatus(id, "completed");
      }
      careSystemStore.upsertVisit({
        appointmentId: id,
        patientId,
        doctorId,
        status: "completed",
        diagnosis,
        clinicalNotes: notes,
        endedAt: new Date().toISOString(),
      });

      if (patientId) {
        careSystemStore.notifyPatient({
          patientId,
          title: "انتهت زيارتك",
          body: `أنهى الطبيب زيارتك${diagnosis ? ` — التشخيص: ${diagnosis}` : ""}. يمكنك مراجعة التفاصيل والسجلات من لوحتك.`,
          type: "visit",
        });
      }

      setAppointment((prev) => (prev ? { ...prev, status: "completed" } : prev));
      applyLocal({ keepDrafts: true });
    } catch {
      setShowEndCeremony(false);
      setIsEndingVisit(false);
      showToast("خطأ أثناء إنهاء الزيارة", "error");
    }
  };

  const handleCeremonyDone = () => {
    setShowEndCeremony(false);
    setIsEndingVisit(false);
    showToast("تم إنهاء الزيارة بنجاح", "success");
  };

  const patientDisplayName = patient?.full_name || patient?.name || "المريض";
  const visitCompleted = appointment.status === "completed";

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />
      {showEndCeremony ? (
        <VisitEndCeremony
          patientName={patientDisplayName}
          onDone={handleCeremonyDone}
        />
      ) : null}

      <FadeUp index={0}>
        <Link
          to="/doctor/appointments"
          className="inline-flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-bold text-blue-600 hover:bg-blue-50"
        >
          <ArrowRight size={16} />
          العودة للمواعيد
        </Link>
      </FadeUp>

      <FadeUp index={1}>
        <div className="patient-card overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold text-blue-950">{patientDisplayName}</h1>
              <p className="mt-1 text-sm text-slate-500" dir="ltr">
                {appointment.scheduled_at}
              </p>
              <p className="mt-2 text-sm font-bold text-slate-600">
                الحالة الحالية:{" "}
                <span className="text-blue-600">
                  {STATUS_LABELS[appointment.status] || appointment.status}
                </span>
              </p>
            </div>
            {visitCompleted ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                <Check size={14} />
                زيارة مكتملة
              </span>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-2">
            <p>
              <span className="font-bold">الجوال:</span> {patient?.phone || "—"}
            </p>
            <p>
              <span className="font-bold">الهوية:</span> {patient?.national_id || "—"}
            </p>
            <p className="sm:col-span-2">
              <span className="font-bold">ملاحظة الموعد:</span>{" "}
              {appointment.description || "—"}
            </p>
          </div>
        </div>
      </FadeUp>

      <FadeUp index={2}>
        <div className="patient-card rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-blue-950">
            <CheckCircle2 size={20} className="text-blue-600" />
            ملخص الإجراءات الطبية المسجلة لهذه الحالة
          </h2>
          <div className="grid gap-4 text-sm md:grid-cols-2 xl:grid-cols-4">
            <div className="workspace-stat-chip rounded-xl border border-blue-100 bg-white p-4 shadow-xs">
              <span className="mb-1 flex items-center gap-1.5 font-bold text-blue-900">
                <FileText size={16} className="text-blue-600" /> التشخيص والملاحظات:
              </span>
              <p className="mt-1 text-slate-600">
                {appointment.diagnosis || "لم يُسجل تشخيص بعد"}
              </p>
              {appointment.clinical_notes && (
                <p className="mt-1 text-xs text-slate-400">
                  ملاحظات: {appointment.clinical_notes}
                </p>
              )}
            </div>

            <div className="workspace-stat-chip rounded-xl border border-teal-100 bg-white p-4 shadow-xs">
              <span className="mb-1 flex items-center gap-1.5 font-bold text-teal-900">
                <FlaskConical size={16} className="text-teal-600" /> التحاليل المطلوبة:
              </span>
              <p className="mt-1 text-slate-600">
                {appointment.lab_tests || "لا توجد تحاليل مطلوبة"}
              </p>
            </div>

            <div className="workspace-stat-chip rounded-xl border border-cyan-100 bg-white p-4 shadow-xs">
              <span className="mb-1 flex items-center gap-1.5 font-bold text-cyan-900">
                <Scan size={16} className="text-cyan-600" /> الأشعة المطلوبة:
              </span>
              <p className="mt-1 text-slate-600">
                {appointment.imaging_studies || "لا توجد فحوصات أشعة"}
              </p>
            </div>

            <div className="workspace-stat-chip rounded-xl border border-indigo-100 bg-white p-4 shadow-xs">
              <span className="mb-1 flex items-center gap-1.5 font-bold text-indigo-900">
                <Pill size={16} className="text-indigo-600" /> الوصفة الطبية:
              </span>
              <p className="mt-1 text-slate-600">
                {appointment.medications || "لم تُسجل وصفة طبية بعد"}
              </p>
            </div>
          </div>
        </div>
      </FadeUp>

      <div className="grid gap-6 lg:grid-cols-2">
        <FadeUp index={3} className="h-full">
          <section className="patient-card h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-extrabold text-blue-950">التشخيص والملاحظات</h2>
            <textarea
              className="mt-3 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="التشخيص"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
            <textarea
              className="mt-3 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="ملاحظات سريرية"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button
              type="button"
              onClick={saveDiagnosis}
              className="workspace-btn-press mt-3 cursor-pointer rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              حفظ التشخيص
            </button>
          </section>
        </FadeUp>

        <FadeUp index={4} className="h-full">
          <section className="patient-card h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-extrabold text-blue-950">طلب تحاليل</h2>
            <textarea
              className="mt-3 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              placeholder="مثال: صورة دم كاملة، سكر صائم"
              value={tests}
              onChange={(e) => setTests(e.target.value)}
            />
            <button
              type="button"
              onClick={requestLabs}
              className="workspace-btn-press mt-3 cursor-pointer rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
            >
              إرسال للمختبر
            </button>

            {labOrders.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-extrabold text-slate-700">نتائج / طلبات سابقة</h3>
                {labOrders.map((order) => (
                  <div
                    key={order.id}
                    className="workspace-list-row rounded-xl bg-slate-50 p-3 text-sm"
                  >
                    <p className="font-bold">{order.tests}</p>
                    <p className="text-slate-500">
                      {order.status === "completed" ? "نتيجة جاهزة" : "بانتظار المختبر"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </FadeUp>

        <FadeUp index={5} className="h-full">
          <section className="patient-card h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-extrabold text-blue-950">طلب أشعة</h2>
            <textarea
              className="mt-3 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              placeholder="مثال: أشعة صدر، موجات فوق صوتية للبطن"
              value={imagingStudies}
              onChange={(e) => setImagingStudies(e.target.value)}
            />
            <button
              type="button"
              onClick={requestImaging}
              className="workspace-btn-press mt-3 cursor-pointer rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-cyan-700"
            >
              إرسال للأشعة
            </button>

            {imagingOrders.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-extrabold text-slate-700">تقارير / طلبات سابقة</h3>
                {imagingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="workspace-list-row rounded-xl bg-slate-50 p-3 text-sm"
                  >
                    <p className="font-bold">{order.studies}</p>
                    <p className="text-slate-500">
                      {order.status === "completed" ? "تقرير جاهز" : "بانتظار الأشعة"}
                    </p>
                    {order.resultText ? (
                      <p className="mt-1 text-xs text-slate-600">{order.resultText}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>
        </FadeUp>

        <FadeUp index={6} className="h-full">
          <section className="patient-card flex h-full min-h-[380px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-extrabold text-blue-950">وصفة طبية</h2>
            <p className="mt-1 text-xs font-semibold text-slate-400">
              اكتب الدواء ثم أرسله للصيدلية — الدردشة جنب الوصفة للتواصل السريع
            </p>
            <textarea
              className="mt-3 min-h-32 flex-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="اسم الدواء والجرعة"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
            />
            <button
              type="button"
              onClick={writePrescription}
              className="workspace-btn-press mt-3 cursor-pointer rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
            >
              إرسال للصيدلية
            </button>
          </section>
        </FadeUp>

        <FadeUp index={7} className="h-full">
          <AppointmentChatBox
            appointmentId={id}
            role="doctor"
            peerName={patientDisplayName}
            selfName="الطبيب"
            className="patient-card !h-full min-h-[380px]"
          />
        </FadeUp>
      </div>

      <FadeUp index={8}>
        <section className="visit-end-box rounded-2xl border border-slate-200 bg-gradient-to-l from-slate-50 via-white to-emerald-50/40 p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-base font-extrabold text-[#101860]">
                <CheckCircle2 size={20} className="text-emerald-600" />
                إنهاء الزيارة
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                عند الإنهاء تُحدَّث حالة الموعد إلى مكتمل ويصل إشعار للمريض. استخدمه بعد
                التشخيص أو إرسال التحاليل/الوصفة، أو إذا اكتملت الزيارة مباشرة.
              </p>
            </div>
            <button
              type="button"
              onClick={endVisit}
              disabled={visitCompleted || isEndingVisit}
              className="visit-end-btn workspace-btn-press inline-flex min-w-[10rem] cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#101860] to-slate-900 px-5 py-3 text-sm font-bold text-white hover:from-slate-900 hover:to-[#101860] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEndingVisit ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  جاري الإنهاء...
                </>
              ) : visitCompleted ? (
                <>
                  <Check size={16} />
                  مكتملة
                </>
              ) : (
                "إنهاء الزيارة"
              )}
            </button>
          </div>
          {visitCompleted && (
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
              <CheckCircle2 size={14} />
              تم إكمال الزيارة وإشعار المريض.
            </p>
          )}
        </section>
      </FadeUp>
    </div>
  );
}

export default DoctorAppointmentDetailPage;
