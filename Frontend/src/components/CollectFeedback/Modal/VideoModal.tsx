import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect, use, useCallback } from "react";
import Rating from "./Rating";
import { SpaceInfo, VideoReview } from "@/types/reviewSpace";
import toast from "react-hot-toast";

const VideoModal = ({
  onClose,
  spaceInfo,
}: {
  onClose: () => void;
  spaceInfo: SpaceInfo;
}) => {
  const [videoReviewData, setVideoReviewData] = useState<VideoReview>({
    rating: 0,
    reviewerName: "",
    reviewerEmail: "",
    reviewerImage: null,
    video: null,
  });

  const reviewerImageRef = useRef<HTMLInputElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false); // Track if video has been recorded
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null); // For uploaded video
  const [cameraPermission, setCameraPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]); // Store the recorded chunks
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const [countdown, setCountdown] = useState(120); // 120 seconds (2 minutes)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null); // Store interval for countdown

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMediaStream(stream);
      setCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing webcam and microphone: ", error);
      setCameraPermission(false);
    }
  };

  const stopWebcam = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null); // Clear mediaStream state
    }
  }, [mediaStream]);

  const startRecording = () => {
    if (mediaStream) {
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        chunks.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/mp4" });
        const videoURL = URL.createObjectURL(blob);
        // convert blob to file
        const file = new File([blob], "recorded-video.mp4", {
          type: "video/mp4",
        });
        // save the file to videoReviewData
        setVideoReviewData((prevInfo) => ({
          ...prevInfo,
          video: file,
        }));
        setRecordedVideo(videoURL);
        setIsRecorded(true);
        chunks.current = []; // Clear the chunks
        stopWebcam(); // Turn off the camera after recording
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsRecorded(false); // Reset the recorded state when starting a new recording
      startCountdown(); // Start countdown when recording starts
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(countdownIntervalRef.current!); // Stop the countdown interval
    }
  };

  const startCountdown = () => {
    setCountdown(120); // Reset countdown to 120 seconds
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          stopRecording(); // Automatically stop recording when the timer reaches 0
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRecordAgain = () => {
    setRecordedVideo(null); // Clear the recorded video
    setUploadedVideo(null); // Clear the uploaded video
    setIsRecorded(false); // Reset recorded state
    startWebcam(); // Restart the webcam preview
    setCountdown(120); // Reset the countdown
  };

  // Handler to upload video
  const handleUploadVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoElement = document.createElement("video");
      videoElement.src = URL.createObjectURL(file);

      videoElement.onloadedmetadata = () => {
        // Check if the video is a valid video file
        if (videoElement.duration > 10) {
          toast.error("Video duration must be less than 2 min");
          setUploadedVideo(null); // Clear the video
          videoFileInputRef.current!.value = ""; // Reset file input
        } else {
          const videoURL = URL.createObjectURL(file);
          setUploadedVideo(videoURL);
          setRecordedVideo(null); // Clear recorded video if a file is selected
          setIsRecorded(true); // Mark as recorded
          setVideoReviewData((prevInfo) => ({
            ...prevInfo,
            video: file,
          }));
          videoFileInputRef.current!.value = ""; // Reset file input
        }
      };
    }
  };

  useEffect(() => {
    startWebcam();
    return () => {
      stopWebcam();
      clearInterval(countdownIntervalRef.current!); // Clear countdown on component unmount
    };
  }, []);

  // Handler to change te input value
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setVideoReviewData((prevInfo) => ({
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
      setVideoReviewData((prevInfo) => ({
        ...prevInfo,
        reviewerImage: file,
      }));
    } else {
      // Handle the case where no file is selected (optional)
      console.log("No file selected");
    }
  };

  //   Handler to compress the image
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  const handleClose = () => {
    stopWebcam();
    clearInterval(countdownIntervalRef.current!); // Clear countdown on modal close
    onClose();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // display toast error if video is not uploaded
    if (!videoReviewData.video) {
      toast.error("Please upload a video");
      return;
    }
    // Handle the customer information here (e.g., send it to a server)
    console.log(videoReviewData);
    handleClose();
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
          <div className="relative mt-20 h-full w-full max-w-xl p-4 md:h-auto">
            {/* <!-- Modal content --> */}
            <div className="relative rounded-lg border bg-white p-4 shadow-solid-3 dark:border-strokedark dark:bg-gray-800 sm:p-5">
              {/* <!-- Modal header --> */}
              <div className="mb-4 flex flex-col gap-4 rounded-t border-b pb-4 dark:border-gray-600 sm:mb-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Send your video to
                  </h3>
                  {/* close button */}
                  <button
                    type="button"
                    className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={handleClose}
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
              {!cameraPermission ? (
                <div className="relative my-2 rounded-lg bg-white shadow dark:bg-gray-700">
                  <div className="p-4 text-center md:p-5">
                    <svg
                      className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      Checking Your Camera and Microphone Permission
                    </h3>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400 sm:px-4">
                    You have up to 120 seconds to record your video. Don&apos;t
                    worry: You can review your video before submitting it, and
                    you can re-record if needed.
                  </p>
                  {/* question section */}
                  <section>
                    {spaceInfo.questions.length > 0 && (
                      <div className="mx-auto px-4 py-4 text-left">
                        <h3 className="mb-2 text-lg font-semibold uppercase leading-6 text-gray-700 dark:text-gray-300">
                          question
                        </h3>
                        <div className="mb-2 w-10 border-b-4 border-strokedark dark:border-stroke"></div>
                        <ul className="mt-2 flex max-w-xl list-disc flex-col gap-1 pl-4 text-base text-gray-500 dark:text-manatee">
                          {spaceInfo.questions.map((question, index) => (
                            <li key={index}>{question}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </section>
                  <form
                    onSubmit={handleSubmit}
                    className="mb-4 flex flex-col gap-5"
                  >
                    <div className="relative">
                      {!recordedVideo && !uploadedVideo && (
                        <video
                          ref={videoRef}
                          autoPlay
                          className="h-auto w-full rounded-xl"
                        />
                      )}

                      {recordedVideo && (
                        <video
                          src={recordedVideo}
                          controls
                          className="h-auto w-full rounded-xl border border-strokedark"
                        />
                      )}
                      {uploadedVideo && (
                        <video
                          src={uploadedVideo}
                          controls
                          className="h-auto w-full rounded-xl border border-strokedark"
                        />
                      )}
                      {/* Countdown timer */}
                      {isRecording && (
                        <div className="absolute right-0 top-0 m-2 rounded-md bg-red-500 bg-opacity-75 p-1 text-sm text-white">
                          {formatTime(countdown)}
                        </div>
                      )}
                    </div>
                    {!isRecorded && (
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap justify-evenly">
                          <button
                            onClick={startRecording}
                            type="button"
                            disabled={isRecording}
                            className={`flex items-center justify-center self-center rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primaryho focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-primary/50 disabled:text-waterloo dark:focus:ring-blue-800`}
                          >
                            Start Recording
                          </button>
                          <button
                            onClick={stopRecording}
                            type="button"
                            disabled={!isRecording}
                            className={`inline-flex items-center justify-center self-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:bg-red-600/50 disabled:text-waterloo dark:focus:ring-red-800`}
                          >
                            Stop Recording
                          </button>
                        </div>
                        <button
                          type="button"
                          className={`inline-flex items-center justify-center self-center`}
                          onClick={() => videoFileInputRef.current?.click()}
                        >
                          or choose a file to submit
                        </button>
                        <input
                          type="file"
                          ref={videoFileInputRef}
                          accept="video/mp4,video/x-m4v,video/*"
                          onChange={handleUploadVideo}
                          hidden
                        />
                      </div>
                    )}

                    {isRecorded && (
                      <button
                        onClick={handleRecordAgain}
                        className="flex items-center justify-center self-center rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primaryho focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-primary/50 disabled:text-waterloo dark:focus:ring-blue-800"
                      >
                        Record Again
                      </button>
                    )}
                    {/* rating section */}
                    <Rating
                      onChange={(rating) =>
                        setVideoReviewData((prevInfo) => ({
                          ...prevInfo,
                          rating,
                        }))
                      }
                    />

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
                        value={videoReviewData.reviewerName}
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
                        value={videoReviewData.reviewerEmail}
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
                        Upload Your Photo{" "}
                        <span className="text-gray-500">(Optional)</span>
                      </label>
                      <div className="flex gap-4">
                        <div className="relative z-0 h-16 w-16 rounded-full">
                          {/* displaying the preview of the reviewer image */}
                          {videoReviewData.reviewerImage &&
                          videoReviewData.reviewerImage instanceof File ? (
                            <Image
                              src={URL.createObjectURL(
                                videoReviewData.reviewerImage,
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
                          {videoReviewData.reviewerImage
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
                        onClick={handleClose}
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
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VideoModal;
