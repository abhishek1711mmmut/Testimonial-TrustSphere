"use client";

import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useRef, useState } from "react";

const EmbedPage = () => {
  // temp list of all spaces
  const spaces = [
    {
      id: "1",
      spaceName: "Space 1 Testimonial",
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
    {
      id: "2",
      spaceName: "Space 2 Studynotion: An Edtech Platform",
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
    {
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
  ];

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  // const [selectedSpace, setSelectedSpace] = useState<string>("");
  const ref = useRef<HTMLDivElement | null>(null);
  const ref2 = useRef<HTMLButtonElement | null>(null);

  useOnClickOutside(ref, ref2, () => setDropdownOpen(false));

  return (
    <>
      <div className="rounded-lg border p-7 shadow-solid-3 transition-all border-stroke dark:border-strokedark dark:bg-blacksection">
        <h1 className="mb-4 w-fit border-b border-strokedark pb-1 text-3xl font-bold text-black dark:border-waterloo dark:text-white lg:text-4xl">
          Embed & Scripts
        </h1>
        <h2 className="mb-4">
          Generate scripts and embed code for your website
        </h2>

        <div className="flex flex-col gap-3">
          <button
            id="dropdownDefaultButton"
            data-dropdown-toggle="dropdown"
            className="flex w-fit items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
            ref={ref2}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Select your space
            <svg
              className="ms-3 h-2.5 w-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {/* <!-- Dropdown menu --> */}
          {dropdownOpen && (
            <div
              id="dropdown"
              className="z-10 w-fit rounded-lg bg-white px-2 shadow dark:bg-gray-700"
              ref={ref}
            >
              <ul
                className="flex flex-col divide-y divide-gray-500 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefaultButton"
              >
                {spaces.map((space, id) => (
                  <li key={id} className="py-2">
                    <button
                      type="button"
                      // onClick={() => setSelectedSpace(space.spaceName)}
                      className="block w-full rounded-md px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      {space.spaceName}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmbedPage;
