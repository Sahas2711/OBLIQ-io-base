"use client";

import { calculatePasswordStrength } from "@/lib/auth/password-strength";

interface PasswordStrengthBarProps {
  password: string;
}

export function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const strength = calculatePasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1.5 mb-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= strength.score - 1 ? strength.color : "bg-neutral-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-neutral-500">
        Password strength:{" "}
        <span className="font-medium text-neutral-700">{strength.label}</span>
      </p>
    </div>
  );
}
