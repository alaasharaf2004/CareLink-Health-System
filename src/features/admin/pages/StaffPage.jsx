import { useEffect, useMemo, useState } from "react";
import { Ban, CheckCircle2, Loader2, Pencil, Plus, Trash2, Users } from "lucide-react";

import AdminPageHeader from "../components/AdminPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../components/AdminTable";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import apiClient from "../../../lib/api/client";

const ROLE_TABS = [
  { value: "doctor", label: "الأطباء" },
  { value: "reception", label: "الاستقبال" },
  { value: "laboratory", label: "المختبر" },
  { value: "pharmacy", label: "الصيدلية" },
];

const COLUMNS = [
  { key: "name", label: "الاسم" },
  { key: "email", label: "البريد" },
  { key: "national_id", label: "الهوية" },
  { key: "department", label: "القسم" },
  { key: "specialty", label: "التخصص" },
  { key: "status", label: "الحالة" },
  { key: "actions", label: "الإجراءات", className: "w-40" },
];

function StaffPage() {
  const [role, setRole] = useState("doctor");
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    national_id: "",
    phone: "",
    department: "",
    specialty: "",
  });
  const { toast, showToast, hideToast } = useToast();

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get(`/admin/staff?role=${role}`);
      setStaff(res.data.data || []);
    } catch {
      showToast("خطأ في جلب بيانات الكوادر", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [role]);

  const title = useMemo(
    () => ROLE_TABS.find((item) => item.value === role)?.label || "الكوادر",
    [role]
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", email: "", password: "", national_id: "", phone: "", department: "", specialty: "" });
    setIsOpen(true);
  };

  const openEdit = (member) => {
    setEditing(member);
    // جلب البيانات سواء كانت من الجذر أو من كائن البروفايل المرتبط
    const profile = member.doctor_profile || member.receptionist_profile || member.lab_profile || {};
    setForm({
      name: member.name || "",
      email: member.email || "",
      national_id: member.national_id || "",
      phone: member.phone || "",
      department: profile.department || member.department || "",
      specialty: profile.specialty || member.specialty || "",
      password: "",
    });
    setIsOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        await apiClient.put(`/admin/staff/${editing.id}`, form);
        showToast("تم التحديث بنجاح", "success");
      } else {
        await apiClient.post("/admin/staff", { ...form, role });
        showToast("تمت الإضافة بنجاح", "success");
      }
      setIsOpen(false);
      fetchStaff();
    } catch (err) {
      const msg = err.response?.data?.message || "حدث خطأ أثناء الحفظ";
      showToast(msg, "error");
    }
  };

  const handleToggleStatus = async (member) => {
    const nextStatus = !member.status;
    try {
      await apiClient.patch(`/admin/staff/${member.id}/status`, {
        status: nextStatus,
      });
      showToast(
        nextStatus ? "تم التفعيل" : "تم الإيقاف",
        "success",
      );
      fetchStaff();
    } catch {
      showToast("خطأ في تغيير حالة العضو", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/admin/staff/${deleting.id}`);
      showToast("تم الحذف بنجاح", "success");
      setDeleting(null);
      fetchStaff();
    } catch {
      showToast("خطأ أثناء الحذف", "error");
    }
  };

  return (
    <div>
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader
        title="إدارة الكوادر"
        description="عرض وتعديل وإيقاف الأطباء وموظفي الاستقبال والمختبر والصيدلية."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            إضافة {title.replace("الأ", "ال")}
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setRole(tab.value)}
            className={`rounded-full px-4 py-2 text-sm font-bold cursor-pointer transition-colors ${
              role === tab.value
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : staff.length === 0 ? (
        <EmptyState icon={Users} title={`لا يوجد ${title}`} description="أضف عضواً جديداً للبدء." />
      ) : (
        <AdminTable columns={COLUMNS}>
          {staff.map((member) => {
            // استخراج بيانات القسم والتخصص من جدول البروفايل المرتبط بأمان
            const profile = member.doctor_profile || member.receptionist_profile || member.lab_profile || {};
            return (
              <AdminTableRow key={member.id}>
                <AdminTableCell className="font-bold text-blue-950">{member.name}</AdminTableCell>
                <AdminTableCell dir="ltr">{member.email}</AdminTableCell>
                <AdminTableCell dir="ltr">{member.national_id || "—"}</AdminTableCell>
                <AdminTableCell>{profile.department || "—"}</AdminTableCell>
                <AdminTableCell>{profile.specialty || "—"}</AdminTableCell>
                <AdminTableCell>
                  <StatusBadge status={member.status ? "active" : "suspended"} />
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => openEdit(member)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" title="تعديل">
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(member)}
                      className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                      title={member.status ? "إيقاف" : "تفعيل"}
                    >
                      {member.status ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                    </button>
                    <button type="button" onClick={() => setDeleting(member)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" title="حذف">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            );
          })}
        </AdminTable>
      )}

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)} title={editing ? "تعديل عضو" : "إضافة عضو جديد"}>
          <form className="space-y-3" onSubmit={handleSubmit} dir="rtl">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">الاسم</label>
              <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="الاسم الكامل" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">البريد الإلكتروني</label>
              <input type="email" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="example@domain.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            {!editing && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">كلمة المرور المؤقتة</label>
                <input type="password" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">رقم الهوية</label>
              <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="رقم الهوية الوطنية" value={form.national_id} onChange={(e) => setForm({ ...form, national_id: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">رقم الجوال</label>
              <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="0599000000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">القسم</label>
              <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="القسم (مثال: الباطنية)" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">التخصص / المسمى</label>
              <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="التخصص الدقيق" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
            </div>
            <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 mt-4 cursor-pointer">
              حفظ
            </button>
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="حذف العضو"
          message={`هل تريد حقاً حذف «${deleting.name}»؟`}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

export default StaffPage;