"use client";
import Sidebar from "@/components/Dashboard/Sidebar";
import React from "react";
import { motion } from "framer-motion";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <main className="mx-auto max-w-c-1315 px-4 md:px-8 2xl:px-0">
        <div className="flex flex-wrap py-20 lg:py-25">
          <motion.div
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
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="animate_left w-full px-2 lg:w-1/4"
          >
            <Sidebar />
          </motion.div>
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                x: 20,
              },

              visible: {
                opacity: 1,
                x: 0,
              },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="animate_right w-full flex-1 px-2 lg:w-3/4"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default layout;
