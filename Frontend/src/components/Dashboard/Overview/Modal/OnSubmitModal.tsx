import Link from "next/link";
import { motion } from "framer-motion";

const OnSubmitModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed left-0 right-0 top-0 z-50 w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-300/50 backdrop-blur dark:bg-black/50 md:inset-0 h-full">
      <motion.div
        variants={{
          open: { opacity: 1 },
          closed: { opacity: 0 },
        }}
        initial="closed"
        animate="open"
        transition={{ duration: 0.4, ease: "easeInOut" }}
        exit="closed"
      >
        <div className="relative mx-auto mt-30 h-full w-full max-w-sm md:max-w-md p-4 md:h-auto">
          <div className="relative rounded-lg bg-white p-4 text-center shadow-solid-5 dark:bg-gray-800 sm:p-5 border border-gray-300 dark:border-strokedark">
            <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 p-2 dark:bg-green-900">
              <svg
                aria-hidden="true"
                className="h-8 w-8 text-green-500 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <p className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              {"StudyNotion"} added Successfully
            </p>
            <div className="mb-4">
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                Here is the link for your customer:
              </p>
              <div className="w-full rounded-md bg-gray-100 p-2 text-center text-sm text-primary dark:bg-blackho">
                <Link href="/dashboard/overview" target="_blank">
                  http://localhost:3000/dashboard/overview
                </Link>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primaryho focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-primary dark:hover:bg-primaryho"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OnSubmitModal;
