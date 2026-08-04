import apiClient from "@/utils/apiClient";
import axios from "axios";
import toast from "react-hot-toast";

export const createTestimonial = async (formData: FormData) => {
  const toastId = toast.loading("Submitting testimonial...", {
    position: "top-center",
  });
  let result = null;
  try {
    const response = await apiClient.post(
      "/api/testimonial/create",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    if (!response?.data?.success || response.data.success === "false") {
      throw new Error(response.data.message);
    }
    result = response?.data;
    toast.success("Testimonial submitted successfully!");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message || "Error submitting testimonial",
      );
    } else {
      toast.error("Error submitting testimonial");
    }
  }
  toast.dismiss(toastId);
  return result;
};

export const getTestimonialsBySpace = async (spaceId: number) => {
  let result = null;
  try {
    const response = await apiClient.get(
      `/api/testimonial/space/${spaceId}/testimonials`,
    );
    if (!response?.data?.success || response.data.success === "false") {
      throw new Error(response.data.message);
    }
    result = response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message || "Error fetching testimonials",
      );
    } else {
      toast.error("Error fetching testimonials");
    }
  }
  return result;
};

export const deleteTestimonial = async (
  testimonialId: number,
  spaceId: number,
) => {
  const toastId = toast.loading("Deleting testimonial...", {
    position: "top-center",
  });
  let result = null;
  try {
    const response = await apiClient.delete(
      `/api/testimonial/delete/${testimonialId}/${spaceId}`,
    );
    if (!response?.data?.success || response.data.success === "false") {
      throw new Error(response.data.message);
    }
    result = response?.data;
    toast.success("Testimonial deleted");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message || "Error deleting testimonial",
      );
    } else {
      toast.error("Error deleting testimonial");
    }
  }
  toast.dismiss(toastId);
  return result;
};
