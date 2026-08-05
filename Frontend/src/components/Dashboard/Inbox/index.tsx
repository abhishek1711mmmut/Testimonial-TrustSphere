"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import DeleteSpaceModal from "./DeleteSpaceModal";
import Image from "next/image";
import { getSpaces } from "@/api/spaces";
import { Space } from "@/types/reviewSpace";
import toast from "react-hot-toast";

const Inbox = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDeleteSpace, setOpenDeleteSpace] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const fetchSpaces = async () => {
    const res = await getSpaces();
    if (res?.data) setSpaces(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const copyCollectLink = (spaceId: number, spaceName: string) => {
    const link = `${window.location.origin}/collect/${spaceId}/${spaceName}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  const handleDelete = (spaceId: number, spaceName: string) => {
    setSelectedSpace({ id: spaceId, name: spaceName });
    setOpenDeleteSpace(true);
  };

  const handleClose = () => {
    setOpenDeleteSpace(false);
    setSelectedSpace(null);
  };

  const handleDeleteSuccess = () => {
    handleClose();
    fetchSpaces();
  };

  if (isLoading) {
    return <p className="text-center text-base">Loading...</p>;
  }

  if (spaces.length === 0) {
    return <p className="text-center text-base">No spaces yet</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {spaces.map((space) => (
        <div
          key={space.id}
          className="flex flex-col gap-2 rounded-lg border bg-gray-50 px-6 py-5 shadow-sm dark:border-strokedark dark:bg-black"
        >
          <div className="mb-2 flex items-center gap-4">
            {space.companyLogo ? (
              <Image
                src={space.companyLogo}
                alt="logo"
                width={60}
                height={100}
                unoptimized
                className="rounded-md object-contain max-sm:w-10"
              />
            ) : (
              <Image
                src="/images/icon/icon-spaces.svg"
                alt="logo"
                width={40}
                height={40}
              />
            )}
            <h2 className="text-metatitle3 text-black dark:text-manatee">
              {space.spaceName}
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <Link
              href={`/dashboard/inbox/${space.spaceName}`}
              className="mb- me-2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              Open Space
            </Link>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-lg border border-green-600 px-4 py-2 text-green-600 transition hover:bg-green-600 hover:text-white md:mt-0"
                type="button"
                onClick={() => copyCollectLink(space.id, space.spaceName)}
              >
                Copy Link
              </button>
              <button
                className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-lg border border-primary px-4 py-2 text-primary transition hover:bg-primaryho hover:text-white md:mt-0"
                type="button"
              >
                Edit
              </button>
              <button
                className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-600 px-4 py-2 text-red-600 transition hover:bg-red-600 hover:text-white md:mt-0"
                type="button"
                onClick={() => handleDelete(space.id, space.spaceName)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
      {openDeleteSpace && selectedSpace && (
        <DeleteSpaceModal
          onClose={handleClose}
          spaceId={selectedSpace.id}
          spaceName={selectedSpace.name}
          onDelete={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default Inbox;
