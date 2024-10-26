"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import ThemeToggler from "./ThemeToggler";
import { menuData, profileMenuData } from "./menuData";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useAppContext } from "@/context/AppContext";
import { logout } from "@/api/auth";

const Header = () => {
  const { isAuth, setIsAuth, userId, setUserId } = useAppContext();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false); // Profile dropdown

  const profileDropdownRef = useRef<HTMLDivElement | null>(null);
  const pathUrl = usePathname();
  // List of pages where the navbar should be hidden
  const hideNavbarRoutes = "/collect";

  // Toggle profile dropdown menu
  const toggleProfileDropdown = () => {
    setProfileDropdown(!profileDropdown);
  };

  // Close profile dropdown menu when clicking outside
  useOnClickOutside(profileDropdownRef, null, () => setProfileDropdown(false));

  const handleLogout = async () => {
    await logout();
    setIsAuth(false);
    setUserId(null);
    localStorage.removeItem("userId");
  };

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      setIsAuth(true);
      setUserId(localStorage.getItem("userId"));
    } else {
      setIsAuth(false);
      setUserId(null);
      localStorage.removeItem("userId");
    }
  }, []);

  return (
    <>
      {!pathUrl.startsWith(hideNavbarRoutes) && (
        <header
          className={`fixed left-0 top-0 z-999 w-full bg-white py-6 backdrop-blur-lg dark:bg-black/90`}
        >
          <div className="relative mx-auto max-w-c-1390 items-center justify-between px-4 md:px-8 lg:flex 2xl:px-0">
            <div className="flex w-full items-center justify-between lg:w-1/4">
              <a href="/">
                <Image
                  src="/images/logo/logo-dark.svg"
                  alt="logo"
                  width={119.03}
                  height={30}
                  className="hidden w-full dark:block"
                />
                <Image
                  src="/images/logo/logo-light.svg"
                  alt="logo"
                  width={119.03}
                  height={30}
                  className="w-full dark:hidden"
                />
              </a>

              {/* <!-- Hamburger Toggle BTN --> */}
              <button
                aria-label="hamburger Toggler"
                className="block lg:hidden"
                onClick={() => setNavigationOpen(!navigationOpen)}
              >
                <span className="relative block h-5.5 w-5.5 cursor-pointer">
                  <span className="absolute right-0 block h-full w-full">
                    <span
                      className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                        !navigationOpen ? "!w-full delay-300" : "w-0"
                      }`}
                    ></span>
                    <span
                      className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                        !navigationOpen ? "delay-400 !w-full" : "w-0"
                      }`}
                    ></span>
                    <span
                      className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                        !navigationOpen ? "!w-full delay-500" : "w-0"
                      }`}
                    ></span>
                  </span>
                  <span className="du-block absolute right-0 h-full w-full rotate-45">
                    <span
                      className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                        !navigationOpen ? "!h-0 delay-[0]" : "h-full"
                      }`}
                    ></span>
                    <span
                      className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                        !navigationOpen ? "!h-0 delay-200" : "h-0.5"
                      }`}
                    ></span>
                  </span>
                </span>
              </button>
              {/* <!-- Hamburger Toggle BTN --> */}
            </div>

            {/* Nav Menu Start   */}
            <div
              className={`invisible h-0 w-full items-center justify-between lg:visible lg:flex lg:h-auto lg:w-full ${
                navigationOpen &&
                "navbar !visible mt-4 h-auto max-h-[400px] rounded-md bg-white p-7.5 shadow-solid-5 dark:bg-blacksection lg:h-auto lg:p-0 lg:shadow-none lg:dark:bg-transparent"
              }`}
            >
              <nav>
                <ul className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-6 xl:gap-10">
                  {menuData.map((menuItem, key) => (
                    <li
                      key={key}
                      className={menuItem.submenu && "group relative"}
                    >
                      {menuItem.submenu ? (
                        <>
                          <button
                            onClick={() => setDropdownToggler(!dropdownToggler)}
                            className="flex cursor-pointer items-center justify-between gap-3 hover:text-primary"
                          >
                            {menuItem.title}
                            <span>
                              <svg
                                className="h-3 w-3 cursor-pointer fill-waterloo group-hover:fill-primary"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                              </svg>
                            </span>
                          </button>

                          <ul
                            className={`dropdown ${dropdownToggler ? "flex" : ""}`}
                          >
                            {menuItem.submenu.map((item, key) => (
                              <li key={key} className="hover:text-primary">
                                <Link href={item.path || "#"}>
                                  {item.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <Link
                          href={`${menuItem.path}`}
                          className={
                            pathUrl === menuItem.path
                              ? "text-primary hover:text-primary"
                              : "hover:text-primary"
                          }
                        >
                          {menuItem.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-7 flex items-center gap-6 lg:mt-0">
                <ThemeToggler />

                {isAuth ? (
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={toggleProfileDropdown}
                      className="group flex cursor-pointer items-center justify-between gap-3 hover:text-primary"
                    >
                      <Image
                        src={`https://ui-avatars.com/api/?name=${userId}&background=random&length=1&size=100`}
                        alt="user"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      Hi, {userId}
                      <span className="text-meta">
                        <svg
                          className="h-3 w-3 cursor-pointer fill-waterloo group-hover:fill-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8 -12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                        </svg>
                      </span>
                    </button>

                    {profileDropdown && (
                      <ul className="absolute right-0 mt-2 w-48 rounded-lg border border-stroke bg-white p-2 shadow-solid-13 dark:border-strokedark dark:bg-blacksection dark:shadow-none">
                        {profileMenuData.map((menuItem) => (
                          <li
                            key={menuItem.id}
                            className="px-4 py-1 hover:text-primary"
                          >
                            <Link
                              href={menuItem.path || "#"}
                              onClick={toggleProfileDropdown}
                            >
                              {menuItem.title}
                            </Link>
                          </li>
                        ))}
                        <li className="px-4 py-1 hover:text-primary">
                          <Link
                            href="/"
                            onClick={() => {
                              handleLogout();
                              toggleProfileDropdown();
                            }}
                          >
                            Sign Out
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="text-regular font-medium text-waterloo hover:text-primary"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/auth/signup"
                      className="flex items-center justify-center rounded-full bg-primary px-7.5 py-2.5 text-regular text-white duration-300 ease-in-out hover:bg-primaryho"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
