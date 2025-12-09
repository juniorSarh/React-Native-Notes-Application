import { Stack, Redirect, usePathname } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";

export default function Root() {
  return (
    <AuthProvider>
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthGate>
    </AuthProvider>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return null;

  const isAuthPage = pathname === "/login" || pathname === "/register";

  // If logged-out user accesses protected page → redirect to login
  if (!user && pathname.startsWith("/(protected)")) {
    return <Redirect href="/login" />;
  }

  // If logged-in user tries to access login/register → redirect to home
  if (user && isAuthPage) {
    return <Redirect href="/(protected)/home" />;
  }

  return <>{children}</>;
}
