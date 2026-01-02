import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  t: (key: string) => string;
};

const AdminLogin: React.FC<Props> = ({ isOpen, onClose, onSuccess, t }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      onSuccess();
    } catch (err: any) {
      console.error("Admin login error:", err);

      // Friendly messages
      const code = err?.code || "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError("Email or password is incorrect.");
      } else if (code === "auth/user-not-found") {
        setError("Admin user not found.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Try again later.");
      } else {
        setError("Login failed. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{t("admin_login")}</h2>
          <button
            onClick={onClose}
            className="rounded-xl px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Admin Email</label>
            <input
              className="w-full rounded-2xl border border-zinc-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#d97706]"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              className="w-full rounded-2xl border border-zinc-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#d97706]"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {error ? (
            <div className="rounded-2xl bg-red-50 text-red-700 p-3 text-sm">{error}</div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#d97706] text-white font-bold py-3 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-zinc-500 mt-4">
          Use the admin email/password you created in Firebase Authentication.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
