"use server";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";
import { forgotPasswordSchema, loginSchema, registerSchema, updatePasswordSchema } from "./schemas";

export async function loginAction(prevState: unknown, formData: FormData): Promise<ActionResponse> {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) return error("Dữ liệu không hợp lệ", validatedFields.error.flatten().fieldErrors);

  const supabase = await createClient();
  const { error: authError } = await supabase.auth.signInWithPassword(validatedFields.data);

  if (authError) return error(authError.message);

  revalidatePath("/", "layout");
  return success(undefined, "Đăng nhập thành công!");
}

export async function registerAction(prevState: unknown, formData: FormData): Promise<ActionResponse> {
  const validatedFields = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
  });

  if (!validatedFields.success) return error("Dữ liệu không hợp lệ", validatedFields.error.flatten().fieldErrors);

  const { email, password, fullName } = validatedFields.data;
  const supabase = await createClient();
  const { error: authError } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: fullName, avatar_url: "" } },
  });

  if (authError) return error(authError.message);

  revalidatePath("/", "layout");
  return success(undefined, "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function forgotPasswordAction(prevState: unknown, formData: FormData): Promise<ActionResponse> {
  const validatedFields = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!validatedFields.success) return error("Dữ liệu không hợp lệ", validatedFields.error.flatten().fieldErrors);

  const supabase = await createClient();
  const origin = (await headers()).get('origin');
  const { error: authError } = await supabase.auth.resetPasswordForEmail(validatedFields.data.email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (authError) return error(authError.message);
  return success(undefined, "Đã gửi email khôi phục mật khẩu!");
}

export async function updatePasswordAction(prevState: unknown, formData: FormData): Promise<ActionResponse> {
  const validatedFields = updatePasswordSchema.safeParse({ password: formData.get("password") });
  if (!validatedFields.success) return error("Dữ liệu không hợp lệ", validatedFields.error.flatten().fieldErrors);

  const supabase = await createClient();
  const { error: authError } = await supabase.auth.updateUser({ password: validatedFields.data.password });

  if (authError) return error(authError.message);

  revalidatePath("/", "layout");
  return success(undefined, "Cập nhật mật khẩu thành công!");
}
