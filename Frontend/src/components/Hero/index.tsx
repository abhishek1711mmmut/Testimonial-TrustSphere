"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <>
      <section className="overflow-hidden pb-20 pt-35 md:pt-40 xl:pb-25">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <h4 className="mb-4.5 text-center text-lg font-medium italic text-black dark:text-gray-200">
            Ready to Hear What Your Customers Say?
          </h4>
          <h1 className="mx-auto mb-5 text-center text-3xl font-bold text-black dark:text-white md:w-2/5 xl:text-hero">
            Let your customers tell your story
          </h1>
          <p className="mx-auto text-center text-lg font-medium tracking-[0.02em] text-black dark:text-gray-300 md:w-4/5 lg:w-4/6">
            Collecting testimonials is hard, we get it! So we built TrustSphere.
            In minutes, you can collect text and video testimonials from your
            customers with no need for a developer or website hosting.
          </p>

          <div className="mx-auto mt-10">
            <Link
              href="/auth/signup"
              className="mx-auto flex w-fit items-center justify-center rounded-full bg-primary px-7.5 py-2.5 text-regular text-white duration-300 ease-in-out hover:bg-primaryho"
            >
              Get Started
            </Link>

            <p className="mt-5 text-center text-black dark:text-white">
              Start with a free space for your customer stories.
            </p>
          </div>
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: -20,
              },

              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1, delay: 0.1 }}
            viewport={{ once: true }}
            className="animate_top"
          >
            <div className="mx-auto mt-12.5 md:w-1/2 lg:mt-15 lg:block xl:mt-20">
              <div className="relative 2xl:-mr-7.5">
                <Image
                  src="/images/shape/shape-01.png"
                  alt="shape"
                  width={46}
                  height={246}
                  className="absolute -left-11.5 top-0"
                />
                <Image
                  src="/images/shape/shape-02.svg"
                  alt="shape"
                  width={36.9}
                  height={36.7}
                  className="absolute bottom-0 right-0 z-10"
                />
                <Image
                  src="/images/shape/shape-03.svg"
                  alt="shape"
                  width={21.64}
                  height={21.66}
                  className="absolute -right-6.5 bottom-0 z-1"
                />
                <div className="relative aspect-[3/2] w-full">
                  <Image
                    className="rounded-2xl object-cover shadow-solid-l dark:hidden"
                    src="/images/testimonials/hero-light.webp"
                    alt="Illustration of text reviews, star ratings, and video testimonials"
                    fill
                  />
                  <Image
                    className="hidden rounded-2xl object-cover shadow-solid-l dark:block"
                    src="/images/testimonials/hero-dark.webp"
                    alt="Illustration of text reviews, star ratings, and video testimonials"
                    fill
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Hero;
