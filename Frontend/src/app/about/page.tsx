import About from "@/components/About";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Page - TrustSphere",
  description: "This is About page for TrustSphere",
  // other metadata
};

const AboutPage = () => {
  return ( 
    <div className="py-20">
      <About />
    </div>
  );
};

export default AboutPage;