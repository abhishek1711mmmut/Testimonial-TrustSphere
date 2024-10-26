import { SigninData, SignupData } from "@/types/signupData";
import apiClient from "@/utils/apiClient";
import axios from "axios";
import toast from "react-hot-toast";

export const signUp = async (data: SignupData) => {
  const toastId = toast.loading("Loading...", {
    position: "top-center",
  });
  let result = null;
  try {
    const response = await apiClient.post("/api/auth/signup", data);
    console.log("SIGNUP API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }
    result = response?.data;
    toast.success("User created successfully");
  } catch (error) {
    console.log("SIGNUP API ERROR............", error);
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message);
    } else {
      toast.error("Error creating user");
    }
  }
  toast.dismiss(toastId);
  return result;
};

export const sendOtp = async (email: string) => {
  const toastId = toast.loading("Loading...", {
    position: "top-center",
  });
  let result = null;
  try {
    const response = await apiClient.post(
      `${process.env.NEXT_PUBLIC_FLASK_API_URL}/api/auth/send-otp`,
      { email },
    );
    console.log("SEND OTP API RESPONSE........", response);
    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }
    result = response?.data;
    toast.success("OTP sent");
  } catch (error) {
    console.log("SEND OTP API ERROR............", error);
    toast.error("Failed to send OTP");
  }
  toast.dismiss(toastId);
  return result;
};

export const login = async (data: SigninData) => {
  const toastId = toast.loading("Loading...", {
    position: "top-center",
  });
  let result = null;
  try {
    const response = await apiClient.post("/api/auth/login", data);
    console.log("LOGIN API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }
    result = response?.data;
    toast.success(response?.data?.message);
  } catch (error) {
    console.log("LOGIN API ERROR............", error);
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message);
    } else {
      toast.error("Error logging in");
    }
  }
  toast.dismiss(toastId);
  return result;
};

export const logout = async () => {
  const toastId = toast.loading("Loading...", {
    position: "top-center",
  });
  let result = null;
  try {
    const response = await apiClient.get("/api/auth/logout");
    console.log("LOGOUT API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }
    result = response?.data;
    toast.success("Logged out");
  } catch (error) {
    console.log("LOGOUT API ERROR............", error);
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message);
    } else {
      toast.error("Error logging out");
    }
  }
  toast.dismiss(toastId);
  return result;
};

export const getUser = async () => {
  const toastId = toast.loading("Loading...", {
    position: "top-center",
  });
  let result = null;
  try {
    const response = await apiClient.get("/api/auth/user");
    console.log("GET USER API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }
    result = response?.data;
  } catch (error) {
    console.log("GET USER API ERROR............", error);
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message);
    } else {
      toast.error("Error retrieving user");
    }
  }
  toast.dismiss(toastId);
  return result;
};
