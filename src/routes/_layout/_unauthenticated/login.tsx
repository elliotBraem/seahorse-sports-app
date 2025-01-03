import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '../../../lib/store'

export const Route = createFileRoute('/_layout/_unauthenticated/login')({
  beforeLoad: () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated
    if (isAuthenticated) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const login = useAuthStore((state) => state.login)

  const handleLogin = async () => {
    await login('demo@example.com')
  }

  return (
    <div className="container mx-auto max-w-md p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <button
        onClick={handleLogin}
        className="w-full bg-primary text-primary-foreground px-4 py-2 rounded"
      >
        Login as Demo User
      </button>
    </div>
  )
}
