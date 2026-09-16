import Signup from "@/components/Auth/Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Account - TrustSphere",
  description: "Start collecting text and video testimonials with your free TrustSphere account.",
  // other metadata
};

export default function Register() {
  return (
    <>
      <Signup />
    </>
  );
}
