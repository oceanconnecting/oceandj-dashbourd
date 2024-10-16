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
          href: "/dashboard/orders",
          label: "Orders",
          active: pathname.includes("/dashboard/orders"),
          icon: ShoppingBag,
          submenus: []
        },
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
          icon: WalletCards,
          submenus: []
        },
        {
          href: "/dashboard/types",
          label: "Types",
          active: pathname.includes("/dashboard/types"),
          icon: Layers3,
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
          href: "/dashboard/settings/apis",
          label: "Apis Setting",
          active: pathname.includes("/dashboard/settings/apis"),
          icon: KeyRound,
          submenus: []
        },
      ]
    },
  ];
}
