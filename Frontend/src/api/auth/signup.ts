import apiClient from "@/utils/apiClient";
import { SignupData } from "@/types/signupData";
import toast from "react-hot-toast";

export const signUp = async (data: SignupData) => {
  // const { setLoading } = useAppContext();
  // setLoading(true);
  try {
    const response = await apiClient.post("/auth/signup", data);
    // return response.data;
    console.log(response);
    toast.success("User created successfully");
  } catch (error) {
    // throw new Error(error.re)
    console.log("SIGNUP API ERROR............", error);
    toast.error("Error creating user");
  }
  // setLoading(false);
};
