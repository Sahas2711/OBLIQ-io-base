"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations/auth";
import { FormField } from "@/components/auth/FormField";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const result = forgotPasswordSchema.safeParse(formData);
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
        const { error } = await supabase.auth.resetPasswordForEmail(
          result.data.email,
          {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
          }
        );

        if (error) {
          setServerError(error.message);
          return;
        }

        setSuccess(true);
      } catch {
        setServerError("Something went wrong. Please try again.");
      }
    });
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-light mx-auto mb-4">
          <CheckCircle2 className="h-7 w-7 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Check your email
        </h1>
        <p className="text-neutral-600 mb-6">
          We&rsquo;ve sent a password reset link to{" "}
          <span className="font-medium text-neutral-900">{formData.email}</span>.
          Follow the link to set a new password.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 mx-auto mb-4">
          <Mail className="h-6 w-6 text-brand-600" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-1.5">
          Forgot your password?
        </h1>
        <p className="text-sm text-neutral-600">
          Enter your email and we&rsquo;ll send you a reset link
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

          <FormField
            label="Email Address"
            type="email"
            placeholder="you@yourfirm.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ email: e.target.value });
              setErrors({});
              setServerError("");
            }}
            error={errors.email}
            autoComplete="email"
            disabled={isPending}
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md active:bg-brand-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to login
        </Link>
      </p>
    </div>
  );
}
