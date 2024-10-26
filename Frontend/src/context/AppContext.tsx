"use client";
import { createContext, useContext, useState } from "react";

type Context = {
  isAuth: boolean;
  setIsAuth: (value: boolean) => void;
  userId: string | null;
  setUserId: (value: string | null) => void;
};

const AppContext = createContext<Context>({} as Context);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  const value = {
    isAuth,
    setIsAuth,
    userId,
    setUserId,
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
