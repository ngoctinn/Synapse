import { Suspense } from "react";
import { LoginForm } from "@/features/auth";


export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
