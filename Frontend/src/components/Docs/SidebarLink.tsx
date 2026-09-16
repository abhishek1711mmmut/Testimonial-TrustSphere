"use client";

import { useEffect, useRef, useState } from "react";

const sections = [
  { id: "create", label: "Create a Space" },
  { id: "collect", label: "Collect Testimonials" },
  { id: "manage", label: "Manage Your Inbox" },
  { id: "display", label: "Display on Your Website" },
];

const SidebarLink = () => {
  const [activeSection, setActiveSection] = useState("create");
  const navigating = useRef(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>();

  const selectSection = (id: string) => {
    setActiveSection(id);
    // Preserve the selection while scrolling past intermediate sections.
    navigating.current = true;
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      navigating.current = false;
    }, 1000);
  };

  useEffect(() => {
    let frame = 0;
    const syncScroll = () => {
      const current = sections.filter(({ id }) => {
        const heading = document.getElementById(id);
        return heading && heading.getBoundingClientRect().top <= 160;
      }).pop();
      setActiveSection(current?.id ?? "create");
    };
    const syncHash = () => {
      const id = window.location.hash.slice(1);
      if (sections.some((section) => section.id === id)) {
        selectSection(id);
      } else {
        syncScroll();
      }
    };
    const onScroll = () => {
      if (navigating.current) {
        clearTimeout(settleTimer.current);
        settleTimer.current = setTimeout(() => {
          navigating.current = false;
        }, 150);
        return;
      }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncScroll);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(settleTimer.current);
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {sections.map(({ id, label }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            onClick={() => selectSection(id)}
            aria-current={activeSection === id ? "location" : undefined}
            className={`flex w-full rounded-md border-l-2 px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
              activeSection === id
                ? "border-primary bg-primary/10 text-primary dark:bg-primary/15 dark:text-blue-300"
                : "border-transparent text-waterloo hover:bg-stroke hover:text-black dark:text-gray-300 dark:hover:bg-blackho dark:hover:text-white"
            }`}
          >
            {label}
          </a>
        </li>
      ))}
    </>
  );
};

export default SidebarLink;
