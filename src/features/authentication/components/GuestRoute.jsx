/**
 * صفحات الضيف (دخول/تسجيل) تبقى متاحة دائماً
 * حتى لو فيه جلسة قديمة — عشان المستخدم يقدر يبدّل الحساب.
 */
function GuestRoute({ children }) {
  return children;
}

export default GuestRoute;
