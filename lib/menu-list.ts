import {
  LayoutDashboard,
  Tag,
  WalletCards,
  Layers3,
  LucideIcon,
  ShoppingBag,
  Building2,
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
          href: "/brands",
          label: "Brands",
          active: pathname.includes("/brands"),
          icon: Building2,
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
      ]
    },
  ];
}
