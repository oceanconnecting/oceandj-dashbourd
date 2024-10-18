import {
  LayoutDashboard,
  Tag,
  WalletCards,
  Layers3,
  KeyRound,
  LucideIcon,
  ShoppingBag,
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
          icon: LayoutDashboard,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "/orders",
          label: "Orders",
          active: pathname.includes("/orders"),
          icon: ShoppingBag,
          submenus: []
        },
        {
          href: "/products",
          label: "Products",
          active: pathname.includes("/products"),
          icon: Tag,
          submenus: []
        },
        {
          href: "/categories",
          label: "Categories",
          active: pathname.includes("/categories"),
          icon: WalletCards,
          submenus: []
        },
        {
          href: "/types",
          label: "Types",
          active: pathname.includes("/types"),
          icon: Layers3,
          submenus: []
        },
        // {
        //   href: "",
        //   label: "Posts",
        //   active: pathname.includes("/posts"),
        //   icon: SquarePen,
        //   submenus: [
        //     {
        //       href: "/posts",
        //       label: "All Posts",
        //       active: pathname === "/posts"
        //     },
        //     {
        //       href: "/posts/new",
        //       label: "New Post",
        //       active: pathname === "/posts/new"
        //     }
        //   ]
        // }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/settings/apis",
          label: "Apis Setting",
          active: pathname.includes("/settings/apis"),
          icon: KeyRound,
          submenus: []
        },
      ]
    },
  ];
}
