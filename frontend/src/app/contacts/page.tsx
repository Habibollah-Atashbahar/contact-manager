"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/services/api";
import { Contact, CreateContactRequest } from "@/types";

export default function ContactsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "fa">("en");
  const [formData, setFormData] = useState<CreateContactRequest>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    description: "",
  });

  const translations = {
    en: {
      title: "Contacts",
      addContact: "Add Contact",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      description: "Description",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      noContacts: "No contacts yet",
      loading: "Loading...",
    },
    fa: {
      title: "مخاطبین",
      addContact: "اضافه کردن مخاطب",
      firstName: "نام",
      lastName: "نام خانوادگی",
      email: "ایمیل",
      phone: "تلفن",
      description: "توضیحات",
      save: "ذخیره",
      cancel: "انصراف",
      delete: "حذف",
      edit: "ویرایش",
      noContacts: "هیچ مخاطبی وجود ندارد",
      loading: "در حال بارگذاری...",
    },
  };

  const t = translations[lang];

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }
    const savedLang = (localStorage.getItem("lang") as "en" | "fa") || "en";
    setLang(savedLang);

    if (user?.id) {
      loadContacts();
    }
  }, [user, isLoading, router]);

  const loadContacts = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await apiService.getContacts(user.id);
      setContacts(response.data.data || []);
    } catch (error) {
      console.error("Failed to load contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    try {
      if (editingId) {
        await apiService.updateContact(user.id, editingId, formData);
      } else {
        await apiService.createContact(user.id, formData);
      }

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        description: "",
      });
      setShowForm(false);
      setEditingId(null);
      await loadContacts();
    } catch (error) {
      console.error("Failed to save contact:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!user?.id || !confirm("Are you sure?")) return;

    setLoading(true);
    try {
      await apiService.deleteContact(user.id, contactId);
      await loadContacts();
    } catch (error) {
      console.error("Failed to delete contact:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contact: Contact) => {
    setFormData({
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email || "",
      phone: contact.phone || "",
      description: contact.description || "",
    });
    setEditingId(contact.id);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div style={loadingStyles}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={pageStyles}>
      <div className="container">
        <div style={headerStyles}>
          <h1>{t.title}</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setEditingId(null);
                setFormData({
                  first_name: "",
                  last_name: "",
                  email: "",
                  phone: "",
                  description: "",
                });
              }
            }}
            className="btn btn-primary"
          >
            {t.addContact}
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: "2rem" }}>
            <form onSubmit={handleSubmit} style={formStyles}>
              <div style={formRowStyles}>
                <div>
                  <label>{t.firstName}</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label>{t.lastName}</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div style={formRowStyles}>
                <div>
                  <label>{t.email}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>{t.phone}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label>{t.description}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  style={{ minHeight: "100px" }}
                />
              </div>

              <div style={buttonGroupStyles}>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {t.save}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      first_name: "",
                      last_name: "",
                      email: "",
                      phone: "",
                      description: "",
                    });
                  }}
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        )}

        {contacts.length === 0 ? (
          <div style={emptyStateStyles}>
            <p>{t.noContacts}</p>
          </div>
        ) : (
          <div style={gridStyles}>
            {contacts.map((contact) => (
              <div key={contact.id} className="card" style={contactCardStyles}>
                <h3>
                  {contact.first_name} {contact.last_name}
                </h3>
                {contact.email && <p>📧 {contact.email}</p>}
                {contact.phone && <p>📱 {contact.phone}</p>}
                {contact.description && (
                  <p style={{ color: "var(--text-secondary)" }}>
                    {contact.description}
                  </p>
                )}
                <div style={actionButtonsStyles}>
                  <button
                    onClick={() => handleEdit(contact)}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    {t.edit}
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="btn btn-danger"
                    style={{ flex: 1 }}
                  >
                    {t.delete}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "2rem",
  gap: "1rem",
  flexWrap: "wrap",
};

const formStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
};

const formRowStyles: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "1rem",
};

const buttonGroupStyles: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
};

const gridStyles: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "1.5rem",
};

const contactCardStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const actionButtonsStyles: React.CSSProperties = {
  display: "flex",
  gap: "0.75rem",
  marginTop: "auto",
};

const emptyStateStyles: React.CSSProperties = {
  textAlign: "center",
  padding: "3rem",
  color: "var(--text-secondary)",
};

const loadingStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
};
