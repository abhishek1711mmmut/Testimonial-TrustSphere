import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const OnSubmitModal = ({ onClose }: { onClose: () => void }) => {
  // creating a temp clientId and spaceName for testing
  const clientId = "123456789";
  const spaceName = "StudyNotion";
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(`http://localhost:3000/${clientId}/${spaceName}`)
      .then(() => {
        toast.success("Copied to clipboard");
      });
  };

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-300/50 backdrop-blur dark:bg-black/50 md:inset-0">
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
        <div className="relative mx-auto mt-30 h-full w-full max-w-sm p-4 md:h-auto md:max-w-md">
          <div className="relative rounded-lg border border-gray-300 bg-white p-4 text-center shadow-solid-5 dark:border-strokedark dark:bg-gray-800 sm:p-5">
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
              <div className="flex w-full justify-between rounded-md bg-gray-100 p-2 text-left text-sm text-primary dark:bg-blackho">
                <Link
                  href="/dashboard/overview"
                  target="_blank"
                  className="max-w-[90%]"
                >
                  {`http://localhost:3000/${clientId}/${spaceName}`}
                </Link>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="cursor-pointer text-gray-400"
                  onClick={copyToClipboard}
                  fill="none"
                >
                  <path
                    d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9L16 9C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16L9 15Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
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
