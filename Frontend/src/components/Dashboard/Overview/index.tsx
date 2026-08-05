"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CreateSpaceModal from "./Modal/CreateSpaceModal";
import OnSubmitModal from "./Modal/OnSubmitModal";
import { getSpaces } from "@/api/spaces";
import { getUser } from "@/api/auth";
import { Space, UserData } from "@/types/reviewSpace";

const Overview = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateSpaceModalOpen, setIsCreateSpaceModalOpen] = useState(false);
  const [isOnSubmitModalOpen, setIsOnSubmitModalOpen] = useState(false);
  const [createdSpace, setCreatedSpace] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const fetchData = async () => {
    const [spacesRes, userRes] = await Promise.all([getSpaces(), getUser()]);
    if (spacesRes?.data) setSpaces(spacesRes.data);
    if (userRes?.data) setUserData(userRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onCreateSpaceClick = () => {
    setIsCreateSpaceModalOpen(true);
  };

  const handleSubmitSpace = async (spaceData: {
    id: number;
    name: string;
  }) => {
    setIsCreateSpaceModalOpen(false);
    setCreatedSpace(spaceData);
    await fetchData();
    setTimeout(() => {
      setIsOnSubmitModalOpen(true);
    }, 300);
  };

  const onCloseOnSubmitModal = () => {
    setIsOnSubmitModalOpen(false);
    setCreatedSpace(null);
  };

  const remainingCredits = userData
    ? userData.maxSpaces - spaces.length
    : 0;

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
                  alt="spaces icon"
                  width={24}
                  height={24}
                />
              </div>
              <div className="flex flex-col text-base text-black dark:text-zumthor">
                <p>Spaces</p>
                <b className="text-gray-400">
                  {isLoading ? "..." : spaces.length}
                </b>
              </div>
            </div>
            <div className="flex items-center gap-8 rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-blackho">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <Image
                  src="/images/icon/icon-credit.svg"
                  alt="credit icon"
                  width={24}
                  height={24}
                />
              </div>
              <div className="flex flex-col text-base text-black dark:text-zumthor">
                <p>Space Credit</p>
                <b className="text-gray-400">
                  {isLoading ? "..." : remainingCredits}
                </b>
              </div>
            </div>
            <div className="flex items-center gap-8 rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-blackho">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <Image
                  src="/images/icon/icon-plan.svg"
                  alt="plan icon"
                  width={24}
                  height={24}
                />
              </div>
              <div className="flex flex-col text-base text-black dark:text-zumthor">
                <p>Plan</p>
                <b className="text-gray-400">
                  {isLoading ? "..." : (userData?.planName || "Free")}
                </b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className="flex w-fit items-center justify-between gap-2 self-center rounded-md bg-primary px-7 py-2.5 text-white duration-300 ease-in-out hover:bg-primaryho sm:self-end"
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

      {isCreateSpaceModalOpen && (
        <CreateSpaceModal
          onSubmit={handleSubmitSpace}
          onClose={() => setIsCreateSpaceModalOpen(false)}
        />
      )}

      {isOnSubmitModalOpen && createdSpace && (
        <OnSubmitModal
          onClose={onCloseOnSubmitModal}
          spaceId={createdSpace.id}
          spaceName={createdSpace.name}
        />
      )}

      <div className="rounded-lg border bg-white p-7 shadow-solid-3 transition-all dark:border-strokedark dark:bg-blacksection">
        <h1 className="mb-6 pb-2 text-3xl font-bold text-black dark:text-white lg:text-4xl">
          Spaces
        </h1>

        {isLoading ? (
          <p className="text-center text-base">Loading...</p>
        ) : spaces.length > 0 ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:grid-cols-3 xl:gap-12.5">
              {spaces.map((space) => (
                <Link
                  key={space.id}
                  href={`/dashboard/inbox/${space.spaceName}`}
                >
                  <div className="flex cursor-pointer items-center gap-8 rounded-lg border border-gray-300 bg-white p-3 transition-colors hover:border-primary dark:border-gray-600 dark:bg-blackho dark:hover:border-primary">
                    <div className="relative flex h-10 w-10 items-center justify-center">
                      {space.companyLogo ? (
                        <Image
                          src={space.companyLogo}
                          alt={space.spaceName}
                          width={40}
                          height={40}
                          unoptimized
                          className="rounded-lg object-contain"
                        />
                      ) : (
                        <Image
                          src="/images/icon/icon-spaces.svg"
                          alt={space.spaceName}
                          width={24}
                          height={24}
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-2 text-base text-black dark:text-zumthor">
                      <p>{space.spaceName}</p>
                      <p className="text-sm text-gray-400">
                        Video : {space.video_review_count} &nbsp;&nbsp;&nbsp;
                        Text : {space.text_review_count}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
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
