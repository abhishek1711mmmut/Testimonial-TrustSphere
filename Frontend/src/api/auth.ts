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

export const login = async (data: SigninData) => {
  let result = null;
  try {
    const response = await apiClient.post("/api/auth/login", data);
    if (!response?.data?.success) {
      throw new Error(response.data.message);
    }
    result = response?.data;
    toast.success(response?.data?.message);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Error logging in");
    } else {
      toast.error("Error logging in");
    }
  }
  return result;
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
