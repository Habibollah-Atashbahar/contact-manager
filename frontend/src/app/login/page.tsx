"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"en" | "fa">("en");

  const translations = {
    en: {
      title: "Sign In",
      email: "Email Address",
      password: "Password",
      signIn: "Sign In",
      noAccount: "Don't have an account?",
      register: "Register",
      loading: "Signing in...",
      success: "Login successful!",
      error: "Invalid email or password",
    },
    fa: {
      title: "ورود",
      email: "آدرس ایمیل",
      password: "رمز عبور",
      signIn: "ورود",
      noAccount: "حساب کاربری ندارید؟",
      register: "ثبت نام",
      loading: "در حال ورود...",
      success: "ورود موفق!",
      error: "ایمیل یا رمز عبور اشتباه است",
    },
  };

  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiService.login(email, password);
      if (response.success) {
        login(response.data.user, response.data.access_token);
        router.push("/dashboard");
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

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", padding: "0.75rem" }}
          >
            {loading ? t.loading : t.signIn}
          </button>
        </form>

        <p style={footerTextStyles}>
          {t.noAccount}{" "}
          <a href="/register" style={{ fontWeight: "600" }}>
            {t.register}
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
