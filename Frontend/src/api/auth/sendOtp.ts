import apiClient from "@/utils/apiClient";
import toast from "react-hot-toast";

export const sendOtp = async (email: string) => {
  const toastId = toast.loading("Loading...");
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
