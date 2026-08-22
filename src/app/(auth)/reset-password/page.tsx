"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validations/auth";
import { FormField } from "@/components/auth/FormField";
import { PasswordStrengthBar } from "@/components/auth/PasswordStrengthBar";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsValidSession(!!session);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const result = resetPasswordSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
          password: result.data.password,
        });

        if (error) {
          setServerError(error.message);
          return;
        }

        setSuccess(true);
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/app/dashboard");
        }, 3000);
      } catch {
        setServerError("Something went wrong. Please try again.");
      }
    });
  };

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 text-brand-600 animate-spin mx-auto" />
        <p className="mt-3 text-sm text-neutral-600">Verifying reset link...</p>
      </div>
    );
  }

  // Invalid session (no reset token)
  if (!isValidSession) {
    return (
      <div className="text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-warning-light mx-auto mb-4">
          <AlertTriangle className="h-7 w-7 text-warning" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Invalid or expired link
        </h1>
        <p className="text-neutral-600 mb-6">
          This password reset link is invalid or has expired. Please request a
          new one.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700"
        >
          Request new reset link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-light mx-auto mb-4">
          <CheckCircle2 className="h-7 w-7 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Password updated
        </h1>
        <p className="text-neutral-600 mb-6">
          Your password has been successfully updated. Redirecting to your
          dashboard...
        </p>
        <Link
          href="/app/dashboard"
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 mx-auto mb-4">
          <KeyRound className="h-6 w-6 text-brand-600" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-1.5">
          Set new password
        </h1>
        <p className="text-sm text-neutral-600">
          Choose a strong password for your account
        </p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-[var(--shadow-card)] p-6 sm:p-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {serverError && (
            <div
              className="rounded-lg bg-danger-light border border-danger/20 px-4 py-3 text-sm text-danger"
              role="alert"
            >
              {serverError}
            </div>
          )}

          <div className="relative">
            <FormField
              label="New Password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, password: e.target.value }));
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.password;
                  return next;
                });
              }}
              error={errors.password}
              autoComplete="new-password"
              disabled={isPending}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-neutral-400 hover:text-neutral-600 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <PasswordStrengthBar password={formData.password} />
          </div>

          <div className="relative">
            <FormField
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your new password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }));
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.confirmPassword;
                  return next;
                });
              }}
              error={errors.confirmPassword}
              autoComplete="new-password"
              disabled={isPending}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] text-neutral-400 hover:text-neutral-600 transition-colors"
              tabIndex={-1}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md active:bg-brand-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating password...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
