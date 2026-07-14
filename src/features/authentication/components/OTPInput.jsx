import { useRef } from "react";

const cellClass =
  "h-14 w-11 shrink-0 rounded-xl border border-slate-200 bg-white text-center text-xl font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-12";

function OTPInput({
  length = 5,
  value = "",
  onChange,
  onComplete,
  disabled = false,
}) {
  const inputRefs = useRef([]);

  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  const focusInput = (index) => {
    const target = inputRefs.current[Math.min(Math.max(index, 0), length - 1)];
    target?.focus();
    target?.select();
  };

  const emitChange = (nextDigits) => {
    const code = nextDigits.join("").slice(0, length);
    onChange?.(code);

    if (code.length === length && nextDigits.every(Boolean)) {
      onComplete?.(code);
    }
  };

  const applyDigits = (startIndex, rawValue) => {
    const numbers = rawValue.replace(/\D/g, "");
    if (!numbers) return;

    const nextDigits = [...digits];
    for (let i = 0; i < numbers.length && startIndex + i < length; i += 1) {
      nextDigits[startIndex + i] = numbers[i];
    }

    emitChange(nextDigits);
    focusInput(startIndex + numbers.length);
  };

  const handleChange = (index, event) => {
    const inputValue = event.target.value.replace(/\D/g, "");

    if (!inputValue) {
      const nextDigits = [...digits];
      nextDigits[index] = "";
      emitChange(nextDigits);
      return;
    }

    if (inputValue.length > 1) {
      applyDigits(index, inputValue);
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = inputValue;
    emitChange(nextDigits);

    if (index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      if (digits[index]) {
        const nextDigits = [...digits];
        nextDigits[index] = "";
        emitChange(nextDigits);
        return;
      }

      if (index > 0) {
        const nextDigits = [...digits];
        nextDigits[index - 1] = "";
        emitChange(nextDigits);
        focusInput(index - 1);
      }
    }

    if (event.key === "ArrowLeft") {
      focusInput(index - 1);
    }

    if (event.key === "ArrowRight") {
      focusInput(index + 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    applyDigits(0, event.clipboardData.getData("text"));
  };

  return (
    <div
      dir="ltr"
      className="flex justify-center gap-1 sm:gap-1.5"
      onPaste={handlePaste}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`رمز التحقق ${index + 1}`}
          className={cellClass}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onFocus={(event) => event.target.select()}
        />
      ))}
    </div>
  );
}

export default OTPInput;
