"use server";

export async function loginAction(formData: FormData) {
  // Mock delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const email = formData.get("email");
  const password = formData.get("password");

  console.log("Login attempt:", { email, password });

  // Mock success
  return { success: true, message: "Đăng nhập thành công!" };
}

export async function registerAction(_formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Register attempt");
  return { success: true, message: "Đăng ký thành công!" };
}

export async function forgotPasswordAction(_formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Forgot password attempt");
  return { success: true, message: "Đã gửi email khôi phục mật khẩu!" };
}

export async function updatePasswordAction(_formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Update password attempt");
  return { success: true, message: "Cập nhật mật khẩu thành công!" };
}
