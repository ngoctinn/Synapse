import { Button } from "@/shared/ui";
import Link from "next/link";

export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 py-2">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Lỗi Xác Thực</h1>
        <p className="mb-6 text-slate-600">
          Đã xảy ra lỗi trong quá trình xác thực hoặc liên kết đã hết hạn.
          <br />
          Vui lòng thử lại quy trình.
        </p>
        <Link href="/login" className="block w-full">
          <Button className="w-full">Quay lại trang đăng nhập</Button>
        </Link>
      </div>
    </div>
  );
}
