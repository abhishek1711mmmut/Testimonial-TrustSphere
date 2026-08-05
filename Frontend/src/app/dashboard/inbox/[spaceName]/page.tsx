"use client";
import DeleteTestimonialModal from "@/components/Dashboard/Inbox/DeleteTestimonialModal";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getSpaces } from "@/api/spaces";
import {
  getTestimonialsBySpace,
} from "@/api/testimonials";
import { Space } from "@/types/reviewSpace";

type Testimonial = {
  id: number;
  rating: number;
  reviewer_name: string;
  reviewer_email: string;
  reviewer_image: string | null;
  review: string | null;
  attached_images: string[];
  video: string | null;
  created_at: string;
  space_id: number;
  type: "text" | "video";
};

const SingleSpacePage = ({ params }: { params: { spaceName: string } }) => {
  const [space, setSpace] = useState<Space | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDeleteTestimonial, setOpenDeleteTestimonial] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<{
    id: number;
    spaceId: number;
  } | null>(null);

  const fetchData = async () => {
    const spacesRes = await getSpaces();
    if (spacesRes?.data) {
      const found = spacesRes.data.find(
        (s: Space) => s.spaceName === decodeURIComponent(params.spaceName),
      );
      if (found) {
        setSpace(found);
        const testimonialsRes = await getTestimonialsBySpace(found.id);
        if (testimonialsRes?.data) setTestimonials(testimonialsRes.data);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (testimonialId: number, spaceId: number) => {
    setSelectedTestimonial({ id: testimonialId, spaceId });
    setOpenDeleteTestimonial(true);
  };

  const handleClose = () => {
    setOpenDeleteTestimonial(false);
    setSelectedTestimonial(null);
  };

  const handleDeleteSuccess = () => {
    handleClose();
    fetchData();
  };

  if (isLoading) {
    return <p className="text-center text-base">Loading...</p>;
  }

  if (!space) {
    return <p className="text-center text-base">Space not found</p>;
  }

  return (
    <div className="rounded-lg border p-7 shadow-solid-3 transition-all dark:border-strokedark dark:bg-blacksection">
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col gap-4 sm:gap-2">
          <div className="flex justify-between gap-2">
            <h1 className="text-2xl font-semibold text-black dark:text-white">
              {space.spaceName}
            </h1>
            {space.companyLogo && (
              <Image
                src={space.companyLogo}
                alt="logo"
                width={60}
                height={60}
                unoptimized
                className="rounded-md object-contain max-sm:w-10"
              />
            )}
          </div>
          <ul className="flex list-disc flex-col justify-center gap-1">
            {space.questions.map((question, id) => (
              <li key={id} className="text-sm text-gray-400">
                {question}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 flex flex-col gap-4 md:my-4">
          {testimonials.length === 0 ? (
            <p className="text-center text-base text-gray-400">
              No testimonials yet
            </p>
          ) : (
            testimonials.map((testimonial) => (
              <blockquote
                className="rounded-lg bg-gray-100 p-6 shadow-sm dark:bg-black"
                key={testimonial.id}
              >
                <div className="flex items-center gap-2">
                  {testimonial.reviewer_image ? (
                    <Image
                      alt={testimonial.reviewer_name}
                      src={testimonial.reviewer_image}
                      className="rounded-full object-cover"
                      width={50}
                      height={50}
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                      {testimonial.reviewer_name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
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
                      {testimonial.reviewer_name}
                    </p>
                  </div>
                </div>

                {testimonial.review && (
                  <p className="my-2 text-sm text-gray-700 dark:text-manatee md:text-base">
                    {testimonial.review}
                  </p>
                )}
                {testimonial.video && (
                  <video
                    src={testimonial.video}
                    controls
                    controlsList="nodownload"
                    className="w-full rounded-md border border-stroke bg-white shadow-solid-3 dark:border-strokedark dark:bg-black md:w-1/2"
                  />
                )}
                {testimonial.attached_images.length > 0 && (
                  <div className="relative flex flex-wrap gap-2 rounded-md shadow-solid-4 md:gap-5">
                    {testimonial.attached_images.map((url, id) => (
                      <Image
                        key={id}
                        src={url}
                        loading="lazy"
                        alt="attached"
                        height={200}
                        width={200}
                        unoptimized
                        className="rounded-md max-sm:w-18"
                      />
                    ))}
                  </div>
                )}
                <div className="relative mt-4 flex justify-between gap-2">
                  <div>
                    <p className="italic">
                      by{" "}
                      <span className="text-primary">
                        {testimonial.reviewer_email}
                      </span>
                    </p>
                    <p>
                      submitted on{" "}
                      <span className="text-gray-700 dark:text-alabaster">
                        {new Date(testimonial.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(testimonial.id, testimonial.space_id)
                    }
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
            ))
          )}
          {openDeleteTestimonial && selectedTestimonial && (
            <DeleteTestimonialModal
              onClose={handleClose}
              testimonialId={selectedTestimonial.id}
              spaceId={selectedTestimonial.spaceId}
              onDelete={handleDeleteSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleSpacePage;
