import {
  Tag,
  Bookmark,
  // SquarePen,
  LayoutGrid,
  LucideIcon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "/dashboard/products",
          label: "Products",
          active: pathname.includes("/dashboard/products"),
          icon: Tag,
          submenus: []
        },
        {
          href: "/dashboard/categories",
          label: "Categories",
          active: pathname.includes("/dashboard/categories"),
          icon: Bookmark,
          submenus: []
        },
        {
          href: "/dashboard/types",
          label: "Types",
          active: pathname.includes("/dashboard/types"),
          icon: Bookmark,
          submenus: []
        },
        // {
        //   href: "",
        //   label: "Posts",
        //   active: pathname.includes("/dashboard/posts"),
        //   icon: SquarePen,
        //   submenus: [
        //     {
        //       href: "/dashboard/posts",
        //       label: "All Posts",
        //       active: pathname === "/dashboard/posts"
        //     },
        //     {
        //       href: "/dashboard/posts/new",
        //       label: "New Post",
        //       active: pathname === "/dashboard/posts/new"
        //     }
        //   ]
        // }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/dashboard/settings/admins",
          label: "Admins Setting",
          active: pathname.includes("/dashboard/settings/admins"),
          icon: Tag,
          submenus: []
        },
        {
          href: "/dashboard/settings/apis",
          label: "Apis Setting",
          active: pathname.includes("/dashboard/settings/apis"),
          icon: Tag,
          submenus: []
        },
      ]
    },
  ];
}
