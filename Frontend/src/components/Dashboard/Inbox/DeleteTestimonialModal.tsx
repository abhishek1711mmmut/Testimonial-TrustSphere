const DeleteTestimonialModal = ({
  onClose,
  name,
}: {
  onClose: () => void;
  name: string;
}) => {
  const handleDeleteTestimonial = () => {
    // Handle the delete testimonial functionality here
    console.log("Delete testimonial clicked");
    onClose();
  };
  console.log(name);
  return (
    <div
      id="deleteModal"
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden backdrop-blur-sm dark:bg-black/10 md:h-full"
    >
      {/* <!-- Modal content --> */}
      <div className="relative rounded-lg border border-stroke bg-white p-4 text-center shadow dark:border-strokedark dark:bg-gray-800 sm:p-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2.5 top-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-toggle="deleteModal"
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
        <svg
          className="mx-auto mb-2 h-10 w-10 rounded-md bg-gray-200 p-1 dark:bg-gray-600"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          ></path>
        </svg>
        <p className="mb-4 text-gray-500 dark:text-gray-300">
          Are you sure you want to delete this testimonial?
        </p>
        <div className="flex items-center justify-center space-x-4">
          <button
            data-modal-toggle="deleteModal"
            type="button"
            onClick={onClose}
            className="focus:ring-primary-300 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
          >
            No, cancel
          </button>
          <button
            type="submit"
            onClick={handleDeleteTestimonial}
            className="rounded-lg bg-red-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
          >
            Yes, I&apos;m sure
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTestimonialModal;
