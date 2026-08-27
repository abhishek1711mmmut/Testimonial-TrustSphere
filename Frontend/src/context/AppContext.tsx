"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { subscribe } from "@/utils/loadingStore";
import toast from "react-hot-toast";

type Context = {
  isAuth: boolean;
  setIsAuth: (value: boolean) => void;
  userId: string | null;
  setUserId: (value: string | null) => void;
  isLoading: boolean;
};

const AppContext = createContext<Context>({} as Context);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
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
    isAuth,
    setIsAuth,
    userId,
    setUserId,
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
