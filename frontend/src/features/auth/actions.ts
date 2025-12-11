"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";
import { forgotPasswordSchema, loginSchema, registerSchema, updatePasswordSchema } from "./schemas";

/**
 * Xử lý đăng nhập người dùng
 * @param prevState Trạng thái trước đó của form (từ useActionState)
 * @param formData Dữ liệu form gửi lên
 */
export async function loginAction(prevState: unknown, formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };


  const validatedFields = loginSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.issues[0].message };
  }

  const { email, password } = validatedFields.data;
  const supabase = await createClient();


  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: error.message };
  }


  revalidatePath("/", "layout");
  return { success: true, message: "Đăng nhập thành công!" };
}

/**
 * Xử lý đăng ký tài khoản mới
 * @param formData Dữ liệu form gửi lên
 */
export async function registerAction(prevState: unknown, formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
  };


  const validatedFields = registerSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.issues[0].message };
  }

  const { email, password, fullName } = validatedFields.data;
  const supabase = await createClient();


  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        avatar_url: "",
      },
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }


  revalidatePath("/", "layout");
  return { success: true, message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực." };
}

/**
 * Xử lý đăng xuất
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * Xử lý quên mật khẩu (gửi email reset)
 * @param prevState Trạng thái trước đó
 * @param formData Dữ liệu form
 */
export async function forgotPasswordAction(prevState: unknown, formData: FormData) {
  const rawData = {
    email: formData.get("email"),
  };


  const validatedFields = forgotPasswordSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.issues[0].message };
  }

  const { email } = validatedFields.data;
  const supabase = await createClient();

  // 2. Lấy origin hiện tại để tạo link redirect chính xác
  const headerStore = await headers();
  const origin = headerStore.get('origin');


  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Đã gửi email khôi phục mật khẩu!" };
}

/**
 * Xử lý cập nhật mật khẩu mới
 * @param formData Dữ liệu form
 */
export async function updatePasswordAction(prevState: unknown, formData: FormData) {
  const rawData = {
    password: formData.get("password"),
  };


  const validatedFields = updatePasswordSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.issues[0].message };
  }

  const { password } = validatedFields.data;
  const supabase = await createClient();


  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true, message: "Cập nhật mật khẩu thành công!" };
}
