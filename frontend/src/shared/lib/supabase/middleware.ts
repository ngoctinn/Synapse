import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 1. Khởi tạo Supabase Client để quản lý cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Cập nhật cookies cho request hiện tại (để Server Components đọc được)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Cập nhật cookies cho response (để trình duyệt lưu lại)
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. Làm mới session nếu cần (Logic quan trọng của Supabase Auth)
  // Lưu ý: getUser() sẽ tự động refresh token nếu nó hết hạn
  const {
    data: { user },
  } = await supabase.auth.getUser()


  const url = request.nextUrl.clone()
  const path = url.pathname

  // 3. Định nghĩa các Route công khai (Không yêu cầu đăng nhập)
  // Bao gồm: Login, Register, Forgot Password
  // LƯU Ý: /reset-password KHÔNG thuộc nhóm này vì nó yêu cầu user phải có session (sau khi exchange code) mới được vào đổi pass.
  const isAuthRoute =
    path.startsWith('/login') ||
    path.startsWith('/register') ||
    path.startsWith('/forgot-password')

  const isCallbackRoute = path.startsWith('/auth') // Callback oauth, confirm email...

  // 4. LOGIC BẢO VỆ:

  // Trường hợp 1: Người dùng CHƯA đăng nhập nhưng cố truy cập trang được bảo vệ
  // -> Redirect về Login
  // Lưu ý: Nếu user vào /reset-password mà chưa login (chưa click mail) -> cũng sẽ bị đẩy về login (Đúng logic bảo mật)
  if (!user && !isAuthRoute && !isCallbackRoute) {
    url.pathname = '/login'
    url.searchParams.set('returnUrl', path) // Lưu lại URL để redirect sau khi login xong
    return NextResponse.redirect(url)
  }

  // Trường hợp 2: Người dùng ĐÃ đăng nhập nhưng cố truy cập trang Auth (Login/Register...)
  // -> Redirect vào Dashboard (hoặc trang chủ)
  if (user && isAuthRoute) {
    url.pathname = '/' // Redirect về trang chủ/dashboard
    return NextResponse.redirect(url)
  }

  // 5. Trả về response kèm theo cookies mới (nếu có refresh)
  return supabaseResponse
}
