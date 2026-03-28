import { useEffect } from "react";
import { useNavigate } from "react-router";
import { signIn, useSession } from "../../lib/auth-client";

export function Login() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/admin", { replace: true });
    }
  }, [session, navigate]);

  function handleLogin() {
    signIn.social({ provider: "google", callbackURL: "/admin" });
  }

  if (isPending) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ marginBottom: "1rem" }}>Admin Login</h1>
        <button
          onClick={handleLogin}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            cursor: "pointer",
            border: "1px solid #ddd",
            borderRadius: "4px",
            background: "white",
          }}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
