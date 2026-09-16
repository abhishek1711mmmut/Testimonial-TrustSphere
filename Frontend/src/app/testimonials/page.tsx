import Testimonial from "@/components/Testimonial";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Testimonial Examples - TrustSphere",
  description: "Explore testimonial examples for products, services, and courses, then learn what to ask when collecting your own customer stories with TrustSphere.",
  // other metadata
};

const TestimonialPage = () => {
  return (
    <div className="pb-20 pt-40">
      <Testimonial />
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-black dark:text-white">
          Your customers have their own stories to tell.
        </h2>
        <p className="mb-6 text-base leading-relaxed">
          Ask what they needed help with, what stood out, and what changed for
          them. Share your TrustSphere collection link and let them answer in
          their own words—with text, photos, or a video.
        </p>
        <Link
          href="/auth/signup"
          className="inline-flex rounded-full bg-primary px-7.5 py-3 font-medium text-white transition-colors hover:bg-primaryho"
        >
          Start collecting testimonials
        </Link>
        <p className="mt-4 text-sm">
          <Link href="/how-it-works" className="text-primary hover:underline">
            See how collection and website embeds work
          </Link>
        </p>
      </div>
    </div>
  );
};

export default TestimonialPage;
