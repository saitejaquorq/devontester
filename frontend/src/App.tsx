import {
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate as useRouterNavigate,
} from "react-router-dom";

import { Icons } from "@/lib/icons";
import { AuthProvider, useAuth } from "@/lib/auth";
import SignIn from "@/screens/SignIn";
import Today from "@/screens/Today";
import Calendar from "@/screens/Calendar";
import Patients from "@/screens/Patients";
import PatientDetail from "@/screens/PatientDetail";
import Settings from "@/screens/Settings";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-2 rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-[var(--brand-hover)] text-[var(--brand-fg)]" : "text-[var(--brand-fg-muted)]",
  ].join(" ");

// The app's menu, drawn around every screen except the ones routed outside it below.
function AppShellLayout() {
  const { logout, user } = useAuth();
  const routerNavigate = useRouterNavigate();
  const isAdmin = user?.role === "admin";

  async function handleSignOut() {
    await logout();
    routerNavigate("/sign-in", { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className="border-b"
        style={{
          backgroundColor: "var(--brand-surface)",
          borderColor: "var(--brand-border)",
        }}
      >
        <div className="flex items-center gap-6 px-6 py-2">
          <p
            className="shrink-0 text-sm font-semibold"
            style={{ fontFamily: "var(--brand-font-heading)" }}
          >
            {"DevonTester"}
          </p>
          <nav aria-label="App menu" className="flex flex-wrap items-center gap-1">
            <NavLink to="/today" className={navLinkClass}>
              <Icons.Home size={16} />
              {"Today"}
            </NavLink>
            <NavLink to="/calendar" className={navLinkClass}>
              {"Calendar"}
            </NavLink>
            <NavLink to="/patients" className={navLinkClass}>
              <Icons.User size={16} />
              {"Patients"}
            </NavLink>
            <NavLink to="/settings" className={navLinkClass}>
              <Icons.Settings size={16} />
              {isAdmin ? "Accounts & help" : "Help"}
            </NavLink>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium text-[var(--brand-fg-muted)] transition-colors"
            >
              <Icons.X size={16} />
              {"Sign out"}
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

// Guards every route nested inside it: while the session is being resolved against
// GET /auth/me nothing renders, and once resolved an unauthenticated visitor is sent to
// /sign-in instead of the protected screen underneath.
function RequireAuth() {
  const { status } = useAuth();
  if (status === "loading") return null;
  if (status !== "authenticated") return <Navigate to="/sign-in" replace />;
  return <AppShellLayout />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/today" element={<Today />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patient-detail" element={<PatientDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </AuthProvider>
  );
}
