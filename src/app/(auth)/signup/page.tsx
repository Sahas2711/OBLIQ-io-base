"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  signupSchema,
  type SignupFormData,
} from "@/lib/validations/auth";
import { FormField } from "@/components/auth/FormField";
import { PasswordStrengthBar } from "@/components/auth/PasswordStrengthBar";
import { GoogleOAuthButton } from "@/components/auth/GoogleOAuthButton";

export default function SignupPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    firmName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const updateField = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setServerError("");
  };

  const validateField = (field: keyof SignupFormData, value: string | boolean) => {
    const fieldSchema = signupSchema.shape[field];
    const result = fieldSchema.safeParse(value);
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        [field]: result.error.issues[0].message,
      }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    // Validate all fields
    const result = signupSchema.safeParse(formData);
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
        const { error } = await supabase.auth.signUp({
          email: result.data.email,
          password: result.data.password,
          options: {
            data: {
              full_name: result.data.fullName,
              firm_name: result.data.firmName,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
          },
        });

        if (error) {
          if (error.message.includes("already")) {
            setServerError("An account with this email already exists. Please log in instead.");
          } else {
            setServerError(error.message);
          }
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
          We&rsquo;ve sent a confirmation link to{" "}
          <span className="font-medium text-neutral-900">{formData.email}</span>.
          Please verify your email to continue.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1.5">
          Create your account
        </h1>
        <p className="text-sm text-neutral-600">
          Get started with OBLIQ for your CA firm
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
            label="Full Name"
            type="text"
            placeholder="e.g. Rajesh Kumar"
            value={formData.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            onBlur={() => validateField("fullName", formData.fullName)}
            error={errors.fullName}
            autoComplete="name"
            disabled={isPending}
          />

          <FormField
            label="Firm Name"
            type="text"
            placeholder="e.g. Kumar & Associates, Chartered Accountants"
            value={formData.firmName}
            onChange={(e) => updateField("firmName", e.target.value)}
            onBlur={() => validateField("firmName", formData.firmName)}
            error={errors.firmName}
            autoComplete="organization"
            disabled={isPending}
          />

          <FormField
            label="Email Address"
            type="email"
            placeholder="you@yourfirm.com"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            onBlur={() => validateField("email", formData.email)}
            error={errors.email}
            autoComplete="email"
            disabled={isPending}
          />

          <div>
            <FormField
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              onBlur={() => validateField("password", formData.password)}
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
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            <PasswordStrengthBar password={formData.password} />
          </div>

          <div className="relative">
            <FormField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              onBlur={() =>
                validateField("confirmPassword", formData.confirmPassword)
              }
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
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-neutral-500">or</span>
          </div>
        </div>

        <GoogleOAuthButton label="Continue with Google" />
      </div>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
