import apiClient from "@/utils/apiClient";

export type SupportMessage = {
  name: string;
  email: string;
  subject: string;
  phone: string;
  message: string;
  consent: boolean;
  website: string;
};

export type SupportResponse = {
  success: boolean;
  message: string;
  errors?: Partial<Record<keyof SupportMessage, string>>;
};

export async function sendSupportMessage(data: SupportMessage) {
  const response = await apiClient.post<SupportResponse>(
    "/api/support/contact",
    data,
    {
      timeout: 30000,
    },
  );
  return response.data;
}
