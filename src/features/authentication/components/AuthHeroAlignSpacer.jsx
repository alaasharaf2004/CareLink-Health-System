/** مسافات شفافة لمطابقة ارتفاع الفورم قبل صف مريض/طبيب */
function AuthHeroAlignSpacer({ variant }) {
  return (
    <div
      className="pointer-events-none hidden select-none lg:block"
      aria-hidden="true"
    >
      {/* مطابقة AuthCard py-8 + AUTH_FORM_CARD py-8 */}
      <div className="pt-16" />

      <div className="mb-6 flex h-[42px] justify-center" />

      <div className="mb-6 text-center" dir="rtl">
        {variant === "login" && (
          <>
            <div className="text-2xl font-extrabold leading-8 text-transparent">
              مرحباً بعودتك
            </div>
            <p className="mt-2 text-sm leading-5 text-transparent">
              سجل الدخول للوصول إلى حسابك ومتابعة خدماتك الصحية.
            </p>
          </>
        )}

        {variant === "register" && (
          <>
            <div className="text-2xl font-extrabold leading-8 text-transparent">
              إنشاء حساب جديد
            </div>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-transparent">
              انضم إلينا وابدأ متابعة رعايتك الصحية من منصة واحدة
            </p>
          </>
        )}

        {variant === "registerDoctor" && (
          <>
            <div className="text-2xl font-extrabold leading-8 text-transparent">
              إنشاء حساب جديد
            </div>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-transparent">
              أنشئ حسابك كطبيب وأرسل بياناتك وشهادتك للمراجعة من الإدارة
            </p>
          </>
        )}

        {variant === "simple" && (
          <>
            <div className="text-2xl font-extrabold leading-8 text-transparent">
              عنوان الصفحة
            </div>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-transparent">
              سطر توضيحي أول
              <br />
              سطر توضيحي ثاني
            </p>
          </>
        )}
      </div>

      {variant === "registerDoctor" && (
        <div
          dir="rtl"
          className="mb-5 rounded-xl border border-transparent px-4 py-3 text-sm leading-6 text-transparent"
        >
          بعد التسجيل، قد يتطلب تسجيل الدخول موافقة الإدارة على طلبك.
        </div>
      )}
    </div>
  );
}

export default AuthHeroAlignSpacer;
