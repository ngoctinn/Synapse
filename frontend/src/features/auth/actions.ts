"use server";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  updatePasswordSchema,
} from "./model/schemas";

export async function loginAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success)
    return error(
      "Dữ liệu không hợp lệ",
      validatedFields.error.flatten().fieldErrors
    );

  const supabase = await createClient();
  const { error: authError } = await supabase.auth.signInWithPassword(
    validatedFields.data
  );

  if (authError) return error("Email hoặc mật khẩu không đúng");

  revalidatePath("/", "layout");
  return success(undefined, "Đăng nhập thành công!");
}

export async function registerAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse<{ email: string } | undefined>> {
  const validatedFields = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    fullName: formData.get("fullName"),
  });

  if (!validatedFields.success)
    return error(
      "Dữ liệu không hợp lệ",
      validatedFields.error.flatten().fieldErrors
    );

  const { email, password, fullName } = validatedFields.data;
  const supabase = await createClient();
  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, avatar_url: "" } },
  });

  if (authError) return error(authError.message);

  revalidatePath("/", "layout");
  return success(
    { email },
    "Đăng ký thành công! Vui lòng kiểm tra email để xác thực."
  );
}

export async function resendVerificationAction(
  email: string
): Promise<ActionResponse> {
  const supabase = await createClient();
  const { error: authError } = await supabase.auth.resend({
    type: "signup",
    email: email,
  });

  if (authError) return error(authError.message);
  return success(undefined, "Đã gửi lại email xác thực!");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function forgotPasswordAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const validatedFields = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });
  if (!validatedFields.success)
    return error(
      "Dữ liệu không hợp lệ",
      validatedFields.error.flatten().fieldErrors
    );

  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const { error: authError } = await supabase.auth.resetPasswordForEmail(
    validatedFields.data.email,
    {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    }
  );

  if (authError) return error(authError.message);
  return success(undefined, "Đã gửi email khôi phục mật khẩu!");
}

export async function updatePasswordAction(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const validatedFields = updatePasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!validatedFields.success)
    return error(
      "Dữ liệu không hợp lệ",
      validatedFields.error.flatten().fieldErrors
    );

  const supabase = await createClient();
  const { error: authError } = await supabase.auth.updateUser({
    password: validatedFields.data.password,
  });

  if (authError) return error(authError.message);

  revalidatePath("/", "layout");
  return success(undefined, "Cập nhật mật khẩu thành công!");
}

/**
 * Đăng nhập bằng Google OAuth
 * Trả về URL để redirect sang Google
 */
export async function signInWithGoogle(): Promise<ActionResponse<{ url: string }>> {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error: authError } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (authError || !data.url) {
    return error("Không thể kết nối với Google. Vui lòng thử lại.");
  }

  return success({ url: data.url });
}
