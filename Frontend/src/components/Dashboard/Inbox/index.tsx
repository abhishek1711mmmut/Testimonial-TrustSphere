"use client";
import Link from "next/link";
import { useState } from "react";
import DeleteSpaceModal from "./DeleteSpaceModal";
import Image from "next/image";

const Inbox = () => {
  const [openDeleteSpace, setOpenDeleteSpace] = useState<boolean>(false);
  const [selectedSpaceName, setSelectedSpaceName] = useState<string>("");

  // temp space data
  const spaceData = [
    {
      space: {
        id: "1",
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
    },
    {
      space: {
        id: "2",
        spaceName: "Space 2",
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
    },
    {
      space: {
        id: "3",
        spaceName: "Space 3",
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
    },
  ];

  const handleDelete = (spaceId: string) => {
    setOpenDeleteSpace(true);
    setSelectedSpaceName(spaceId);
  };

  const handleClose = () => {
    setOpenDeleteSpace(false);
    setSelectedSpaceName("");
  };

  return (
    <div className="flex flex-col gap-3">
      {spaceData.map((space, id) => (
        <div
          key={id}
          className="flex flex-col gap-2 rounded-lg border bg-gray-50 px-6 py-5 shadow-sm dark:border-strokedark dark:bg-black"
        >
          <div className="mb-2 flex items-center gap-4">
            <Image
              src={space.space.companyLogo}
              alt="logo"
              width={60}
              height={100}
              className="rounded-md object-contain max-sm:w-10"
            />
            <h2 className="text-metatitle3 text-black dark:text-manatee">
              {space.space.spaceName}
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <Link
              href={`/dashboard/inbox/${space.space.spaceName.split(" ").join("-")}`}
              className="mb- me-2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              Open Space
            </Link>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-lg border border-primary px-4 py-2 text-primary transition hover:bg-primaryho hover:text-white md:mt-0"
                type="button"
                // onClick={() => setOpenDeleteSpace(true)}
              >
                Edit
              </button>
              <button
                className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-600 px-4 py-2 text-red-600 transition hover:bg-red-600 hover:text-white md:mt-0"
                type="button"
                onClick={() => handleDelete(space.space.spaceName)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
      {
        // open delete space modal
        openDeleteSpace && (
          <DeleteSpaceModal
            onClose={handleClose}
            spaceName={selectedSpaceName}
          />
        )
      }
    </div>
  );
};

export default Inbox;
