import { SigninData, SignupData } from "@/types/signupData";
import apiClient from "@/utils/apiClient";
import axios from "axios";
import toast from "react-hot-toast";

export const signUp = async (data: SignupData) => {
  let result = null;
  try {
    const response = await apiClient.post("/api/auth/signup", data);
    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }
    result = response?.data;
    toast.success("User created successfully");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Error creating user");
    } else {
      toast.error("Error creating user");
    }
  }
  return result;
};

export const sendOtp = async (email: string) => {
  let result = null;
  try {
    const response = await apiClient.post("/api/auth/send-otp", { email });
    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }
    result = response?.data;
    toast.success("OTP sent");
  } catch (error) {
    toast.error("Failed to send OTP");
  }
  return result;
};

export type SessionUser = { id: number; email: string; firstName: string };

// A successful login response alone does not prove the browser retained its cookie.
export const readSession = async (
  signal?: AbortSignal,
): Promise<SessionUser> => {
  const { data } = await apiClient.get("/api/auth/user", {
    signal,
    timeout: 15000,
    headers: { "Cache-Control": "no-cache" },
  });
  if (data.success !== true || !data.data?.email) {
    throw new Error("Unable to verify your session.");
  }
  return data.data;
};

export const login = async (data: SigninData): Promise<SessionUser | null> => {
  let credentialsAccepted = false;
  try {
    const response = await apiClient.post("/api/auth/login", data, {
      timeout: 15000,
    });
    if (response.data.success !== true && response.data.success !== "true") {
      throw new Error(response.data.message || "Error logging in");
    }
    credentialsAccepted = true;
    const user = await readSession();
    toast.success("Login successful");
    return user;
  } catch (error) {
    if (credentialsAccepted) {
      toast.error(
        axios.isAxiosError(error) && error.response?.status === 401
          ? "Login could not establish a session. Please allow cookies for this site and try again."
          : "Unable to verify your session. Please try again when the server is available.",
      );
    } else if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message || "Unable to log in. Please try again.",
      );
    } else {
      toast.error(error instanceof Error ? error.message : "Error logging in");
    }
    return null;
  }
};

export const logout = async () => {
  let result = null;
  try {
    const response = await apiClient.get("/api/auth/logout");
    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }
    result = response?.data;
    toast.success("Logged out");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Error logging out");
    } else {
      toast.error("Error logging out");
    }
  }
  return result;
};

export const getUser = async () => {
  let result = null;
  try {
    const response = await apiClient.get("/api/auth/user");
    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }
    result = response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Error retrieving user");
    } else {
      toast.error("Error retrieving user");
    }
  }
  return result;
};
