import apiClient from "@/utils/apiClient";
import axios from "axios";
import toast from "react-hot-toast";

export const createSpace = async (formData: FormData) => {
  const toastId = toast.loading("Creating space...", {
    position: "top-center",
  });
  let result = null;
  try {
    const response = await apiClient.post("/api/space/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!response?.data?.success || response.data.success === "false") {
      throw new Error(response.data.message);
    }
    result = response?.data;
    toast.success("Space created successfully");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Error creating space");
    } else {
      toast.error("Error creating space");
    }
  }
  toast.dismiss(toastId);
  return result;
};

export const getSpaces = async () => {
  let result = null;
  try {
    const response = await apiClient.get("/api/space/spaces");
    if (!response?.data?.success || response.data.success === "false") {
      throw new Error(response.data.message);
    }
    result = response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Error fetching spaces");
    } else {
      toast.error("Error fetching spaces");
    }
  }
  return result;
};

export const getPublicSpace = async (spaceId: number) => {
  let result = null;
  try {
    const response = await apiClient.get(`/api/space/public/${spaceId}`);
    if (!response?.data?.success || response.data.success === "false") {
      throw new Error(response.data.message);
    }
    result = response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Error fetching space");
    } else {
      toast.error("Error fetching space");
    }
  }
  return result;
};

export const editSpace = async (spaceId: number, formData: FormData) => {
  const toastId = toast.loading("Updating space...", {
    position: "top-center",
  });
  let result = null;
  try {
    const response = await apiClient.put(
      `/api/space/edit/${spaceId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    if (!response?.data?.success || response.data.success === "false") {
      throw new Error(response.data.message);
    }
    result = response?.data;
    toast.success("Space updated successfully");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Error updating space");
    } else {
      toast.error("Error updating space");
    }
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSpace = async (spaceId: number) => {
  const toastId = toast.loading("Deleting space...", {
    position: "top-center",
  });
  let result = null;
  try {
    const response = await apiClient.delete(`/api/space/delete/${spaceId}`);
    if (!response?.data?.success || response.data.success === "false") {
      throw new Error(response.data.message);
    }
    result = response?.data;
    toast.success("Space deleted successfully");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Error deleting space");
    } else {
      toast.error("Error deleting space");
    }
  }
  toast.dismiss(toastId);
  return result;
};
