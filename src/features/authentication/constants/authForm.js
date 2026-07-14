export const AUTH_FORM_CARD_CLASS =
  "mx-auto w-full max-w-[540px] px-8 py-8";

/** محاذاة عنوان الهيرو مع صف مريض/طبيب في الفورم */
export const AUTH_HERO_ALIGN = {
  login: "login",
  register: "register",
  registerDoctor: "registerDoctor",
  simple: "simple",
};

/** رفع/خفض عنوان الهيرو (صفحات محددة فقط) */
export const AUTH_HERO_NUDGE = {
  admin: "lg:-mt-20 xl:-mt-24",
};

/** نص الهيرو — أبيض أوضح وأثقل على كل الصفحات */
export const AUTH_HERO_TEXT = {
  title:
    "mb-5 text-6xl font-black leading-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)]",
  subtitle:
    "mx-auto max-w-md text-lg font-bold leading-9 text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]",
};

/** بطاقات المميزات — نفس ستايل login/register */
export const AUTH_FEATURE_CARD = {
  card:
    "group flex flex-1 cursor-pointer flex-col items-center rounded-2xl border border-white/40 bg-white/22 px-4 py-5 text-center shadow-[0_8px_28px_rgba(15,23,42,0.16)] backdrop-blur-xl opacity-0 animate-[featureSlideIn_0.85s_cubic-bezier(0.22,1,0.36,1)_forwards] transition-all duration-500 hover:-translate-y-1.5 hover:border-white/55 hover:bg-white/30 hover:shadow-[0_12px_40px_rgba(37,99,235,0.22)]",
  iconBox:
    "flex h-11 w-11 items-center justify-center rounded-xl bg-white/35 text-white shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-md",
  title:
    "mb-1.5 text-sm font-black leading-5 text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]",
  description:
    "text-xs font-bold leading-5 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)]",
};

/** محاذاة عمود الفورم عمودياً */
export const AUTH_FORM_ALIGN = {
  start: "justify-start",
  center: "justify-center",
};

/** hover و cursor للعناصر القابلة للضغط */
export const AUTH_CLICKABLE = {
  roleTabBase:
    "flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all duration-200",
  roleTabActive:
    "bg-blue-600 text-white shadow-sm",
  roleTabInactive:
    "text-slate-500 hover:text-blue-600",
  genderBase:
    "flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-bold transition-colors duration-200",
  genderMaleActive:
    "border-blue-500 bg-blue-50 text-blue-700",
  genderMaleInactive:
    "border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-600",
  genderFemaleActive:
    "border-pink-400 bg-pink-50 text-pink-600",
  genderFemaleInactive:
    "border-slate-200 bg-white text-slate-500 hover:border-pink-200 hover:text-pink-500",
  iconButton:
    "absolute left-3.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600 active:scale-95",
  textLink:
    "cursor-pointer transition-colors duration-200 hover:text-blue-700",
  underlineLink:
    "relative inline-block cursor-pointer font-bold text-blue-600 after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:text-blue-700 hover:after:w-full",
  uploadLabel:
    "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 transition-colors duration-200 hover:border-blue-400 hover:bg-blue-50/40",
};
