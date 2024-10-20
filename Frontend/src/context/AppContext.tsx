"use client";
import { createContext, useContext, useState } from "react";

// const AppContext = createContext({
//   isLoading: false,
//   setIsLoading: (value: boolean) => {},
//   token: "",
//   setToken: (value: string) => {},
//   user: {},
//   setUser: (value: any) => {},
//   signupData: {},
//   setSignupData: (value: any) => {},
//   isAuth: false,
//   setIsAuth: (value: boolean) => {},
// });

const AppContext = createContext<any>({});

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState<any>({});
  const [signupData, setSignupData] = useState<any>({});
  const [isAuth, setIsAuth] = useState(false);

  const value = {
    isLoading,
    setIsLoading,
    token,
    setToken,
    user,
    setUser,
    signupData,
    setSignupData,
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
