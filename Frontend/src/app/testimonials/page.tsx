import Testimonial from "@/components/Testimonial";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonial Page - TrustSphere",
  description: "This is Testimonial page for TrustSphere",
  // other metadata
};

const TestimonialPage = () => {
  return (
    <div className="pb-20 pt-40">
      <Testimonial />
    </div>
  );
};

export default TestimonialPage;
