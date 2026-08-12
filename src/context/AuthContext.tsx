"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/user";

export type AuthStatus = "loading" | "authenticated" | "guest";

export type LoginInput = { email: string; password: string };
export type RegisterInput = { name: string; email: string; password: string };

type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: User | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(initialUser);
  const [status, setStatus] = useState<AuthStatus>(
    initialUser ? "authenticated" : "guest"
  );

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data: { user?: User | null }) => {
        if (!active) return;
        setUser(data.user ?? null);
        setStatus(data.user ? "authenticated" : "guest");
      })
      .catch(() => {
        if (active) {
          setUser(null);
          setStatus("guest");
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = (await response.json()) as { user?: User | null };
      setUser(data.user ?? null);
      setStatus(data.user ? "authenticated" : "guest");
    } catch {
      setUser(null);
      setStatus("guest");
    }
  }, []);

  const login = useCallback(
    async ({ email, password }: LoginInput) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as
        | { user?: User; error?: string }
        | { message?: string };
      if (!response.ok) {
        throw new Error("error" in data ? data.error : "Giriş başarısız.");
      }
      if ("user" in data && data.user) {
        setUser(data.user);
        setStatus("authenticated");
      }
      router.refresh();
    },
    [router]
  );

  const register = useCallback(
    async ({ name, email, password }: RegisterInput) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = (await response.json()) as
        | { user?: User; error?: string }
        | { message?: string };
      if (!response.ok) {
        throw new Error("error" in data ? data.error : "Kayıt başarısız.");
      }
      if ("user" in data && data.user) {
        setUser(data.user);
        setStatus("authenticated");
      }
      router.refresh();
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // çerez temizlenemese bile istemci durumu sıfırlanır
    }
    setUser(null);
    setStatus("guest");
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({ user, status, login, register, logout, refresh }),
    [user, status, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth, AuthProvider içinde kullanılmalıdır.");
  }
  return context;
}