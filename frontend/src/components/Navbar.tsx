"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "fa">("en");

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    const savedLang = (localStorage.getItem("lang") as "en" | "fa") || "en";
    setLang(savedLang);
    document.documentElement.dir = savedLang === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = savedLang;
  }, []);

  const toggleDarkMode = () => {
    const isDarkNow = !isDark;
    setIsDark(isDarkNow);

    if (isDarkNow) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "fa" : "en";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.dir = newLang === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const translations = {
    en: {
      logo: "Contact Manager",
      dashboard: "Dashboard",
      contacts: "Contacts",
      logout: "Logout",
      login: "Login",
      register: "Register",
    },
    fa: {
      logo: "مدیر مخاطبین",
      dashboard: "داشبورد",
      contacts: "مخاطبین",
      logout: "خروج",
      login: "ورود",
      register: "ثبت نام",
    },
  };

  const t = translations[lang];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.icon}>📇</span>
          {t.logo}
        </Link>

        <button className={styles.mobileBtn} onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        <div className={`${styles.navLinks} ${isOpen ? styles.open : ""}`}>
          {user ? (
            <>
              <Link href="/dashboard" className={styles.navLink}>
                {t.dashboard}
              </Link>
              <Link href="/contacts" className={styles.navLink}>
                {t.contacts}
              </Link>
              <span className={styles.userName}>{user.username}</span>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ padding: "0.5rem 1rem" }}
              >
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="btn btn-primary"
                style={{ padding: "0.5rem 1rem" }}
              >
                {t.login}
              </Link>
              <Link
                href="/register"
                className="btn btn-secondary"
                style={{ padding: "0.5rem 1rem" }}
              >
                {t.register}
              </Link>
            </>
          )}

          <button
            onClick={toggleDarkMode}
            className={styles.themeBtn}
            title={isDark ? "Light Mode" : "Dark Mode"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <button
            onClick={toggleLanguage}
            className={styles.langBtn}
            title={lang === "en" ? "فارسی" : "English"}
          >
            {lang === "en" ? "FA" : "EN"}
          </button>
        </div>
      </div>
    </nav>
  );
}
