import { createClient } from "@/shared/lib/supabase/server"
import { Header } from "./index"

export async function HeaderContainer() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  let userProfile = null

  if (session?.access_token) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (apiUrl) {
        const FETCH_TIMEOUT_MS = 10000
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

        const response = await fetch(`${apiUrl}/users/me`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          },
          cache: 'no-store',
          signal: controller.signal
        }).finally(() => clearTimeout(timeoutId))

        if (response.ok) {
          userProfile = await response.json()
        }
      }
    } catch (error) {
      console.error("Failed to fetch user profile in HeaderContainer:", error)
    }
  }

  return <Header userProfile={userProfile} />
}
