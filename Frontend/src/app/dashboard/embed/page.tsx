"use client";

import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSpaces } from "@/api/spaces";
import { getTestimonialsBySpace } from "@/api/testimonials";
import { Space } from "@/types/reviewSpace";
import toast from "react-hot-toast";

declare global {
  interface Window {
    iFrameResize: (options: Record<string, unknown>, selector: string) => void;
  }
}

type Testimonial = {
  id: number;
  rating: number;
  reviewer_name: string;
  reviewer_email: string;
  reviewer_image: string | null;
  review: string | null;
  attached_images: string[];
  video: string | null;
  created_at: string;
  space_id: number;
  type: "text" | "video";
};

const FLASK_URL =
  process.env.NEXT_PUBLIC_FLASK_API_URL || "http://localhost:5000";

const EmbedPage = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [layout, setLayout] = useState<"carousel" | "grid">("carousel");
  const [embedType, setEmbedType] = useState<"wall" | "single">("wall");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useOnClickOutside(dropdownRef, buttonRef, () => setDropdownOpen(false));

  useEffect(() => {
    const fetchSpaces = async () => {
      const res = await getSpaces();
      if (res?.data) setSpaces(res.data);
      setIsLoading(false);
    };
    fetchSpaces();
  }, []);

  const handleSelectSpace = async (space: Space) => {
    setSelectedSpace(space);
    setDropdownOpen(false);
    setSelectedTestimonial(null);
    setTestimonialsLoading(true);
    const res = await getTestimonialsBySpace(space.id);
    if (res?.data) setTestimonials(res.data);
    else setTestimonials([]);
    setTestimonialsLoading(false);
  };

  const getEmbedUrl = () => {
    if (!selectedSpace) return "";
    if (embedType === "single" && selectedTestimonial) {
      return `${FLASK_URL}/embed/${selectedSpace.id}/testimonial/${selectedTestimonial.id}?theme=${theme}`;
    }
    return `${FLASK_URL}/embed/${selectedSpace.id}?theme=${theme}&layout=${layout}`;
  };

  const getEmbedCode = () => {
    if (!selectedSpace) return "";
    if (embedType === "single" && !selectedTestimonial) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const embedUrl = getEmbedUrl();
    const uniqueId =
      embedType === "single" && selectedTestimonial
        ? `trustsphere-t-${selectedTestimonial.id}`
        : `trustsphere-${selectedSpace.id}`;
    return `<script src="${origin}/js/iframeResizer.min.js"></script>\n<iframe id="${uniqueId}" src="${embedUrl}" frameborder="0" scrolling="no" style="width:100%;border:none;"></iframe>\n<script>iFrameResize({ log: false, checkOrigin: false }, '#${uniqueId}')</script>`;
  };

  const initIframeResizer = useCallback(() => {
    if (typeof window === "undefined") return;
    const script = document.querySelector(
      'script[src="/js/iframeResizer.min.js"]',
    );
    const init = () => {
      if (window.iFrameResize && iframeRef.current) {
        window.iFrameResize(
          { log: false, checkOrigin: false },
          "#embed-preview",
        );
      }
    };
    if (script) {
      init();
    } else {
      const s = document.createElement("script");
      s.src = "/js/iframeResizer.min.js";
      s.onload = init;
      document.head.appendChild(s);
    }
  }, []);

  const copyEmbedCode = () => {
    const code = getEmbedCode();
    if (!code) {
      toast.error("Please select a testimonial first");
      return;
    }
    navigator.clipboard.writeText(code);
    toast.success("Embed code copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Space selector */}
      <div className="rounded-lg border p-7 shadow-solid-3 transition-all dark:border-strokedark dark:bg-blacksection">
        <h1 className="mb-4 w-fit border-b border-strokedark pb-1 text-3xl font-bold text-black dark:border-waterloo dark:text-white lg:text-4xl">
          Embed & Scripts
        </h1>
        <h2 className="mb-6 text-gray-600 dark:text-gray-400">
          Generate scripts and embed code for your website
        </h2>

        <div className="relative flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Select a space
          </label>
          <button
            className="flex w-fit items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
            ref={buttonRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedSpace ? selectedSpace.spaceName : "Select your space"}
            <svg
              className="h-2.5 w-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div
              className="absolute top-20 z-10 w-fit rounded-lg border bg-white px-2 shadow-lg dark:border-gray-600 dark:bg-gray-700"
              ref={dropdownRef}
            >
              {isLoading ? (
                <p className="px-4 py-3 text-sm text-gray-500">Loading...</p>
              ) : spaces.length === 0 ? (
                <p className="px-4 py-3 text-sm text-gray-500">
                  No spaces found
                </p>
              ) : (
                <ul className="flex flex-col divide-y divide-gray-200 text-sm text-gray-700 dark:divide-gray-600 dark:text-gray-200">
                  {spaces.map((space) => (
                    <li key={space.id} className="py-1">
                      <button
                        type="button"
                        onClick={() => handleSelectSpace(space)}
                        className="block w-full rounded-md px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        {space.spaceName}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedSpace && (
        <>
          {/* Embed type selector */}
          <div className="rounded-lg border p-7 shadow-solid-3 transition-all dark:border-strokedark dark:bg-blacksection">
            <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
              Embed Type
            </h3>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setEmbedType("wall")}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 px-6 py-4 text-sm font-medium transition-all ${
                  embedType === "wall"
                    ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500"
                }`}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                Wall of Love
              </button>
              <button
                type="button"
                onClick={() => setEmbedType("single")}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 px-6 py-4 text-sm font-medium transition-all ${
                  embedType === "single"
                    ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500"
                }`}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                Single Testimonial
              </button>
            </div>
          </div>

          {/* Single testimonial picker */}
          {embedType === "single" && (
            <div className="rounded-lg border p-7 shadow-solid-3 transition-all dark:border-strokedark dark:bg-blacksection">
              <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Select a Testimonial
              </h3>
              {testimonialsLoading ? (
                <p className="text-sm text-gray-500">Loading testimonials...</p>
              ) : testimonials.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No testimonials found for this space
                </p>
              ) : (
                <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
                  {testimonials.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTestimonial(t)}
                      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
                        selectedTestimonial?.id === t.id
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500"
                      }`}
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                        {t.reviewer_name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {t.reviewer_name}
                        </p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                          {t.review || "(video testimonial)"}
                        </p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <svg
                            key={i}
                            className="h-3 w-3 text-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Options */}
          <div className="rounded-lg border p-7 shadow-solid-3 transition-all dark:border-strokedark dark:bg-blacksection">
            <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
              Customize
            </h3>
            <div className="flex flex-wrap gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Theme
                </label>
                <div className="flex overflow-hidden rounded-lg border dark:border-gray-600">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`px-4 py-2 text-sm font-medium ${
                      theme === "light"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`px-4 py-2 text-sm font-medium ${
                      theme === "dark"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
              {embedType === "wall" && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Layout
                  </label>
                  <div className="flex overflow-hidden rounded-lg border dark:border-gray-600">
                    <button
                      type="button"
                      onClick={() => setLayout("carousel")}
                      className={`px-4 py-2 text-sm font-medium ${
                        layout === "carousel"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      Carousel
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayout("grid")}
                      className={`px-4 py-2 text-sm font-medium ${
                        layout === "grid"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      Grid
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Embed code */}
          {(embedType === "wall" ||
            (embedType === "single" && selectedTestimonial)) && (
            <div className="rounded-lg border p-7 shadow-solid-3 transition-all dark:border-strokedark dark:bg-blacksection">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Embed Code
                </h3>
                <button
                  type="button"
                  onClick={copyEmbedCode}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy Code
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-green-400">
                <code>{getEmbedCode()}</code>
              </pre>
            </div>
          )}

          {/* Live preview */}
          {(embedType === "wall" ||
            (embedType === "single" && selectedTestimonial)) && (
            <div className="rounded-lg border p-7 shadow-solid-3 transition-all dark:border-strokedark dark:bg-blacksection">
              <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Live Preview
              </h3>
              <div className="overflow-hidden rounded-lg border dark:border-gray-600">
                <iframe
                  id="embed-preview"
                  key={getEmbedUrl()}
                  ref={iframeRef}
                  src={getEmbedUrl()}
                  className="w-full border-none"
                  style={{ minHeight: "200px" }}
                  onLoad={initIframeResizer}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmbedPage;
