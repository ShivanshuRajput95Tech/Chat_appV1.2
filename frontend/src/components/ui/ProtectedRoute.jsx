import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"

export default function ProtectedRoute({ children }) {

  const { user, loading } = useAuthStore((state) => ({
    user: state.user,
    loading: state.loading
  }))

  const location = useLocation()

  /* Wait until auth check finishes */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        <div className="animate-pulse">
          Checking authentication...
        </div>
      </div>
    )
  }

  /* Not authenticated */

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  /* Authenticated */

  return children ? children : null
}