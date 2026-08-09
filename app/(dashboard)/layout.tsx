"use client";
import Sidebar from "@/components/Sidebar";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: "50%", animation: "spin 1s linear infinite", border: "4px solid #22c55e", borderTopColor: "transparent", background: "transparent" }} />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return (
      <main style={{ marginLeft: 0, padding: 0 }}>
        {children}
      </main>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="main-content">
        <AuthCheck>{children}</AuthCheck>
      </main>
    </>
  );
}
