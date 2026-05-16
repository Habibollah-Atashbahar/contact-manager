"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [lang, setLang] = useState<"en" | "fa">("en");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
    const savedLang = (localStorage.getItem("lang") as "en" | "fa") || "en";
    setLang(savedLang);
  }, [user, isLoading, router]);

  const translations = {
    en: {
      welcome: "Welcome back",
      startManaging: "Start managing your contacts",
      viewContacts: "View Contacts",
      createContact: "Create Contact",
      stats: "Quick Stats",
      loading: "Loading...",
    },
    fa: {
      welcome: "خوش آمدید",
      startManaging: "شروع مدیریت مخاطبین خود",
      viewContacts: "مشاهده مخاطبین",
      createContact: "ایجاد مخاطب جدید",
      stats: "آمار سریع",
      loading: "در حال بارگذاری...",
    },
  };

  const t = translations[lang];

  if (isLoading) {
    return (
      <div style={loadingStyles}>
        <div className="spinner"></div>
        <p>{t.loading}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={pageStyles}>
      <div className="container">
        <div style={headerStyles}>
          <div>
            <h1>
              {t.welcome}, {user.username}! 👋
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>{t.startManaging}</p>
          </div>
        </div>

        <div style={gridStyles}>
          <div className="card" style={cardStyle}>
            <h3>📇 {t.viewContacts}</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
              View and manage all your contacts
            </p>
            <a href="/contacts" className="btn btn-primary">
              {t.viewContacts}
            </a>
          </div>

          <div className="card" style={cardStyle}>
            <h3>➕ {t.createContact}</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
              Add a new contact to your list
            </p>
            <a href="/contacts" className="btn btn-success">
              {t.createContact}
            </a>
          </div>
        </div>

        <div className="card" style={{ marginTop: "2rem" }}>
          <h2>{t.stats}</h2>
          <div style={statsGridStyles}>
            <div style={statItemStyles}>
              <div style={statNumberStyles}>0</div>
              <div style={statLabelStyles}>Total Contacts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const pageStyles: React.CSSProperties = {
  padding: "2rem 0",
  minHeight: "calc(100vh - 60px)",
  backgroundColor: "var(--bg-primary)",
};

const headerStyles: React.CSSProperties = {
  marginBottom: "3rem",
};

const gridStyles: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "1.5rem",
  marginBottom: "2rem",
};

const cardStyle: React.CSSProperties = {
  cursor: "pointer",
};

const statsGridStyles: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1.5rem",
  marginTop: "1.5rem",
};

const statItemStyles: React.CSSProperties = {
  padding: "1.5rem",
  backgroundColor: "var(--bg-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: "0.5rem",
  textAlign: "center",
};

const statNumberStyles: React.CSSProperties = {
  fontSize: "2.5rem",
  fontWeight: "700",
  color: "var(--primary-color)",
  marginBottom: "0.5rem",
};

const statLabelStyles: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: "0.9rem",
};

const loadingStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  gap: "1rem",
};
