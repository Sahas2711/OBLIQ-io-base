export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong";
  color: string;
  bgColor: string;
};

export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;

  if (!password) {
    return { score: 0, label: "Very Weak", color: "bg-danger", bgColor: "bg-danger-light" };
  }

  // Length scoring
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

  // Deductions
  if (/^[a-zA-Z]+$/.test(password)) score--; // only letters
  if (/^\d+$/.test(password)) score--; // only numbers
  if (/(.)\1{2,}/.test(password)) score--; // repeated characters

  // Common patterns
  const commonPatterns = [
    /password/i,
    /123456/,
    /qwerty/i,
    /abc123/i,
    /letmein/i,
    /welcome/i,
  ];
  if (commonPatterns.some((p) => p.test(password))) score--;

  const clampedScore = Math.max(0, Math.min(4, score)) as 0 | 1 | 2 | 3 | 4;

  const strengths: Record<number, Omit<PasswordStrength, "score">> = {
    0: { label: "Very Weak", color: "bg-danger", bgColor: "bg-danger-light" },
    1: { label: "Weak", color: "bg-danger", bgColor: "bg-danger-light" },
    2: { label: "Fair", color: "bg-warning", bgColor: "bg-warning-light" },
    3: { label: "Strong", color: "bg-success", bgColor: "bg-success-light" },
    4: { label: "Very Strong", color: "bg-success", bgColor: "bg-success-light" },
  };

  return { score: clampedScore, ...strengths[clampedScore] };
}
