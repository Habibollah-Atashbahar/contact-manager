# 📋 Contact Management API

یک سیستم کامل مدیریت مخاطبین با **Rust** و **Axum**

## 🎯 ویژگی‌ها

- ✅ احراز هویت با JWT
- ✅ CRUD کامل برای مخاطبین
- ✅ جستجو در مخاطبین
- ✅ مدیریت کاربران
- ✅ In-Memory Database
- ✅ CORS فعال
- ✅ Error Handling بهتر

## 🚀 شروع سریع

### نیازمندی‌ها
- Rust 1.70+
- Cargo

### نصب و اجرا

```bash
# Clone کنید
git clone <repo>
cd contact-management/backend

# .env را تنظیم کنید
cp .env.example .env

# اجرا کنید
cargo run
```

سرور در `http://127.0.0.1:3000` شروع می‌شود

## 📚 API Documentation

### Authentication (احراز هویت)

#### ثبت‌نام
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "علی",
  "email": "ali@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "علی",
    "email": "ali@example.com",
    "created_at": "2024-05-16T..."
  }
}
```

#### ورود
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "ali@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": {...},
    "access_token": "eyJhbGc..."
  }
}
```

#### خروج
```bash
POST /api/auth/logout
```

#### تایید Token
```bash
GET /api/auth/verify-token
Authorization: Bearer <token>
```

#### تازه‌سازی Token
```bash
POST /api/auth/refresh-token
Authorization: Bearer <token>
```

#### فراموشی رمز
```bash
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "ali@example.com"
}
```

---

### Contacts (مخاطبین)

#### لیست مخاطبین
```bash
GET /api/contacts/:user_id
```

#### ایجاد مخاطب
```bash
POST /api/contacts/:user_id
Content-Type: application/json

{
  "first_name": "محمد",
  "last_name": "احمدی",
  "email": "mohammad@example.com",
  "phone": "09123456789",
  "description": "دوست"
}
```

#### دریافت یک مخاطب
```bash
GET /api/contacts/:user_id/:contact_id
```

#### ویرایش مخاطب
```bash
PUT /api/contacts/:user_id/:contact_id
Content-Type: application/json

{
  "first_name": "محمد",
  "last_name": "احمدی",
  "email": "mohammad.new@example.com",
  "phone": "09129876543",
  "description": "دوست قدیم"
}
```

#### حذف مخاطب
```bash
DELETE /api/contacts/:user_id/:contact_id
```

#### جستجو در مخاطبین
```bash
GET /api/contacts/:user_id/search?q=محمد
```

---

### Users (کاربران)

#### لیست کاربران
```bash
GET /api/users
```

#### دریافت کاربر
```bash
GET /api/users/:user_id
```

#### ویرایش کاربر
```bash
PUT /api/users/:user_id
Content-Type: application/json

{
  "id": "user_id",
  "username": "علی_جدید",
  "email": "ali.new@example.com",
  "password_hash": "..."
}
```

#### حذف کاربر
```bash
DELETE /api/users/:user_id
```

---

## 🏗️ ساختار پروژه