const PASSWORD_RESET_KEY = "carelink_password_reset";

export function savePasswordResetDraft({ email, role, code }) {
  const current = readPasswordResetDraft();

  sessionStorage.setItem(
    PASSWORD_RESET_KEY,
    JSON.stringify({
      email: email ?? current?.email ?? "",
      role: role ?? current?.role ?? "patient",
      code: code ?? current?.code ?? "",
    })
  );
}

export function readPasswordResetDraft() {
  try {
    const raw = sessionStorage.getItem(PASSWORD_RESET_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearPasswordResetDraft() {
  sessionStorage.removeItem(PASSWORD_RESET_KEY);
}

export function maskEmail(email) {
  const [localPart, domain] = email.split("@");

  if (!domain || !localPart) {
    return email;
  }

  const visible = localPart.slice(0, 2);
  return `${visible}***@${domain}`;
}
