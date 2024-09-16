import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Features",
    newTab: false,
    path: "/#features",
  },
  {
    id: 2.3,
    title: "How It Works",
    newTab: false,
    path: "/how-it-works",
  },
  {
    id: 3,
    title: "Explore",
    newTab: false,
    submenu: [
      {
        id: 31,
        title: "Testimonials",
        newTab: false,
        path: "/blog",
      },
      {
        id: 32,
        title: "About Us",
        newTab: false,
        path: "/error",
      },
      {
        id: 34,
        title: "Sign In",
        newTab: false,
        path: "/auth/signin",
      },
      {
        id: 35,
        title: "Sign Up",
        newTab: false,
        path: "/auth/signup",
      },
    ],
  },
  {
    id: 2.1,
    title: "Blog",
    newTab: false,
    path: "/blog",
  },
  {
    id: 4,
    title: "Support",
    newTab: false,
    path: "/support",
  },
];

export default menuData;
