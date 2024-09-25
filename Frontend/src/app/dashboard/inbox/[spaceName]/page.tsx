"use client";
import DeleteTestimonialModal from "@/components/Dashboard/Inbox/DeleteTestimonialModal";
import Image from "next/image";
import { useState } from "react";

const SingleSpacePage = ({ params }: { params: { spaceName: string } }) => {
  const [openDeleteTestimonial, setOpenDeleteTestimonial] =
    useState<boolean>(false);
  const [selectedTestimonialId, setSelectedTestimonialId] =
    useState<string>("");

  // create a temp space data of that particular space with its testimonials
  const tempSpaceData = {
    spaceDetails: {
      spaceName: "Space 1",
      companyLogo:
        "https://res.cloudinary.com/di7uoxiqp/image/upload/v1726247392/Testimonials/eztojwizpqmv3kpjvmis.png",
      headerTitle: "Join us",
      customMessage: "You will learn a lot",
      questions: [
        "Who are you / what are you working on?",
        "How has [our product / service] helped you?",
        "What is the best thing about [our product / service]",
      ],
    },
    testimonials: [
      {
        rating: 4,
        reviewerName: "John Doe",
        reviewerEmail: "johndoe@gmail.com",
        reviewerImage:
          "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80",
        video:
          "https://res.cloudinary.com/di7uoxiqp/video/upload/v1726230004/Testimonials/lz3wp9m32hky4taujxja.mp4",
          createdAt: "Sep 23, 2024, 12:13:05 PM",
      },
      {
        rating: 1,
        reviewerName: "Jkmmi",
        reviewerEmail: "johndoe@gmail.com",
        reviewerImage:
          "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80",
        review:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat.",
        attachedImages: [
          {
            url: "https://res.cloudinary.com/di7uoxiqp/image/upload/v1696439269/StudyNotion/okgamlvscznt8h6xpfnp.jpg",
          },
          {
            url: "https://res.cloudinary.com/di7uoxiqp/image/upload/v1696439269/StudyNotion/okgamlvscznt8h6xpfnp.jpg",
          },
          {
            url: "https://res.cloudinary.com/di7uoxiqp/image/upload/v1696439269/StudyNotion/okgamlvscznt8h6xpfnp.jpg",
          },
        ],
      },
      {
        rating: 1,
        reviewerName: "John Sina",
        reviewerEmail: "johndoe@gmail.com",
        reviewerImage:
          "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80",
        review:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat.",
        attachedImages: [
          {
            url: "https://res.cloudinary.com/di7uoxiqp/image/upload/v1696439269/StudyNotion/okgamlvscznt8h6xpfnp.jpg",
          },
          {
            url: "https://res.cloudinary.com/di7uoxiqp/image/upload/v1696439269/StudyNotion/okgamlvscznt8h6xpfnp.jpg",
          },
          {
            url: "https://res.cloudinary.com/di7uoxiqp/image/upload/v1696439269/StudyNotion/okgamlvscznt8h6xpfnp.jpg",
          },
        ],
      },
      {
        rating: 1,
        reviewerName: "John Sina",
        reviewerEmail: "johndoe@gmail.com",
        reviewerImage:
          "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80",
        review:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam consequat.",
        attachedImages: [
          {
            url: "https://res.cloudinary.com/di7uoxiqp/image/upload/v1696439269/StudyNotion/okgamlvscznt8h6xpfnp.jpg",
          },
          {
            url: "https://res.cloudinary.com/di7uoxiqp/image/upload/v1696439269/StudyNotion/okgamlvscznt8h6xpfnp.jpg",
          },
          {
            url: "https://res.cloudinary.com/di7uoxiqp/image/upload/v1696439269/StudyNotion/okgamlvscznt8h6xpfnp.jpg",
          },
        ],
      },
    ],
  };

  const handleDelete = (testimonialId: string) => {
    setOpenDeleteTestimonial(true);
    setSelectedTestimonialId(testimonialId);
  };

  const handleClose = () => {
    setOpenDeleteTestimonial(false);
    setSelectedTestimonialId("");
  };

  return (
    <div className="rounded-lg border p-7 shadow-solid-3 transition-all dark:border-strokedark dark:bg-blacksection">
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col gap-4 sm:gap-2">
          <div className="flex justify-between gap-2">
            <h1 className="text-2xl font-semibold text-black dark:text-white">
              {params.spaceName}
            </h1>
            <Image
              src={tempSpaceData.spaceDetails.companyLogo}
              alt="logo"
              width={60}
              height={60}
              className="rounded-md object-contain max-sm:w-10"
            />
          </div>
          <ul className="flex list-disc flex-col justify-center gap-1">
            {tempSpaceData.spaceDetails.questions.map((question, id) => (
              <li key={id} className="text-sm text-gray-400">
                {question}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 flex flex-col gap-4 md:my-4">
          {tempSpaceData.testimonials.map((testimonial, id) => (
            <blockquote
              className="rounded-lg bg-gray-100 p-6 shadow-sm dark:bg-black"
              key={id}
            >
              <div className="flex items-center gap-2">
                {/* avatar image */}
                <Image
                  alt=""
                  src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
                  className="rounded-full object-cover"
                  width={50}
                  height={50}
                />

                <div>
                  {/* star rating icon */}
                  <div className="flex gap-0.5 text-yellow-400">
                    {Array.from({ length: testimonial.rating })
                      .fill(null)
                      .map((_, i) => (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          key={i}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                  </div>

                  <p className="text-md mt-0.5 font-medium text-gray-900 dark:text-alabaster">
                    {testimonial.reviewerName}
                  </p>
                </div>
              </div>

              <p className="my-2 text-sm text-gray-700 dark:text-manatee md:text-base">
                {testimonial.review}
              </p>
              {
                // video player
                testimonial.video && (
                  <video
                    src={testimonial.video}
                    controls
                    controlsList="nodownload"
                    className="w-full rounded-md border border-stroke bg-white shadow-solid-3 dark:border-strokedark dark:bg-black md:w-1/2"
                  />
                )
              }
              {/* delete testimonial button */}
              <div className="relative flex flex-wrap gap-2 rounded-md shadow-solid-4 md:gap-5">
                {testimonial.attachedImages?.map((image, id) => (
                  <Image
                    key={id}
                    src={image.url}
                    loading="lazy"
                    alt="..."
                    height={200}
                    width={200}
                    className="rounded-md max-sm:w-18"
                  />
                ))}
              </div>
              <div className="relative mt-4 flex justify-between gap-2">
                <div>
                  <p className="italic">
                    by{" "}
                    <span className="text-primary">
                      {testimonial.reviewerEmail}
                    </span>
                  </p>
                  <p>
                    submitted on{" "}
                    <span className="text-gray-700 dark:text-alabaster">
                      {/* {new Date(testimonial.createdAt).toLocaleDateString()} */}
                      {testimonial.createdAt}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(testimonial.reviewerName)}
                  className="self-end"
                >
                  <Image
                    src="/images/icon/icon-delete.svg"
                    alt="delete icon"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </blockquote>
          ))}
          {
            // open delete testimonial modal
            openDeleteTestimonial && (
              <DeleteTestimonialModal
                onClose={handleClose}
                name={selectedTestimonialId}
              />
            )
          }
        </div>
      </div>
    </div>
  );
};

export default SingleSpacePage;
