import { CalendarDays, FileText, Video } from "lucide-react";

import { AUTH_FEATURE_CARD } from "../constants/authForm";

const features = [
  {
    icon: FileText,
    title: "متابعة ملفك الطبي",
    description: "راجع سجلك الطبي والوصفات بسهولة",
    delay: "0.5s",
    floatDelay: "0s",
  },
  {
    icon: Video,
    title: "استشارات عن بعد",
    description: "تواصل مع أطباء متخصصين من أي مكان",
    delay: "0.65s",
    floatDelay: "0.8s",
  },
  {
    icon: CalendarDays,
    title: "حجز المواعيد بسهولة",
    description: "اختر الوقت المناسب واحجز بخطوات بسيطة",
    delay: "0.8s",
    floatDelay: "1.6s",
  },
];

function AuthFeatures() {
  return (
    <div dir="rtl" className="flex w-full items-stretch gap-4">
      {features.map(({ icon: Icon, title, description, delay, floatDelay }) => (
        <div
          key={title}
          className={AUTH_FEATURE_CARD.card}
          style={{ animationDelay: delay }}
        >
          <div
            className="mb-3 animate-[featureFloat_5s_ease-in-out_infinite]"
            style={{ animationDelay: floatDelay }}
          >
            <div className={AUTH_FEATURE_CARD.iconBox}>
              <Icon size={20} strokeWidth={2.25} />
            </div>
          </div>

          <h3 className={AUTH_FEATURE_CARD.title}>{title}</h3>
          <p className={AUTH_FEATURE_CARD.description}>{description}</p>
        </div>
      ))}
    </div>
  );
}

export default AuthFeatures;
