"use client";
import menuData from "./menuData";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="sticky top-[74px] rounded-lg border p-4 shadow-solid-4 transition-all dark:border-strokedark dark:bg-blacksection">
      <ul className="space-y-2">
        {menuData.map((menuItem) => (
          <Link
            key={menuItem.id}
            href={menuItem.path || "#"}
            className={`flex w-full cursor-pointer rounded-md px-3 py-2 text-base text-black hover:bg-stroke dark:text-white dark:hover:bg-blackho ${
              pathname === menuItem.path ? "bg-stroke dark:bg-blackho dark:text-primary" : ""
            }`}
          >
            <li>{menuItem.title}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
