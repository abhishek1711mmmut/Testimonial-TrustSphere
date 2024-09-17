import Sidebar from "@/components/Dashboard/Sidebar";
import React from "react";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <main className="mx-auto max-w-c-1315 px-4 md:px-8 2xl:px-0">
        <div className="flex flex-wrap py-20 lg:py-25">
          <div className="w-full px-2 lg:w-1/4">
            <Sidebar />
          </div>
          <div className="w-full flex-1 px-2 lg:w-3/4">{children}</div>
        </div>
      </main>
    </>
  );
};

export default layout;
