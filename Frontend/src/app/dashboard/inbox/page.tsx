import Inbox from "@/components/Dashboard/Inbox";
import React from "react";

const InboxPage = () => {
  return (
    <>
      <div className="rounded-lg border p-7 shadow-solid-3 transition-all dark:border-strokedark dark:bg-blacksection">
        <h1 className="mb-4 w-fit border-b border-strokedark pb-1 text-3xl font-bold text-black dark:border-waterloo dark:text-white lg:text-4xl">
          Inbox
        </h1>
        <h2 className="mb-4">
          Manage your space
        </h2>
        <Inbox />
      </div>
    </>
  );
};

export default InboxPage;
