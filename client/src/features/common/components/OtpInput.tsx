import { useRef } from "react";

export default function OtpInput({
  value,
  onChange,
  length = 6,
}: {
  value: string;
  onChange: (val: string) => void;
  length?: number;
}) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const newValue = value.substring(0, idx) + val + value.substring(idx + 1);
    onChange(newValue);
    if (val && idx < length - 1) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;

    const newValArr = Array.from(
      { length },
      (_, i) => pasted[i] ?? value[i] ?? ""
    );
    const newValue = newValArr.join("");
    onChange(newValue);

    const lastFilled = Math.min(pasted.length - 1, length - 1);
    inputsRef.current[lastFilled]?.focus();
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputsRef.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="input input-bordered w-12 text-center"
          value={value[idx] ?? ""}
          onChange={(e) => handleInput(e.target.value, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}
