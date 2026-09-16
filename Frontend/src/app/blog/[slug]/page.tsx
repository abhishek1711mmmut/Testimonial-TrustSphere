import BlogData from "@/components/Blog/blogData";
import RelatedPost from "@/components/Blog/RelatedPost";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog Details Page - TrustSphere",
  description: "This is Blog details page for TrustSphere",
  // other metadata
};

const SingleBlogPage = async ({ params }: { params: { slug: string } }) => {
  const blog = BlogData.find((blog) => blog._id === Number(params.slug));
  if (!blog) notFound();
  return (
    <>
      <section className="pb-20 pt-35 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <div className="flex flex-col-reverse gap-7.5 lg:flex-row xl:gap-12.5">
            <div className="md:w-1/2 lg:w-[32%]">
              <div className="animate_top mb-10 rounded-md border border-stroke bg-white p-3.5 shadow-solid-13 dark:border-strokedark dark:bg-blacksection">
                <a href="/how-it-works" className="block rounded-lg px-6 py-4 text-black hover:text-primary dark:text-white">
                  New to TrustSphere? Read the getting started guide →
                </a>
              </div>

              <div className="animate_top mb-10 rounded-md border border-stroke bg-white p-9 shadow-solid-13 dark:border-strokedark dark:bg-blacksection">
                <h4 className="mb-7.5 text-2xl font-semibold text-black dark:text-white">
                  Explore TrustSphere
                </h4>

                <ul>
                  <li className="mb-3 transition-all duration-300 last:mb-0 hover:text-primary">
                    <a href="/blog">All Guides</a>
                  </li>
                  <li className="mb-3 transition-all duration-300 last:mb-0 hover:text-primary">
                    <a href="/how-it-works#collect">Collect Feedback</a>
                  </li>
                  <li className="mb-3 transition-all duration-300 last:mb-0 hover:text-primary">
                    <a href="/how-it-works#manage">Manage Testimonials</a>
                  </li>
                  <li className="mb-3 transition-all duration-300 last:mb-0 hover:text-primary">
                    <a href="/how-it-works#display">Embed Your Wall</a>
                  </li>
                  <li className="mb-3 transition-all duration-300 last:mb-0 hover:text-primary">
                    <a href="/testimonials">Testimonial Examples</a>
                  </li>
                </ul>
              </div>

              <RelatedPost />
            </div>

            <div className="lg:w-2/3">
              <div className="animate_top rounded-md border border-stroke bg-white p-7.5 shadow-solid-13 dark:border-strokedark dark:bg-blacksection md:p-10">
                <div className="mb-10 w-full overflow-hidden">
                  <div className="relative aspect-[97/60] w-full sm:aspect-[97/44]">
                    <Image
                      src={blog.mainImage}
                      alt={blog.title}
                      fill
                      className="rounded-md object-cover object-center"
                    />
                  </div>
                </div>

                <h2 className="mb-5 mt-11 text-3xl font-semibold text-black dark:text-white 2xl:text-sectiontitle2">
                  {blog?.title}
                </h2>

                <ul className="mb-9 flex flex-wrap gap-5 2xl:gap-7.5">
                  <li>
                    <span className="text-black dark:text-white">Author: </span>{" "}
                    TrustSphere
                  </li>
                  <li>
                    <span className="text-black dark:text-white">
                      Practical Guide
                    </span>{" "}
                  </li>
                  <li>
                    <span className="text-black dark:text-white">
                      Category:
                    </span>
                    Customer Stories
                  </li>
                </ul>

                <div className="blog-details">
                  <p>{blog?.metadata}</p>

                  {blog.body?.split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <a href="/auth/signup" className="mt-8 inline-block text-primary">Start collecting your customer stories →</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleBlogPage;
