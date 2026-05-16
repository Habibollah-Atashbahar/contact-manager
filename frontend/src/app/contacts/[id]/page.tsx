"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/services/api";
import { Contact } from "@/types";

export default function EditContact() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const contactId = params.id as string;
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchContact();
    }
  }, [user?.id, contactId]);

  const fetchContact = async () => {
    if (!user?.id) return;
    try {
      const response = await apiService.getContact(user.id, contactId);
      const contact = response.data;
      setFormData({
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email || "",
        phone: contact.phone || "",
        description: contact.description || "",
      });
    } catch (err: any) {
      setError("خطا در دریافت مخاطب");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await apiService.updateContact(user.id, contactId, formData);
      router.push("/contacts");
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در ویرایش مخاطب");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container py-4">
          <Link href="/contacts" className="text-blue-500 hover:text-blue-700">
            ← بازگشت
          </Link>
        </div>
      </nav>

      <div className="container py-8 max-w-2xl">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            ویرایش مخاطب
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام خانوادگی
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ایمیل
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تلفن
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-field"
                rows={4}
              ></textarea>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button type="submit" className="btn-primary">
                ذخیره تغییرات
              </button>
              <Link href="/contacts" className="btn-secondary">
                انصراف
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
