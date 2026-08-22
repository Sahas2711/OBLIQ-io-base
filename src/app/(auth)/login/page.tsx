"use client";

import { useState, useTransition, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { FormField } from "@/components/auth/FormField";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const redirected = searchParams.get("redirected");

  const updateField = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const result = loginSchema.safeParse(formData);
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
        const { error } = await supabase.auth.signInWithPassword({
          email: result.data.email,
          password: result.data.password,
        });

        if (error) {
          if (
            error.message.includes("Invalid login credentials") ||
            error.message.includes("Invalid")
          ) {
            setServerError(
              "Invalid email or password. Please check your credentials and try again."
            );
          } else if (error.message.includes("Email not confirmed")) {
            setServerError(
              "Please verify your email address before logging in. Check your inbox for the confirmation link."
            );
          } else {
            setServerError(error.message);
          }
          return;
        }

        router.push("/app/dashboard");
        router.refresh();
      } catch {
        setServerError("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1.5">
          Welcome back
        </h1>
        <p className="text-sm text-neutral-600">
          Log in to your OBLIQ account
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

          {redirected && (
            <div
              className="rounded-lg bg-warning-light border border-warning/20 px-4 py-3 text-sm text-warning"
              role="alert"
            >
              Please log in to access that page.
            </div>
          )}

          <FormField
            label="Email Address"
            type="email"
            placeholder="you@yourfirm.com"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            error={errors.email}
            autoComplete="email"
            disabled={isPending}
          />

          <div className="relative">
            <FormField
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              error={errors.password}
              autoComplete="current-password"
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
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.remember}
                onChange={(e) => updateField("remember", e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                disabled={isPending}
              />
              <span className="text-sm text-neutral-600">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md active:bg-brand-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Don&rsquo;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 text-brand-600 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
