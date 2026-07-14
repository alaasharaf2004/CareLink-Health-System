import { Stethoscope, User } from "lucide-react";

const roles = [
  {
    value: "doctor",
    label: "طبيب",
    icon: Stethoscope,
  },
  {
    value: "patient",
    label: "مريض",
    icon: User,
  },
];

function RoleSelector({ selectedRole, onChange }) {
  return (
    <div className="grid grid-cols-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 shadow-inner">
      {roles.map((role) => {
        const Icon = role.icon;
        const isActive = selectedRole === role.value;

        return (
          <button
            key={role.value}
            type="button"
            onClick={() => onChange(role.value)}
            className={[
              "flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-200",
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-blue-600",
            ].join(" ")}
          >
            <Icon size={18} />
            {role.label}
          </button>
        );
      })}
    </div>
  );
}

export default RoleSelector;