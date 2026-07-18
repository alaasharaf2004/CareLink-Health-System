import { ShieldCheck } from "lucide-react";
import authHeroImage from "../../../assets/images/auth_hero3.png";
import CareLinkLogo from "../../../components/CareLinkLogo";
import { AUTH_FORM_ALIGN, AUTH_HERO_ALIGN, AUTH_HERO_TEXT } from "../constants/authForm";
import AuthFeatures from "./AuthFeatures";
import AuthHeroAlignSpacer from "./AuthHeroAlignSpacer";

function AuthLayout({
  children,
  heroAlign = AUTH_HERO_ALIGN.register,
  heroNudgeClass = "",
  formAlign = AUTH_FORM_ALIGN.start,
  wideForm = false,
}) {
  const formColumnWidth = wideForm ? "lg:w-[820px]" : "lg:w-[540px]";

  return (
    <main className="relative min-h-screen overflow-hidden">
      <img
        src={authHeroImage}
        alt="CareLink"
        className="absolute inset-0 h-full w-full object-cover object-[28%_center] saturate-[0.82] brightness-[1.05] contrast-[0.96] animate-[slowZoom_20s_ease-in-out_infinite_alternate]"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/35 via-blue-800/15 to-white/95" />

      <div className="absolute top-20 right-20 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl animate-[float_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-20 right-40 h-48 w-48 rounded-full bg-emerald-400/10 blur-2xl animate-[float_8s_ease-in-out_infinite_reverse]" />

      <div className="absolute top-8 left-8 z-20 opacity-0 animate-[fadeInDown_0.6s_ease_0.1s_forwards]">
        <CareLinkLogo size={52} showText layout="header" className="cursor-pointer" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-10 lg:px-10">
        <div className="flex w-full flex-1 items-stretch justify-between gap-8">
          <div
            dir="rtl"
            className={`hidden flex-1 flex-col opacity-0 animate-[fadeInLeft_0.85s_ease_0.15s_forwards] lg:flex xl:pl-4 ${
              wideForm ? "lg:max-w-[480px]" : "lg:max-w-[620px]"
            }`}
          >
            <div className="flex h-full flex-col">
              <AuthHeroAlignSpacer variant={heroAlign} />

              <div
                className={`mb-5 px-2 text-center ${
                  heroAlign !== AUTH_HERO_ALIGN.simple ? "min-h-11" : ""
                } ${heroNudgeClass}`}
              >
                <div className="translate-x-10 xl:translate-x-16">
                  <h1 className={AUTH_HERO_TEXT.title}>
                    رعاية صحية
                    <br />
                    أسهل وأسرع
                  </h1>

                  <p className={AUTH_HERO_TEXT.subtitle}>
                    احجز موعدك، استشر طبيبك، وتابع سجلك الطبي من مكان واحد
                  </p>
                </div>
              </div>

              <div className="mt-auto w-full shrink-0">
                <div className="mb-6 h-[2px] w-full origin-right rounded-full bg-gradient-to-l from-blue-300/80 via-blue-400 to-blue-500/40 shadow-[0_0_12px_rgba(96,165,250,0.35)] opacity-0 animate-[lineExpand_0.9s_ease_0.35s_forwards]" />

                <AuthFeatures />
              </div>
            </div>
          </div>

          <div
            className={`flex w-full flex-col opacity-0 animate-[fadeInRight_0.85s_ease_0.25s_forwards] lg:shrink-0 ${formColumnWidth} ${formAlign}`}
          >
            <div className="w-full animate-[authCardReveal_0.9s_cubic-bezier(0.22,1,0.36,1)_forwards]">
              {children}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center lg:justify-end">
          <p
            dir="rtl"
            className={`flex w-full items-center justify-center gap-2.5 text-sm font-semibold text-slate-600 lg:shrink-0 ${formColumnWidth}`}
          >
            <ShieldCheck size={17} className="shrink-0 text-[#40C0A0]" />
            بياناتك محمية وفق أعلى معايير الأمان والخصوصية
          </p>
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;
