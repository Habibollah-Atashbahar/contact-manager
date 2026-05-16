import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">۴۰۴</h1>
        <p className="text-gray-600 mb-6">صفحه مورد نظر یافت نشد</p>
        <Link href="/dashboard" className="btn-primary">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
