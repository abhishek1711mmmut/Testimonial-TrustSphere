"use client";
import Image from "next/image";
import ThemeToggler from "../Header/ThemeToggler";
import { useState } from "react";
import TextModal from "./Modal/TextModal";
import { SpaceInfo } from "@/types/space";

const ReviewForm = ({
  clientId,
  spaceName,
}: {
  clientId: string;
  spaceName: string;
}) => {
  const [openTextModal, setOpenTextModal] = useState(false);
  // const [openVideoModal, setOpenVideoModal] = useState(false);

  // create a temp spaceInfo object for testing
  const spaceInfo: SpaceInfo = {
    spaceName: "StudyNotion",
    companyLogo: "/images/logo/logo-dark.svg",
    headerTitle: "Join us",
    customMessage: "You will learn a lot",
    questions: [
      "Who are you / what are you working on?",
      "How has [our product / service] helped you?",
      "What is the best thing about [our product / service]",
    ],
  };

  return (
    <>
      <header
        className={`fixed left-0 top-0 w-full bg-white py-6 backdrop-blur-lg dark:bg-black/90`}
      >
        <div className="relative mx-auto flex max-w-c-1390 items-center justify-between px-4 md:px-8 2xl:px-0">
          <div className="flex w-full items-center justify-between lg:w-1/4">
            <a href="/">
              <Image
                src="/images/logo/logo-dark.svg"
                alt="logo"
                width={119.03}
                height={30}
                className="hidden w-full dark:block"
              />
              <Image
                src="/images/logo/logo-light.svg"
                alt="logo"
                width={119.03}
                height={30}
                className="w-full dark:hidden"
              />
            </a>
          </div>
          <ThemeToggler />
        </div>
      </header>
      <section className="relative px-4 md:px-8 2xl:px-0">
        <div
          className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          <div
            className="relative left-1/2 top-30 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 dark:opacity-15 sm:left-[calc(50%-30rem)] sm:w-[92.1875rem]"
            style={{
              clipPath:
                "clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>
        <div className="relative mx-auto max-w-c-1390 px-7.5 pt-10 lg:px-15 xl:px-20">
          <div className="mx-auto max-w-3xl pb-6 text-center md:pb-16">
            {spaceInfo.companyLogo &&
              typeof spaceInfo.companyLogo === "string" && (
                <div className="relative mb-4 inline-flex h-14 w-full flex-col justify-center md:mb-12">
                  <Image
                    loading="lazy"
                    src={spaceInfo.companyLogo}
                    alt="logo"
                    fill
                    className="mx-auto rounded-full object-contain"
                  />
                </div>
              )}
            <h1 className="mb-4 text-2xl font-extrabold text-gray-700 dark:text-gray-200 sm:text-4xl md:text-5xl">
              {spaceInfo.headerTitle}
            </h1>
            <p className="text-base text-gray-500 dark:text-manatee md:text-xl">
              <span>{spaceInfo.customMessage}</span>
            </p>
            {spaceInfo.questions.length > 0 && (
              <div className="mx-auto w-full px-4 py-4 text-left md:w-3/4">
                <h3 className="mb-2 text-lg font-semibold uppercase leading-6 text-gray-700 dark:text-gray-300">
                  question
                </h3>
                <div className="mb-2 w-10 border-b-4 border-strokedark dark:border-stroke"></div>
                <ul className="mt-2 max-w-xl list-disc pl-4 text-base text-gray-500 dark:text-manatee">
                  {spaceInfo.questions.map((question, index) => (
                    <li key={index} className="mb-2">
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-2 md:mt-6">
              <div className="mx-auto max-w-xs gap-6 sm:flex sm:max-w-none sm:justify-center">
                <button
                  aria-label="Record review Video"
                  className="dark:shadow-two mb-6 flex w-full items-center justify-center rounded-md border border-stroke bg-primary px-6 py-3 text-base text-white outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-transparent dark:bg-primary dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary dark:hover:shadow-none"
                >
                  <span className="mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-3 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                    </svg>
                  </span>
                  Record a Video
                </button>
                <button
                  aria-label="Send rview in Text"
                  onClick={() => setOpenTextModal(true)}
                  className="dark:shadow-two mb-6 flex w-full items-center justify-center rounded-md border border-violet-400 bg-transparent px-6 py-3 text-base text-black outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-transparent dark:bg-[#2C303B] dark:text-gray-300 dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary dark:hover:shadow-none"
                >
                  <span className="mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      ></path>
                    </svg>
                  </span>
                  Send in Text
                </button>
                {openTextModal && (
                  <TextModal
                    spaceInfo={spaceInfo}
                    onClose={() => setOpenTextModal(false)}
                  />
                )}
              </div>
            </div>
            <p>
              {clientId} {spaceName}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewForm;
