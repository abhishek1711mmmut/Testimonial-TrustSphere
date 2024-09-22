"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { SpaceInfo } from "@/types/reviewSpace";

type ModalProps = {
  onSubmit: () => void;
  onClose: () => void;
};

const Modal = ({ onSubmit, onClose }: ModalProps) => {
  const [spaceInfo, setSpaceInfo] = useState<SpaceInfo>({
    spaceName: "",
    companyLogo: null,
    headerTitle: "",
    customMessage: "",
    questions: [
      "Who are you / what are you working on?",
      "How has [our product / service] helped you?",
      "What is the best thing about [our product / service]?",
    ],
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setSpaceInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Handler to update individual question
  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...spaceInfo.questions];
    updatedQuestions[index] = value; // Update the specific question

    setSpaceInfo((prevInfo) => ({
      ...prevInfo,
      questions: updatedQuestions,
    }));
  };

  // Handler to update individual question
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Check if a file was actually selected before accessing files[0]
    if (event.target.files && event.target.files.length > 0) {
      const maxSizeinBytes = 1024 * 1024 * 2; // 2MB
      const file = event.target.files[0];
      if (file.size > maxSizeinBytes) {
        alert("Image size exceeds the maximum limit of 2 MB.");
        return;
      }
      setSpaceInfo((prevInfo) => ({
        ...prevInfo,
        companyLogo: file,
      }));
    } else {
      // Handle the case where no file is selected (optional)
      console.log("No file selected");
    }
  };

  // Handler to upload the company logo
  const handleUploadButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (!inputRef || !inputRef.current) return;

    inputRef.current.click();
  };

  // Handler to delete the company logo
  const deleteCompanyLogo = () => {
    setSpaceInfo({ ...spaceInfo, companyLogo: null });
    // Reset the file input value (optional for some browsers)
    const companyLogoInput = inputRef.current;
    if (companyLogoInput) {
      companyLogoInput.value = "";
    }
  };

  // Handler to submit the space information
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle the customer information here (e.g., send it to a server)
    console.log(spaceInfo);
    onSubmit();
  };

  return (
    <>
      <section className="fixed left-0 right-0 top-0 z-50 max-h-full w-full overflow-y-auto bg-gray-300/50 backdrop-blur dark:bg-black/50 md:inset-0">
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              y: 20,
            },

            visible: {
              opacity: 1,
              y: 0,
            },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.3, ease: "easeIn" }}
          className="relative z-1 mx-auto mt-28 w-[calc(100vw-10%)] max-w-c-1016 px-7.5 pb-7.5 pt-10 md:w-[calc(100vw-20%)] lg:px-15 lg:pt-15 xl:px-20 xl:pt-20"
        >
          {/* close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="close the space form"
            className="absolute right-3 top-3 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="28"
              height="28"
              color="currentlColor"
              fill="none"
            >
              <path
                d="M18 6L12 12M12 12L6 18M12 12L18 18M12 12L6 6"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-blue-300 dark:bg-gradient-to-t dark:to-[#252A42]"></div>

          <div className="rounded-lg bg-white px-7.5 py-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-15">
            <h2 className="mb-15 text-center text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
              Create an Space
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-7.5 flex flex-col gap-7.5">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="spaceName"
                    className="text-black dark:text-gray-200"
                  >
                    Space Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="spaceName"
                    name="spaceName"
                    value={spaceInfo.spaceName}
                    onChange={handleChange}
                    placeholder="Enter Space Name"
                    required
                    className="rounded-lg border-2 border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-primary dark:border-strokedark dark:focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="companyLogo"
                    className="text-black dark:text-gray-200"
                  >
                    Company Logo (optional)
                  </label>
                  <div className="flex gap-4">
                    <div className="relative h-16 w-16 rounded-lg">
                      {spaceInfo.companyLogo && (
                        // btn for deleting the company logo
                        <button
                          type="button"
                          onClick={deleteCompanyLogo}
                          className="absolute -right-2 -top-2 z-10 rounded-full border border-blackho bg-white dark:bg-gray-400"
                        >
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
                      )}
                      {/* displaying the preview of the company logo */}
                      {spaceInfo.companyLogo && spaceInfo.companyLogo instanceof File ? (
                        <Image
                          src={URL.createObjectURL(spaceInfo.companyLogo)}
                          alt="company logo"
                          fill
                          className="h-full w-full rounded-lg object-contain"
                        />
                      ) : (
                        <Image
                          src="/images/icon/icon-company.svg"
                          alt="company logo"
                          fill
                          className="h-full w-full rounded-full"
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleUploadButtonClick}
                      className="self-center rounded-md border border-strokedark px-2 py-1 text-black dark:border-stroke dark:text-gray-300"
                    >
                      {spaceInfo.companyLogo ? "Change File" : "Select File"}
                    </button>
                    <input
                      type="file"
                      id="companyLogo"
                      name="companyLogo"
                      accept="image/*"
                      ref={inputRef}
                      onChange={handleFileChange}
                      hidden
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="headerTitle"
                    className="text-black dark:text-gray-200"
                  >
                    Header Title<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="headerTitle"
                    name="headerTitle"
                    value={spaceInfo.headerTitle}
                    onChange={handleChange}
                    placeholder="Enter Header Title"
                    required
                    className="rounded-lg border-2 border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-primary dark:border-strokedark dark:focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="customMessage"
                    className="text-black dark:text-gray-200"
                  >
                    Custom Message<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="customMessage"
                    name="customMessage"
                    rows={4}
                    cols={40}
                    value={spaceInfo.customMessage}
                    onChange={handleChange}
                    placeholder="Enter Custom Message like what you want to say about your company"
                    required
                    className="rounded-lg border-2 border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-primary dark:border-strokedark dark:focus:border-primary"
                  ></textarea>
                </div>
              </div>

              <div className="mb-7.5 flex flex-col gap-2">
                <h3 className="text-black dark:text-gray-200">Questions</h3>
                <div className="flex flex-col gap-3">
                  {spaceInfo.questions.map((question, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative w-full">
                        <input
                          type="text"
                          name={`questions[${index}]`}
                          value={question}
                          onChange={(e) =>
                            handleQuestionChange(index, e.target.value)
                          }
                          maxLength={100}
                          placeholder="keep it short"
                          className="w-full rounded-lg border-2 border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-primary dark:border-strokedark dark:focus:border-primary"
                        />
                        <span className="absolute right-2 top-[50%] translate-y-[-50%] text-gray-400 dark:text-gray-500">
                          {question.length}/100
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSpaceInfo({
                            ...spaceInfo,
                            questions: spaceInfo.questions.filter(
                              (_, i) => i !== index,
                            ),
                          })
                        }
                      >
                        <Image
                          src="/images/icon/icon-delete.svg"
                          alt="delete icon"
                          width={24}
                          height={24}
                        />
                      </button>
                    </div>
                  ))}
                </div>
                {spaceInfo.questions.length < 5 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSpaceInfo({
                        ...spaceInfo,
                        questions: [...spaceInfo.questions, ""],
                      })
                    }
                    className="flex items-center justify-center gap-2 self-start text-black dark:text-gray-200"
                  >
                    {/* plus icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      color="currentColor"
                      fill="none"
                    >
                      <path
                        d="M12 8V16M16 12L8 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    Add Question (upto 5)
                  </button>
                )}
              </div>
              <div className="flex justify-between gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="close the space form"
                  className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho"
                >
                  {/* left arrow svg */}
                  <svg
                    className="rotate-180 fill-white"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                      fill=""
                    />
                  </svg>
                  Close
                </button>
                <button
                  type="submit"
                  aria-label="submit your space form"
                  className="inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-primaryho dark:bg-primary dark:hover:bg-primaryho"
                >
                  Submit
                  {/* right arrow icon */}
                  <svg
                    className="fill-white"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                      fill=""
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </section>
      {/* <!-- ===== Create Space Modal End ===== --> */}
    </>
  );
};

export default Modal;
