"use client";

import {
  Boxes,
  ClipboardList,
  Command,
  Package,
  Settings2,
  ShoppingCart,
  Users,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProducts } from "@/components/nav-products";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Product, User } from "@/db/schema";
import { hasPermission } from "@/lib/has-permission";

const data = {
  navMain: [
    {
      title: "Products",
      url: "/products",
      icon: Package,
      items: [
        {
          title: "All Products",
          url: "/products",
          show: (user: User) => hasPermission(user, "products", "view"),
        },
      ],
      show: (user: User) => hasPermission(user, "products", "view"),
    },
    {
      title: "Ingredients",
      url: "/ingredients",
      icon: Boxes,
      items: [
        {
          title: "All Ingredients",
          url: "/ingredients",
          show: (user: User) => hasPermission(user, "ingredients", "view"),
        },
        {
          title: "Suppliers",
          url: "/suppliers",
          show: (user: User) => hasPermission(user, "suppliers", "view"),
        },
      ],
      show: (user: User) => hasPermission(user, "products", "view"),
    },
    {
      title: "Projects",
      url: "/projects",
      icon: ClipboardList,
      items: [
        {
          title: "All Projects",
          url: "/projects",
          show: (user: User) => hasPermission(user, "projects", "view"),
        },
      ],
      show: (user: User) => hasPermission(user, "products", "view"),
    },
    {
      title: "Orders",
      url: "/orders",
      icon: ShoppingCart,
      items: [
        {
          title: "All Orders",
          url: "/orders",
          show: (user: User) => hasPermission(user, "orders", "view"),
        },
      ],
      show: (user: User) => hasPermission(user, "orders", "view"),
    },
  ],
  navSecondary: [
    {
      title: "Users",
      url: "/users",
      icon: Users,
      show: (user: User) => hasPermission(user, "users", "manage"),
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      show: (user: User) => hasPermission(user, "admin-dashboard", "view"),
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  products: Product[];
}

export function AppSidebar({ products, ...props }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <svg
                    width="227"
                    height="226"
                    viewBox="0 0 227 226"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <mask
                      id="mask0_1_96"
                      style={{ maskType: "luminance" }}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="227"
                      height="226"
                    >
                      <path
                        d="M169.56 0H56.52C25.3049 0 0 25.2959 0 56.5V169.5C0 200.704 25.3049 226 56.52 226H169.56C200.775 226 226.08 200.704 226.08 169.5V56.5C226.08 25.2959 200.775 0 169.56 0Z"
                        fill="white"
                      />
                    </mask>
                    <g mask="url(#mask0_1_96)">
                      <path
                        d="M169.56 0H56.52C25.3049 0 0 25.2959 0 56.5V169.5C0 200.704 25.3049 226 56.52 226H169.56C200.775 226 226.08 200.704 226.08 169.5V56.5C226.08 25.2959 200.775 0 169.56 0Z"
                        fill="#155EEF"
                      />
                      <path
                        d="M0 0H226.08V226H0V0Z"
                        fill="url(#paint0_linear_1_96)"
                      />
                      <path
                        d="M42.39 42.375H77.715V77.6875H42.39V42.375Z"
                        fill="white"
                      />
                      <path
                        opacity="0.6"
                        d="M113.04 42.375H148.365V77.6875H113.04V42.375Z"
                        fill="white"
                      />
                      <path
                        opacity="0.6"
                        d="M77.715 77.6875H113.04V113H77.715V77.6875Z"
                        fill="white"
                      />
                      <path
                        opacity="0.45"
                        d="M113.04 77.6875H148.365V113H113.04V77.6875Z"
                        fill="white"
                      />
                      <path
                        opacity="0.3"
                        d="M148.365 77.6875H183.69V113H148.365V77.6875Z"
                        fill="white"
                      />
                      <path
                        opacity="0.6"
                        d="M42.39 113H77.715V148.313H42.39V113Z"
                        fill="white"
                      />
                      <path
                        opacity="0.45"
                        d="M77.715 113H113.04V148.313H77.715V113Z"
                        fill="white"
                      />
                      <path
                        opacity="0.3"
                        d="M113.04 113H148.365V148.313H113.04V113Z"
                        fill="white"
                      />
                      <path
                        opacity="0.15"
                        d="M148.365 113H183.69V148.313H148.365V113Z"
                        fill="white"
                      />
                      <path
                        opacity="0.3"
                        d="M77.715 148.312H113.04V183.625H77.715V148.312Z"
                        fill="white"
                      />
                      <path
                        opacity="0.15"
                        d="M113.04 148.312H148.365V183.625H113.04V148.312Z"
                        fill="white"
                      />
                    </g>
                    <path
                      d="M169.56 4.70833H56.52C27.9061 4.70833 4.71001 27.8962 4.71001 56.5V169.5C4.71001 198.104 27.9061 221.292 56.52 221.292H169.56C198.174 221.292 221.37 198.104 221.37 169.5V56.5C221.37 27.8962 198.174 4.70833 169.56 4.70833Z"
                      stroke="url(#paint1_linear_1_96)"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_1_96"
                        x1="113.04"
                        y1="4.63054e-06"
                        x2="122.453"
                        y2="226"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="white" stopOpacity="0" />
                        <stop offset="1" stopColor="white" stopOpacity="0.12" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_1_96"
                        x1="113.04"
                        y1="-5.21362e-06"
                        x2="113.04"
                        y2="226"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="white" stopOpacity="0.12" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Scentra</span>
                  <span className="truncate text-xs">
                    Product Lifecycle Management
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProducts
          products={products.map((p) => ({
            ...p,
            url: `/products/${p.id}`,
            icon: Package,
          }))}
        />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
