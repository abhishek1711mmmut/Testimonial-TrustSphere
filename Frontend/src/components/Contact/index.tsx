"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import axios from "axios";
import { sendSupportMessage, SupportResponse } from "@/api/support";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [errors, setErrors] = React.useState<SupportResponse["errors"]>({});
  const inFlight = React.useRef(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    inFlight.current = true;
    setIsSubmitting(true);
    setStatus(null);
    setErrors({});
    try {
      const result = await sendSupportMessage({
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        subject: String(data.get("subject") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        message: String(data.get("message") || "").trim(),
        consent: data.get("consent") === "on",
        website: String(data.get("website") || ""),
      });
      setStatus({ success: result.success, message: result.message });
      setErrors(result.errors || {});
      if (result.success) form.reset();
    } catch (error) {
      const response = axios.isAxiosError<SupportResponse>(error)
        ? error.response?.data
        : undefined;
      setErrors(response?.errors || {});
      setStatus({
        success: false,
        message:
          response?.message ||
          "We could not confirm whether your message was sent. Please wait before retrying, or email the author directly.",
      });
    } finally {
      inFlight.current = false;
      setIsSubmitting(false);
    }
  };
  /**
   * Source: https://www.joshwcomeau.com/react/the-perils-of-rehydration/
   * Reason: To fix rehydration error
   */
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  return (
    <>
      {/* <!-- ===== Contact Start ===== --> */}
      <section id="support" className="px-4 md:px-8 2xl:px-0">
        <div className="relative mx-auto max-w-c-1390 px-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
          <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:bg-gradient-to-t dark:to-[#252A42]"></div>
          <div className="absolute bottom-[-255px] left-0 -z-1 h-full w-full">
            <Image
              src="./images/shape/shape-dotted-light.svg"
              alt="Dotted"
              className="dark:hidden"
              fill
            />
            <Image
              src="./images/shape/shape-dotted-dark.svg"
              alt="Dotted"
              className="hidden dark:block"
              fill
            />
          </div>

          <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
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
              className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-3/4 xl:p-15"
            >
              <h2 className="mb-15 text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
                Send a message
              </h2>

              <form onSubmit={handleSubmit} aria-busy={isSubmitting}>
                <fieldset
                  disabled={isSubmitting}
                  className="min-w-0 border-0 p-0"
                >
                  <legend className="sr-only">
                    Contact the TrustSphere author
                  </legend>
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="support-website">
                      Leave this field empty
                    </label>
                    <input
                      id="support-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                    <div className="w-full lg:w-1/2">
                      <label htmlFor="support-name" className="sr-only">
                        Full name
                      </label>
                      <input
                        type="text"
                        placeholder="Full name"
                        id="support-name"
                        name="name"
                        autoComplete="name"
                        maxLength={100}
                        aria-invalid={Boolean(errors?.name)}
                        aria-describedby={
                          errors?.name ? "support-name-error" : undefined
                        }
                        required
                        className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                      />
                      {errors?.name && (
                        <p
                          id="support-name-error"
                          className="mt-2 text-sm text-red-600 dark:text-red-400"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="w-full lg:w-1/2">
                      <label htmlFor="support-email" className="sr-only">
                        Email address
                      </label>
                      <input
                        type="email"
                        placeholder="Email address"
                        id="support-email"
                        name="email"
                        autoComplete="email"
                        maxLength={254}
                        aria-invalid={Boolean(errors?.email)}
                        aria-describedby={
                          errors?.email ? "support-email-error" : undefined
                        }
                        required
                        className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                      />
                      {errors?.email && (
                        <p
                          id="support-email-error"
                          className="mt-2 text-sm text-red-600 dark:text-red-400"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-12.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                    <div className="w-full lg:w-1/2">
                      <label htmlFor="support-subject" className="sr-only">
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="Subject"
                        id="support-subject"
                        name="subject"
                        autoComplete="off"
                        maxLength={150}
                        aria-invalid={Boolean(errors?.subject)}
                        aria-describedby={
                          errors?.subject ? "support-subject-error" : undefined
                        }
                        required
                        className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                      />
                      {errors?.subject && (
                        <p
                          id="support-subject-error"
                          className="mt-2 text-sm text-red-600 dark:text-red-400"
                        >
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div className="w-full lg:w-1/2">
                      <label htmlFor="support-phone" className="sr-only">
                        Phone number (optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="Phone number (optional)"
                        id="support-phone"
                        name="phone"
                        autoComplete="tel"
                        maxLength={30}
                        aria-invalid={Boolean(errors?.phone)}
                        aria-describedby={
                          errors?.phone ? "support-phone-error" : undefined
                        }
                        className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                      />
                      {errors?.phone && (
                        <p
                          id="support-phone-error"
                          className="mt-2 text-sm text-red-600 dark:text-red-400"
                        >
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-11.5">
                    <label htmlFor="support-message" className="sr-only">
                      Message
                    </label>
                    <textarea
                      placeholder="Message"
                      id="support-message"
                      name="message"
                      maxLength={5000}
                      aria-invalid={Boolean(errors?.message)}
                      aria-describedby={
                        errors?.message ? "support-message-error" : undefined
                      }
                      rows={4}
                      required
                      className="w-full border-b border-stroke bg-transparent focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                    ></textarea>
                    {errors?.message && (
                      <p
                        id="support-message-error"
                        className="mt-2 text-sm text-red-600 dark:text-red-400"
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 xl:justify-between">
                    <label
                      htmlFor="default-checkbox"
                      className="mb-4 flex cursor-pointer md:mb-0"
                    >
                      <input
                        id="default-checkbox"
                        name="consent"
                        aria-invalid={Boolean(errors?.consent)}
                        aria-describedby={
                          errors?.consent ? "support-consent-error" : undefined
                        }
                        type="checkbox"
                        required
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className="mt-2 flex h-5 min-w-[20px] items-center justify-center rounded border-gray-300 bg-gray-100 text-blue-600 peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus-visible:ring-offset-blacksection peer-checked:[&_svg]:opacity-100"
                      >
                        <svg
                          className="opacity-0"
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.70704 0.792787C9.89451 0.980314 9.99983 1.23462 9.99983 1.49979C9.99983 1.76495 9.89451 2.01926 9.70704 2.20679L4.70704 7.20679C4.51951 7.39426 4.26521 7.49957 4.00004 7.49957C3.73488 7.49957 3.48057 7.39426 3.29304 7.20679L0.293041 4.20679C0.110883 4.01818 0.0100885 3.76558 0.0123669 3.50339C0.0146453 3.24119 0.119814 2.99038 0.305222 2.80497C0.490631 2.61956 0.741443 2.51439 1.00364 2.51211C1.26584 2.50983 1.51844 2.61063 1.70704 2.79279L4.00004 5.08579L8.29304 0.792787C8.48057 0.605316 8.73488 0.5 9.00004 0.5C9.26521 0.5 9.51951 0.605316 9.70704 0.792787Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                      <span className="flex max-w-[425px] cursor-pointer select-none pl-5">
                        I agree to share these details with the TrustSphere
                        author so they can respond to my message.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      aria-label="send message"
                      className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho disabled:cursor-wait disabled:opacity-60 dark:bg-btndark"
                    >
                      {isSubmitting ? "Sending…" : "Send Message"}
                      <svg
                        className="fill-white"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </fieldset>
                {errors?.consent && (
                  <p
                    id="support-consent-error"
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                  >
                    {errors.consent}
                  </p>
                )}
                {status && (
                  <p
                    role={status.success ? "status" : "alert"}
                    className={`mt-5 text-sm ${status.success ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {status.message}
                  </p>
                )}
              </form>
            </motion.div>

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
              transition={{ duration: 2, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_top w-full md:w-2/5 md:p-7.5 lg:w-[26%] xl:pt-15"
            >
              <h2 className="mb-12.5 text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
                Find us
              </h2>

              <div className="5 mb-7">
                <h3 className="mb-4 text-metatitle3 font-medium text-black dark:text-white">
                  Our Location
                </h3>
                <p>Bengaluru, Karnataka, India</p>
              </div>
              <div className="5 mb-7">
                <h3 className="mb-4 text-metatitle3 font-medium text-black dark:text-white">
                  Email Address
                </h3>
                <p>
                  <a href="mailto:abhishek002kvs@gmail.com">
                    abhishek002kvs@gmail.com
                  </a>
                </p>
              </div>
              <div>
                <h4 className="mb-4 text-metatitle3 font-medium text-black dark:text-white">
                  Getting Started
                </h4>
                <p>
                  <a href="/how-it-works">
                    Read the collection and embed guide
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* <!-- ===== Contact End ===== --> */}
    </>
  );
};

export default Contact;
