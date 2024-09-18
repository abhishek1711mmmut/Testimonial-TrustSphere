"use client";
import Image from "next/image";
import { useState } from "react";
import CreateSpaceModal from "./CreateSpaceModal";

const Overview = () => {
  const length = 10;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onCreateSpaceClick = () => {
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border bg-white p-7 shadow-solid-3 transition-all dark:border-strokedark dark:bg-blacksection">
        <h1 className="mb-6 w-fit border-b border-strokedark pb-1 text-3xl font-bold text-black dark:border-waterloo dark:text-white lg:text-4xl">
          Overview
        </h1>

        <div className="flex flex-col gap-6">
          <h4 className="mb-4 text-lg text-gray-600 dark:text-zumthor">
            Your Testimonial overview
          </h4>
          <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:grid-cols-3 xl:gap-12.5">
            <div className="flex items-center gap-8 rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-blackho">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <Image
                  src="/images/icon/icon-spaces.svg"
                  alt="video icon"
                  width={24}
                  height={24}
                />
              </div>
              <div className="flex flex-col text-base text-black dark:text-zumthor">
                <p>Spaces</p>
                <b className="text-gray-400">0</b>
              </div>
            </div>
            <div className="flex items-center gap-8 rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-blackho">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <Image
                  src="/images/icon/icon-credit.svg"
                  alt="text icon"
                  width={24}
                  height={24}
                />
              </div>
              <div className="flex flex-col text-base text-black dark:text-zumthor">
                <p>Space Credit</p>
                <b className="text-gray-400">2</b>
              </div>
            </div>
            <div className="flex items-center gap-8 rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-blackho">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <Image
                  src="/images/icon/icon-plan.svg"
                  alt="video icon"
                  width={24}
                  height={24}
                />
              </div>
              <div className="flex flex-col text-base text-black dark:text-zumthor">
                <p>Plan</p>
                <b className="text-gray-400">Free</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className="flex w-fit items-center justify-between gap-2 self-end rounded-md bg-primary px-7 py-2.5 text-white duration-300 ease-in-out hover:bg-primaryho"
        onClick={onCreateSpaceClick}
      >
        Create a new space
        <svg
          width="14"
          height="14"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.83331 7.83337V0.833374H10.1666V7.83337H17.1666V10.1667H10.1666V17.1667H7.83331V10.1667H0.833313V7.83337H7.83331Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* on clicking create new space, open modal which will collect information like company name, logo, some questions which are answered by customer */}
      {isOpen && <CreateSpaceModal onClose={() => setIsOpen(false)} />}
      <div className="rounded-lg border bg-white p-7 shadow-solid-3 transition-all dark:border-strokedark dark:bg-blacksection">
        <h1 className="mb-6 pb-2 text-3xl font-bold text-black dark:text-white lg:text-4xl">
          Spaces
        </h1>

        {length > 0 ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:grid-cols-3 xl:gap-12.5">
              <div className="flex items-center gap-8 rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-blackho">
                <div className="relative flex h-10 w-10 items-center justify-center">
                  <Image
                    src="/images/icon/icon-spaces.svg"
                    alt="video icon"
                    width={24}
                    height={24}
                  />
                </div>
                <div className="flex flex-col gap-2 text-base text-black dark:text-zumthor">
                  <p>Studynotion</p>
                  <p className="text-sm text-gray-400">
                    Video : 0 &nbsp;&nbsp;&nbsp; Text : 0
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-base">No spaces yet</p>
        )}
      </div>
    </div>
  );
};

export default Overview;
