import { SpaceInfo, Review } from "@/types/reviewSpace";
import Image from "next/image";
import { useState, useRef, memo, useCallback } from "react";
import Rating from "./Rating";
import { motion, AnimatePresence } from "framer-motion";

const TextModal = ({
  spaceInfo,
  onClose,
}: {
  spaceInfo: SpaceInfo;
  onClose: () => void;
}) => {
  // omit video from text review data
  const [textReviewData, setTextReviewData] = useState<Omit<Review, "video">>({
    rating: 0,
    review: "",
    attachedImages: [],
    reviewerName: "",
    reviewerEmail: "",
    reviewerImage: null,
  });

  const reviewerImageRef = useRef<HTMLInputElement>(null);
  const attachedImagesRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setTextReviewData((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Handler to trigger the upload reviewer image button
  const uploadUserImageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (!reviewerImageRef || !reviewerImageRef.current) return;

    reviewerImageRef.current.click();
  };

  //   Handler to trigger the upload attached images button
  const uploadAttachedImagesButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (!attachedImagesRef || !attachedImagesRef.current) return;

    attachedImagesRef.current.click();
  };

  //   Handler to upload reviewer image
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // Check if a file was actually selected before accessing files[0]
    if (event.target.files && event.target.files.length > 0) {
      const maxSizeinBytes = 1024 * 1024 * 2; // 2MB
      const file =
        event.target.files[0].size > maxSizeinBytes
          ? await compressImage(event.target.files[0])
          : event.target.files[0];
      setTextReviewData((prevInfo) => ({
        ...prevInfo,
        reviewerImage: file,
      }));
    } else {
      // Handle the case where no file is selected (optional)
      console.log("No file selected");
    }
  };

  //   Handler to upload the atttached images
  const handleAttachedImagesUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files) {
      const compressedImages = [...textReviewData.attachedImages];

      // Loop over the files and compress only the last 5 images
      let i = files.length > 5 ? files.length - 5 : 0;
      for (; i < files.length; i++) {
        const compressedFile =
          files[i].size > 1024 * 300 ? await compressImage(files[i]) : files[i]; // Compress the image if its size is greater than 300 KB
        if (compressedImages.length < 5) {
          compressedImages.push(compressedFile);
        } else {
          // Remove the first element from the array
          compressedImages.shift();
          compressedImages.push(compressedFile);
        }
      }
      setTextReviewData((prevInfo) => ({
        ...prevInfo,
        attachedImages: compressedImages,
      }));
      // Reset the file input
      if (attachedImagesRef.current) {
        attachedImagesRef.current.value = "";
      }
    }
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = document.createElement("img") as HTMLImageElement;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        let scaleFactor = 1;
        if (file.size > 1024 * 1024 * 20) {
          scaleFactor = 0.15;
        } else if (
          file.size > 1024 * 1024 * 10 &&
          file.size <= 1024 * 1024 * 20
        ) {
          scaleFactor = 0.25;
        } else if (
          file.size > 1024 * 1024 * 5 &&
          file.size <= 1024 * 1024 * 10
        ) {
          scaleFactor = 0.3;
        } else if (
          file.size > 1024 * 1024 * 2 &&
          file.size <= 1024 * 1024 * 5
        ) {
          scaleFactor = 0.4;
        } else if (file.size > 1024 * 300 && file.size <= 1024 * 1024 * 2) {
          scaleFactor = 0.5;
        }
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;

        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                });
                resolve(compressedFile);
              }
            },
            file.type,
            0.5, // 0.5 is the quality of compression
          );
        }
      };

      reader.readAsDataURL(file);
    });
  };

  //   Handler to delete all attached images
  const deleteAllAttachedImages = () => {
    setTextReviewData((prevInfo) => ({
      ...prevInfo,
      attachedImages: [],
    }));
  };

  //   Handler to delete single attached image
  const deleteSingleAttachedImage = useCallback(
    (index: number) => {
      setTextReviewData((prevInfo) => ({
        ...prevInfo,
        attachedImages: prevInfo.attachedImages.filter((_, i) => i !== index),
      }));
    },
    [setTextReviewData],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle the customer information here (e.g., send it to a server)
    console.log(textReviewData);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed left-0 right-0 top-0 z-50 flex w-full justify-center overflow-y-auto overflow-x-hidden md:inset-0 md:h-full">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.75,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              ease: "easeOut",
              duration: 0.15,
            },
          }}
          exit={{
            opacity: 0,
            scale: 0.75,
            transition: {
              ease: "easeIn",
              duration: 0.15,
            },
          }}
        >
          <div className="relative mt-20 h-full w-full max-w-2xl p-4 md:h-auto">
            {/* <!-- Modal content --> */}
            <div className="relative rounded-lg border bg-white p-4 shadow-solid-3 dark:border-strokedark dark:bg-gray-800 sm:p-5">
              {/* <!-- Modal header --> */}
              <div className="mb-4 flex flex-col gap-4 rounded-t border-b pb-4 dark:border-gray-600 sm:mb-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Write text testimonial to
                  </h3>
                  <button
                    type="button"
                    className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={onClose}
                  >
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {spaceInfo.companyLogo &&
                  typeof spaceInfo.companyLogo === "string" && (
                    <div className="relative h-10 md:max-w-[50%]">
                      <Image
                        src={spaceInfo.companyLogo}
                        alt="company logo"
                        fill
                        className="object-contain object-left"
                      />
                    </div>
                  )}
              </div>
              <section>
                {spaceInfo.questions.length > 0 && (
                  <div className="mx-auto px-4 py-4 text-left">
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
              </section>
              {/* <!-- Modal body --> */}
              <form
                onSubmit={handleSubmit}
                className="mb-4 flex flex-col gap-5"
              >
                {/* rating section */}
                <Rating
                  onChange={(rating) =>
                    setTextReviewData((prevInfo) => ({ ...prevInfo, rating }))
                  }
                />

                {/* review textarea */}
                <textarea
                  id="review"
                  name="review"
                  value={textReviewData.review}
                  onChange={handleChange}
                  rows={4}
                  minLength={20}
                  maxLength={500}
                  placeholder="Write your thoughts here"
                  required
                  className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                ></textarea>

                {/* attached images section */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="attachedImages"
                    className="mb-2 block px-4 text-left text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Attach Image(s) (upto 5)
                  </label>

                  {/* upload and delete images button */}
                  <div className="flex gap-4">
                    {/* upload attached images button */}
                    <button
                      type="button"
                      onClick={uploadAttachedImagesButtonClick}
                      className="ml-2 self-start rounded-md border border-strokedark px-2 py-1 text-black dark:border-stroke dark:text-gray-300"
                    >
                      Choose File
                    </button>

                    {/* delete all attached images button */}
                    <button type="button" onClick={deleteAllAttachedImages}>
                      <Image
                        src="/images/icon/icon-delete.svg"
                        alt="delete icon"
                        width={24}
                        height={24}
                        className="text-red-400"
                      />
                    </button>
                  </div>

                  <input
                    type="file"
                    name="images"
                    id="images"
                    accept="image/*"
                    multiple
                    hidden
                    ref={attachedImagesRef}
                    onChange={handleAttachedImagesUpload}
                  />
                  {/* attached images preview */}
                  <ImagePreview
                    attachedImages={textReviewData.attachedImages}
                    onDelete={deleteSingleAttachedImage}
                  />
                </div>
                {/* reviewer name section */}
                <div>
                  <label
                    htmlFor="reviewerName"
                    className="mb-2 block px-4 text-left text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="reviewerName"
                    id="reviewerName"
                    value={textReviewData.reviewerName}
                    onChange={handleChange}
                    placeholder="name"
                    maxLength={50}
                    required
                    className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                {/* reviewer email section */}
                <div>
                  <label
                    htmlFor="reviewerEmail"
                    className="mb-2 block px-4 text-left text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="reviewerEmail"
                    id="reviewerEmail"
                    value={textReviewData.reviewerEmail}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                {/* reviewer image section */}
                <div className="flex flex-col gap-2">
                  <label
                    // htmlFor="reviewerImage"
                    className="mb-2 block px-4 text-left text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Upload Your Photo
                  </label>
                  <div className="flex gap-4">
                    <div className="relative z-0 h-16 w-16 rounded-full">
                      {/* displaying the preview of the reviewer image */}
                      {textReviewData.reviewerImage &&
                      textReviewData.reviewerImage instanceof File ? (
                        <Image
                          src={URL.createObjectURL(
                            textReviewData.reviewerImage,
                          )}
                          alt="your photo"
                          fill
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full rounded-full bg-gray-300 dark:bg-gray-700"></div>
                      )}
                    </div>
                    {/* reviewer image upload button */}
                    <button
                      type="button"
                      onClick={uploadUserImageButtonClick}
                      className="self-center rounded-md border border-strokedark px-2 py-1 text-black dark:border-stroke dark:text-gray-300"
                    >
                      {textReviewData.reviewerImage
                        ? "Change File"
                        : "Select File"}
                    </button>
                    <input
                      type="file"
                      //   id="reviewerImage"
                      name="reviewerImage"
                      accept="image/*"
                      ref={reviewerImageRef}
                      onChange={handleFileChange}
                      hidden
                    />
                  </div>
                </div>
                {/* link checkbox */}
                <div className="flex gap-4 px-4">
                  <input
                    id="link-checkbox"
                    type="checkbox"
                    value=""
                    className="h-5 w-5"
                    required
                  />
                  <label
                    htmlFor="link-checkbox"
                    className="ms-2 text-left text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    I give permission to use this testimonial across social
                    channels and other marketing efforts.
                  </label>
                </div>
                {/* cancel and submit button */}
                <div className="mr-2 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="mb-2 me-2 rounded-lg border border-gray-800 px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="mb-2 me-2 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TextModal;

// Memoized component for image preview so that it only re-renders when the selected image changes and avoiding unnecessary re-renders
const ImagePreview = memo(function ImagePreview({
  attachedImages,
  onDelete,
}: {
  attachedImages: File[];
  onDelete: (index: number) => void;
}) {
  const [selectedId, setSelectedId] = useState(""); // State to store the selected attached image

  const deleteSingleAttachedImage = (index: number) => {
    onDelete(index);
    setSelectedId("");
  };
  return (
    <motion.div className="z-1 mt-2 flex flex-wrap gap-4">
      {attachedImages.length > 0 &&
        attachedImages.map((image, index) => (
          <motion.div
            layoutId={`card-container-${index}`}
            key={index}
            variants={{
              hidden: {
                opacity: 0,
                x: -20,
              },

              visible: {
                opacity: 1,
                x: 0,
              },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.3 }}
            className="animate_right relative h-16 w-16 rounded-lg bg-black"
          >
            <Image
              loading="lazy"
              src={URL.createObjectURL(image)}
              alt="attached image"
              fill
              className="cursor-zoom-in rounded-lg bg-black object-cover"
              onClick={() => setSelectedId(index.toString())}
              quality={50}
            />
            <button
              type="button"
              className="absolute -right-2 -top-2 rounded-full border border-blackho bg-white dark:bg-gray-400"
              onClick={() => deleteSingleAttachedImage(index)}
            >
              {/* delete icon svg */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                color="#000000"
                fill="none"
              >
                <path
                  d="M18 6L12 12M12 12L6 18M12 12L18 18M12 12L6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </motion.div>
        ))}
      <AnimatePresence>
        {selectedId && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            {attachedImages.map(
              (image, index) =>
                index.toString() === selectedId && (
                  <motion.div
                    className="relative max-h-[80vh] max-w-[90vw]"
                    layoutId={`card-container-${index}`}
                    key={index}
                  >
                    <motion.button
                      type="button"
                      className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-center text-white"
                      onClick={() => setSelectedId("")}
                    >
                      Close
                    </motion.button>

                    <motion.img
                      src={URL.createObjectURL(image)}
                      className="max-h-[80vh] w-full rounded-lg"
                    />
                  </motion.div>
                ),
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
