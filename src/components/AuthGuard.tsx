import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSession } from "../lib/auth-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate("/admin/login", { replace: true });
    }
  }, [session, isPending, navigate]);

  if (isPending) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
