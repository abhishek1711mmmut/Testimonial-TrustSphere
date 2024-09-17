import React from "react";

const DashboardPage = () => {
  return (
    <>
      <div className="rounded-lg border p-7 shadow-solid-3 transition-all dark:border-strokedark dark:bg-blacksection xl:p-12.5">
        <h1>Welcome to Dashboard</h1>

        <p className="text-body-color dark:text-body-color-dark text-base">
          This document serves as a simple template to showcase a sample layout
          and format. It is solely created for demonstration purposes and is not
          intended for any official use.
        </p>
        <p className="text-body-color dark:text-body-color-dark text-base">
          Please visit:{" "}
          <b>
            <a href="https://nextjstemplates.com/docs">
              nextjstemplates.com/docs
            </a>
          </b>{" "}
          to check out the real docs, setup guide and even video instructions
        </p>
      </div>
    </>
  );
};

export default DashboardPage;
