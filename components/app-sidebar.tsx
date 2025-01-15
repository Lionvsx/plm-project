"use client";

import {
  Boxes,
  ClipboardList,
  Command,
  Package,
  Settings2,
  ShoppingCart,
  Users
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
          show: (user: User) => hasPermission(user, 'products', 'view')
        },
      ],
      show: (user: User) => hasPermission(user, 'products', 'view')
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
          show: (user: User) => hasPermission(user, 'suppliers', 'view')
        },
      ],
      show: (user: User) => hasPermission(user, 'products', 'view')
    },
    {
      title: "Projects",
      url: "/projects",
      icon: ClipboardList,
      items: [
        {
          title: "All Projects",
          url: "/projects",
          show: (user: User) => hasPermission(user, 'projects', 'view')
        },
      ],
      show: (user: User) => hasPermission(user, 'products', 'view')

    },
    {
      title: "Orders",
      url: "/orders",
      icon: ShoppingCart,
      items: [
        {
          title: "All Orders",
          url: "/orders",
          show: (user: User) => hasPermission(user, 'orders', 'view')
        },
      ],
      show: (user: User) => hasPermission(user, 'orders', 'view')
    },
  ],
  navSecondary: [
    {
      title: "Users",
      url: "/users",
      icon: Users,
      show: (user: User) => hasPermission(user, 'users', 'manage')
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      show: (user: User) => hasPermission(user, 'admin-dashboard', 'view')
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
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">PLM Project</span>
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
