import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CalendarPlus, Search, UserPlus } from "lucide-react";

import AdminPageHeader from "../../admin/components/AdminPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../../admin/components/AdminTable";
import Modal from "../../admin/components/Modal";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import {
  APPOINTMENT_STATUS_LABELS,
  CLINIC_TIME_SLOTS,
  careSystemStore,
} from "../../care-system/data/careSystemStore";

const todayIso = () => new Date().toISOString().slice(0, 10);

function ReceptionHomePage() {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patientModal, setPatientModal] = useState(false);
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [scheduleDoctorId, setScheduleDoctorId] = useState("");
  const [scheduleDate, setScheduleDate] = useState(todayIso());
  const [patientForm, setPatientForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    createWebAccount: true,
    nationalId: "",
    gender: "ذكر",
  });
  const [appointmentForm, setAppointmentForm] = useState({
    patientId: "",
    doctorId: "",
    date: todayIso(),
    time: "",
    type: "حضوري",
    notes: "",
  });
  const { toast, showToast, hideToast } = useToast();

  const reload = () => {
    setPatients(careSystemStore.listPatients());
    const activeDoctors = careSystemStore.listStaff("doctor").filter((d) => d.status === "active");
    setDoctors(activeDoctors);
    if (!scheduleDoctorId && activeDoctors[0]) {
      setScheduleDoctorId(activeDoctors[0].id);
    }
    const { patientName, doctorName } = careSystemStore.resolveNames();
    setAppointments(
      careSystemStore.listAppointments().map((apt) => ({
        ...apt,
        patient: patientName(apt.patientId),
        doctor: doctorName(apt.doctorId),
      }))
    );
  };

  useEffect(() => {
    reload();
    window.addEventListener("carelink-store-updated", reload);
    return () => window.removeEventListener("carelink-store-updated", reload);
  }, []);

  const filteredPatients = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) =>
      `${p.name} ${p.phone} ${p.email} ${p.nationalId}`.toLowerCase().includes(q)
    );
  }, [patients, query]);

  const doctorDaySchedule = useMemo(() => {
    if (!scheduleDoctorId || !scheduleDate) return [];
    return careSystemStore.getDoctorDaySchedule(scheduleDoctorId, scheduleDate);
  }, [scheduleDoctorId, scheduleDate, appointments]);

  const scheduleFreeSlots = useMemo(() => {
    if (!scheduleDoctorId || !scheduleDate) return [];
    return careSystemStore.getAvailableSlots(scheduleDoctorId, scheduleDate);
  }, [scheduleDoctorId, scheduleDate, appointments]);

  const bookingFreeSlots = useMemo(() => {
    if (!appointmentForm.doctorId || !appointmentForm.date) return [];
    return careSystemStore.getAvailableSlots(appointmentForm.doctorId, appointmentForm.date);
  }, [appointmentForm.doctorId, appointmentForm.date, appointments]);

  const bookingBusy = useMemo(() => {
    if (!appointmentForm.doctorId || !appointmentForm.date) return [];
    return careSystemStore.getDoctorDaySchedule(appointmentForm.doctorId, appointmentForm.date);
  }, [appointmentForm.doctorId, appointmentForm.date, appointments]);

  const savePatient = (event) => {
    event.preventDefault();
    try {
      const created = careSystemStore.savePatient({
        ...patientForm,
        createWebAccount: patientForm.createWebAccount,
      });
      showToast(
        patientForm.createWebAccount && patientForm.email
          ? "تم تسجيل المريض وإنشاء حساب الويب"
          : "تم تسجيل المريض",
        "success"
      );
      setPatientModal(false);
      setPatientForm({
        name: "",
        phone: "",
        email: "",
        password: "",
        createWebAccount: true,
        nationalId: "",
        gender: "ذكر",
      });
      if (created?.id) {
        setAppointmentForm((current) => ({
          ...current,
          patientId: created.id,
          date: todayIso(),
          time: "",
        }));
        setAppointmentModal(true);
      }
    } catch (error) {
      showToast(error.message || "تعذر تسجيل المريض", "error");
    }
  };

  const saveAppointment = (event) => {
    event.preventDefault();
    if (!appointmentForm.time) {
      showToast("اختر وقتاً فارغاً من جدول الطبيب", "error");
      return;
    }
    try {
      careSystemStore.saveAppointment({
        ...appointmentForm,
        createdBy: "reception",
        status: "scheduled",
      });
      showToast("تم إنشاء الموعد", "success");
      setAppointmentModal(false);
      setScheduleDoctorId(appointmentForm.doctorId);
      setScheduleDate(appointmentForm.date);
      setAppointmentForm({
        patientId: "",
        doctorId: "",
        date: todayIso(),
        time: "",
        type: "حضوري",
        notes: "",
      });
    } catch (error) {
      showToast(error.message || "تعذر إنشاء الموعد", "error");
    }
  };

  const transferToDoctor = (apt) => {
    careSystemStore.setAppointmentStatus(apt.id, "with_doctor");
    careSystemStore.upsertVisit({
      appointmentId: apt.id,
      patientId: apt.patientId,
      doctorId: apt.doctorId,
      status: "with_doctor",
      diagnosis: "",
      clinicalNotes: "",
    });
    showToast("تم تحويل المريض للطبيب", "success");
  };

  const openBooking = (patientId = "") => {
    setAppointmentForm({
      patientId,
      doctorId: scheduleDoctorId || doctors[0]?.id || "",
      date: scheduleDate || todayIso(),
      time: "",
      type: "حضوري",
      notes: "",
    });
    setAppointmentModal(true);
  };

  const selectedScheduleDoctor = doctors.find((d) => d.id === scheduleDoctorId);

  return (
    <div className="space-y-8">
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader
        title="لوحة الاستقبال"
        description="تسجيل المرضى، عرض جدول الطبيب، وحجز الأوقات الفاضية فقط."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPatientModal(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              <UserPlus size={16} />
              تسجيل مريض
            </button>
            <button
              type="button"
              onClick={() => openBooking()}
              className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100"
            >
              <CalendarPlus size={16} />
              موعد جديد
            </button>
          </div>
        }
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-blue-600" />
            <h2 className="text-lg font-extrabold text-blue-950">ملف مواعيد الطبيب</h2>
          </div>
          <p className="text-xs text-slate-500">عرض المحجوز والفاضي قبل الحجز</p>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-slate-600">الطبيب</span>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
              value={scheduleDoctorId}
              onChange={(e) => setScheduleDoctorId(e.target.value)}
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialty}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-slate-600">اليوم</span>
            <input
              type="date"
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </label>
        </div>

        {selectedScheduleDoctor && (
          <p className="mb-3 text-sm text-slate-600">
            جدول <span className="font-bold text-blue-950">{selectedScheduleDoctor.name}</span> ليوم{" "}
            <span className="font-bold" dir="ltr">
              {scheduleDate}
            </span>
            : {doctorDaySchedule.length} موعد محجوز · {scheduleFreeSlots.length} وقت فاضٍ
          </p>
        )}

        <div className="mb-4">
          <p className="mb-2 text-xs font-bold text-slate-500">الأوقات الفاضية</p>
          <div className="flex flex-wrap gap-2">
            {scheduleFreeSlots.length === 0 ? (
              <span className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700">
                لا توجد أوقات فاضية في هذا اليوم
              </span>
            ) : (
              scheduleFreeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  dir="ltr"
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                  onClick={() => {
                    setAppointmentForm((current) => ({
                      ...current,
                      doctorId: scheduleDoctorId,
                      date: scheduleDate,
                      time: slot,
                    }));
                    setAppointmentModal(true);
                  }}
                >
                  {slot}
                </button>
              ))
            )}
          </div>
        </div>

        <AdminTable
          columns={[
            { key: "time", label: "الوقت" },
            { key: "patient", label: "المريض" },
            { key: "status", label: "الحالة" },
            { key: "type", label: "النوع" },
          ]}
        >
          {doctorDaySchedule.length === 0 ? (
            <AdminTableRow>
              <AdminTableCell colSpan={4} className="text-center text-slate-500">
                لا مواعيد محجوزة لهذا الطبيب في هذا اليوم
              </AdminTableCell>
            </AdminTableRow>
          ) : (
            doctorDaySchedule.map((apt) => (
              <AdminTableRow key={apt.id}>
                <AdminTableCell dir="ltr" className="font-bold text-blue-950">
                  {apt.time}
                </AdminTableCell>
                <AdminTableCell>{apt.patient}</AdminTableCell>
                <AdminTableCell>{APPOINTMENT_STATUS_LABELS[apt.status]}</AdminTableCell>
                <AdminTableCell>{apt.type || "حضوري"}</AdminTableCell>
              </AdminTableRow>
            ))
          )}
        </AdminTable>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 px-3">
          <Search size={16} className="text-slate-400" />
          <input
            className="h-11 w-full text-sm outline-none"
            placeholder="ابحث عن مريض بالاسم أو الجوال أو الهوية..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <AdminTable
          columns={[
            { key: "name", label: "المريض" },
            { key: "phone", label: "الجوال" },
            { key: "account", label: "حساب ويب" },
            { key: "actions", label: "إجراء" },
          ]}
        >
          {filteredPatients.map((patient) => (
            <AdminTableRow key={patient.id}>
              <AdminTableCell className="font-bold text-blue-950">{patient.name}</AdminTableCell>
              <AdminTableCell dir="ltr">{patient.phone}</AdminTableCell>
              <AdminTableCell>{patient.hasWebAccount ? "نعم" : "لا"}</AdminTableCell>
              <AdminTableCell>
                <button
                  type="button"
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  onClick={() => openBooking(patient.id)}
                >
                  حجز موعد
                </button>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-extrabold text-blue-950">المواعيد اليوم</h2>
        <AdminTable
          columns={[
            { key: "patient", label: "المريض" },
            { key: "doctor", label: "الطبيب" },
            { key: "when", label: "الوقت" },
            { key: "status", label: "الحالة" },
            { key: "actions", label: "إجراء" },
          ]}
        >
          {appointments.map((apt) => (
            <AdminTableRow key={apt.id}>
              <AdminTableCell className="font-bold">{apt.patient}</AdminTableCell>
              <AdminTableCell>{apt.doctor}</AdminTableCell>
              <AdminTableCell>
                {apt.date} {apt.time}
              </AdminTableCell>
              <AdminTableCell>{APPOINTMENT_STATUS_LABELS[apt.status]}</AdminTableCell>
              <AdminTableCell>
                <div className="flex flex-wrap gap-2">
                  {apt.status === "scheduled" && (
                    <button
                      type="button"
                      className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"
                      onClick={() => {
                        careSystemStore.setAppointmentStatus(apt.id, "checked_in");
                        showToast("تم تسجيل الحضور", "success");
                      }}
                    >
                      تسجيل حضور
                    </button>
                  )}
                  {(apt.status === "checked_in" || apt.status === "scheduled") && (
                    <button
                      type="button"
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                      onClick={() => transferToDoctor(apt)}
                    >
                      تحويل للطبيب
                    </button>
                  )}
                  {apt.status !== "cancelled" && apt.status !== "completed" && (
                    <button
                      type="button"
                      className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700"
                      onClick={() => {
                        careSystemStore.setAppointmentStatus(apt.id, "cancelled");
                        showToast("تم إلغاء الموعد", "error");
                      }}
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      </section>

      {patientModal && (
        <Modal title="تسجيل مريض جديد" onClose={() => setPatientModal(false)} maxWidth="max-w-xl">
          <form className="space-y-3" onSubmit={savePatient}>
            <input
              className="h-11 w-full rounded-xl border px-3 text-sm"
              placeholder="الاسم الكامل"
              value={patientForm.name}
              onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
              required
            />
            <input
              className="h-11 w-full rounded-xl border px-3 text-sm"
              placeholder="الجوال"
              value={patientForm.phone}
              onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
              required
            />
            <input
              className="h-11 w-full rounded-xl border px-3 text-sm"
              placeholder="رقم الهوية"
              value={patientForm.nationalId}
              onChange={(e) => setPatientForm({ ...patientForm, nationalId: e.target.value })}
            />
            <select
              className="h-11 w-full rounded-xl border px-3 text-sm"
              value={patientForm.gender}
              onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
            >
              <option>ذكر</option>
              <option>أنثى</option>
            </select>

            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                checked={patientForm.createWebAccount}
                onChange={(e) =>
                  setPatientForm({ ...patientForm, createWebAccount: e.target.checked })
                }
              />
              إنشاء حساب ويب للمريض (بريد + كلمة مرور)
            </label>

            {patientForm.createWebAccount && (
              <>
                <input
                  type="email"
                  className="h-11 w-full rounded-xl border px-3 text-sm"
                  placeholder="البريد الإلكتروني"
                  value={patientForm.email}
                  onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  className="h-11 w-full rounded-xl border px-3 text-sm"
                  placeholder="كلمة المرور"
                  value={patientForm.password}
                  onChange={(e) => setPatientForm({ ...patientForm, password: e.target.value })}
                  required
                  minLength={6}
                />
              </>
            )}

            <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white">
              حفظ المريض ومتابعة الحجز
            </button>
          </form>
        </Modal>
      )}

      {appointmentModal && (
        <Modal title="إنشاء موعد" onClose={() => setAppointmentModal(false)} maxWidth="max-w-2xl">
          <form className="space-y-4" onSubmit={saveAppointment}>
            <select
              className="h-11 w-full rounded-xl border px-3 text-sm"
              value={appointmentForm.patientId}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, patientId: e.target.value })}
              required
            >
              <option value="">اختر المريض</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="grid gap-3 sm:grid-cols-2">
              <select
                className="h-11 w-full rounded-xl border px-3 text-sm"
                value={appointmentForm.doctorId}
                onChange={(e) =>
                  setAppointmentForm({ ...appointmentForm, doctorId: e.target.value, time: "" })
                }
                required
              >
                <option value="">اختر الطبيب</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialty}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="h-11 w-full rounded-xl border px-3 text-sm"
                value={appointmentForm.date}
                onChange={(e) =>
                  setAppointmentForm({ ...appointmentForm, date: e.target.value, time: "" })
                }
                required
              />
            </div>

            {appointmentForm.doctorId && appointmentForm.date && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 text-xs font-bold text-slate-600">
                  مواعيد الطبيب المحجوزة ({bookingBusy.length})
                </p>
                {bookingBusy.length === 0 ? (
                  <p className="mb-3 text-xs text-slate-500">لا مواعيد محجوزة في هذا اليوم</p>
                ) : (
                  <ul className="mb-3 space-y-1">
                    {bookingBusy.map((apt) => (
                      <li
                        key={apt.id}
                        className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs"
                      >
                        <span className="font-bold text-rose-700" dir="ltr">
                          {apt.time}
                        </span>
                        <span className="text-slate-700">{apt.patient}</span>
                        <span className="text-slate-500">{APPOINTMENT_STATUS_LABELS[apt.status]}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <p className="mb-2 text-xs font-bold text-slate-600">اختر وقتاً فارغاً</p>
                <div className="flex flex-wrap gap-2">
                  {CLINIC_TIME_SLOTS.map((slot) => {
                    const free = bookingFreeSlots.includes(slot);
                    const selected = appointmentForm.time === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        dir="ltr"
                        disabled={!free}
                        onClick={() => setAppointmentForm({ ...appointmentForm, time: slot })}
                        className={[
                          "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                          selected
                            ? "bg-blue-600 text-white"
                            : free
                              ? "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                              : "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 line-through",
                        ].join(" ")}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <textarea
              className="min-h-20 w-full rounded-xl border px-3 py-2 text-sm"
              placeholder="ملاحظات"
              value={appointmentForm.notes}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
            />
            <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white">
              حفظ الموعد
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default ReceptionHomePage;
