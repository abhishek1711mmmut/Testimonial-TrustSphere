"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { subscribe } from "@/utils/loadingStore";
import toast from "react-hot-toast";
import { readSession, SessionUser } from "@/api/auth";
import { usePathname } from "next/navigation";

type Context = {
  isAuth: boolean;
  setSession: (user: SessionUser) => void;
  clearSession: () => void;
  userId: string | null;
  isLoading: boolean;
};

const AppContext = createContext<Context | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const sessionRequest = useRef<AbortController | null>(null);
  const pathname = usePathname();
  const clearSession = useCallback(() => {
    sessionRequest.current?.abort();
    localStorage.removeItem("userId");
    setUser(null);
  }, []);
  const setSession = useCallback((nextUser: SessionUser) => {
    sessionRequest.current?.abort();
    localStorage.removeItem("userId");
    setUser(nextUser);
  }, []);

  useEffect(() => {
    const verify = async () => {
      sessionRequest.current?.abort();
      const controller = new AbortController();
      sessionRequest.current = controller;
      localStorage.removeItem("userId");
      try {
        const currentUser = await readSession(controller.signal);
        if (!controller.signal.aborted) setUser(currentUser);
      } catch {
        if (!controller.signal.aborted) setUser(null);
      }
    };
    void verify();
    window.addEventListener("focus", verify);
    window.addEventListener("auth:unauthorized", clearSession);
    return () => {
      sessionRequest.current?.abort();
      window.removeEventListener("focus", verify);
      window.removeEventListener("auth:unauthorized", clearSession);
    };
  }, [pathname, clearSession]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toastIdRef = useRef<string | null>(null);

  useEffect(() => {
    subscribe((loading) => setIsLoading(loading));
  }, []);

  useEffect(() => {
    if (isLoading) {
      toastIdRef.current = toast.loading("Loading...", {
        position: "top-center",
      });
    } else if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, [isLoading]);

  const value = {
    isAuth: user !== null,
    userId: user?.email.split("@")[0] ?? null,
    setSession,
    clearSession,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
}
