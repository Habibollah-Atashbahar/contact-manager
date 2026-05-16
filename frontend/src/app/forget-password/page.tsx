"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiService } from "@/services/api";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("ایمیل را وارد کنید");
      return;
    }

    setLoading(true);
    try {
      await apiService.api.post("/auth/forgot-password", { email });
      setSuccess(true);
      setEmail("");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در ارسال ایمیل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
            فراموشی رمز عبور
          </h1>
          <p className="text-center text-gray-600 mb-8">
            ایمیل خود را وارد کنید تا لینک بازیابی ارسال شود
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              ایمیل با موفقیت ارسال شد! در 3 ثانیه به صفحه ورود برمی‌گردیم...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ایمیل
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="ایمیل خود را وارد کنید"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "در حال ارسال..." : "ارسال لینک بازیابی"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            حساب دارید؟{" "}
            <Link
              href="/login"
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              ورود
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
