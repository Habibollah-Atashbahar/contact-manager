"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"en" | "fa">("en");

  const translations = {
    en: {
      title: "Create Account",
      username: "Full Name",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      register: "Register",
      haveAccount: "Already have an account?",
      signIn: "Sign In",
      loading: "Creating account...",
      success: "Account created successfully!",
      error: "Failed to create account",
      passwordMismatch: "Passwords do not match",
    },
    fa: {
      title: "ایجاد حساب",
      username: "نام کامل",
      email: "آدرس ایمیل",
      password: "رمز عبور",
      confirmPassword: "تایید رمز عبور",
      register: "ثبت نام",
      haveAccount: "حساب کاربری دارید؟",
      signIn: "ورود",
      loading: "در حال ایجاد حساب...",
      success: "حساب با موفقیت ایجاد شد!",
      error: "خطا در ایجاد حساب",
      passwordMismatch: "رمزهای عبور مطابقت ندارند",
    },
  };

  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.register(username, email, password);
      if (response.success) {
        router.push("/login");
      }
    } catch (err: any) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyles}>
      <div className="card" style={cardStyles}>
        <div style={headerStyles}>
          <h1>{t.title}</h1>
          <button
            onClick={() => setLang(lang === "en" ? "fa" : "en")}
            style={langToggleStyles}
          >
            {lang === "en" ? "فارسی" : "English"}
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} style={formStyles}>
          <div style={formGroupStyles}>
            <label>{t.username}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div style={formGroupStyles}>
            <label>{t.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div style={formGroupStyles}>
            <label>{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div style={formGroupStyles}>
            <label>{t.confirmPassword}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", padding: "0.75rem" }}
          >
            {loading ? t.loading : t.register}
          </button>
        </form>

        <p style={footerTextStyles}>
          {t.haveAccount}{" "}
          <a href="/login" style={{ fontWeight: "600" }}>
            {t.signIn}
          </a>
        </p>
      </div>
    </div>
  );
}

const pageStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundColor: "var(--bg-primary)",
  padding: "1rem",
};

const cardStyles: React.CSSProperties = {
  width: "100%",
  maxWidth: "400px",
};

const headerStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "2rem",
};

const langToggleStyles: React.CSSProperties = {
  background: "var(--bg-primary)",
  border: "1px solid var(--border-color)",
  padding: "0.5rem 1rem",
  borderRadius: "0.375rem",
  fontSize: "0.85rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const formStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
};

const formGroupStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const footerTextStyles: React.CSSProperties = {
  textAlign: "center",
  marginTop: "1.5rem",
  color: "var(--text-secondary)",
  fontSize: "0.9rem",
};
