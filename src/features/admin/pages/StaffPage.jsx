import { useEffect, useMemo, useState } from "react";
import { Ban, CheckCircle2, Pencil, Plus, Trash2, Users } from "lucide-react";

import AdminPageHeader from "../components/AdminPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../components/AdminTable";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { careSystemStore } from "../../care-system/data/careSystemStore";

const ROLE_TABS = [
  { value: "doctor", label: "الأطباء" },
  { value: "reception", label: "الاستقبال" },
  { value: "laboratory", label: "المختبر" },
  { value: "pharmacy", label: "الصيدلية" },
];

const COLUMNS = [
  { key: "name", label: "الاسم" },
  { key: "email", label: "البريد" },
  { key: "department", label: "القسم" },
  { key: "specialty", label: "التخصص" },
  { key: "status", label: "الحالة" },
  { key: "actions", label: "الإجراءات", className: "w-40" },
];

function StaffPage() {
  const [role, setRole] = useState("doctor");
  const [staff, setStaff] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    specialty: "",
  });
  const { toast, showToast, hideToast } = useToast();

  const reload = () => setStaff(careSystemStore.listStaff(role));

  useEffect(() => {
    reload();
    const onUpdate = () => reload();
    window.addEventListener("carelink-store-updated", onUpdate);
    return () => window.removeEventListener("carelink-store-updated", onUpdate);
  }, [role]);

  const title = useMemo(
    () => ROLE_TABS.find((item) => item.value === role)?.label || "الكوادر",
    [role]
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", email: "", department: "", specialty: "" });
    setIsOpen(true);
  };

  const openEdit = (member) => {
    setEditing(member);
    setForm({
      name: member.name,
      email: member.email,
      department: member.department,
      specialty: member.specialty,
    });
    setIsOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    careSystemStore.saveStaff({
      ...form,
      id: editing?.id,
      role,
      status: editing?.status || "active",
    });
    showToast(editing ? "تم التحديث" : "تمت الإضافة", "success");
    setIsOpen(false);
    reload();
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
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              role === tab.value
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {staff.length === 0 ? (
        <EmptyState icon={Users} title={`لا يوجد ${title}`} description="أضف عضواً جديداً للبدء." />
      ) : (
        <AdminTable columns={COLUMNS}>
          {staff.map((member) => (
            <AdminTableRow key={member.id}>
              <AdminTableCell className="font-bold text-blue-950">{member.name}</AdminTableCell>
              <AdminTableCell dir="ltr">{member.email}</AdminTableCell>
              <AdminTableCell>{member.department}</AdminTableCell>
              <AdminTableCell>{member.specialty}</AdminTableCell>
              <AdminTableCell>
                <StatusBadge status={member.status === "active" ? "active" : "suspended"} />
              </AdminTableCell>
              <AdminTableCell>
                <div className="flex gap-1">
                  <button type="button" onClick={() => openEdit(member)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = member.status === "active" ? "suspended" : "active";
                      careSystemStore.setStaffStatus(member.id, next);
                      showToast(next === "active" ? "تم التفعيل" : "تم الإيقاف", "success");
                      reload();
                    }}
                    className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                  >
                    {member.status === "active" ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                  </button>
                  <button type="button" onClick={() => setDeleting(member)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)} title={editing ? "تعديل عضو" : "إضافة عضو"}>
          <form className="space-y-3" onSubmit={handleSubmit} dir="rtl">
            <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="الاسم" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input type="email" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="البريد" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="القسم" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
            <input className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" placeholder="التخصص / المسمى" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} required />
            <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700">حفظ</button>
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="حذف العضو"
          message={`هل تريد حذف «${deleting.name}»؟`}
          onConfirm={() => {
            careSystemStore.deleteStaff(deleting.id);
            setDeleting(null);
            showToast("تم الحذف", "error");
            reload();
          }}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

export default StaffPage;
