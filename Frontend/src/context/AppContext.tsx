"use client";
import { createContext, useContext, useState } from "react";

type Context = {
  //   user: any;
  //   setUser: (value: any) => void;
  //   signupData: any;
  //   setSignupData: (value: any) => void;
  token: string | null;
  setToken: (value: string | null) => void;
  isAuth: boolean;
  setIsAuth: (value: boolean) => void;
};

const AppContext = createContext<Context>({} as Context);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  //   const [user, setUser] = useState<any>({});
  const [token, setToken] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  const value = {
    // user,
    // setUser,
    // signupData,
    // setSignupData,
    token,
    setToken,
    isAuth,
    setIsAuth,
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
