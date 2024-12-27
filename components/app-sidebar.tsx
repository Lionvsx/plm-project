"use client";

import {
  BookOpen,
  Command,
  Frame,
  Package,
  PieChart,
  Settings2,
  Boxes,
  Users,
  ClipboardList,
  ShoppingCart,
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
import { Product } from "@/db/schema";

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
        },
      ],
    },
    {
      title: "Ingredients",
      url: "/ingredients",
      icon: Boxes,
      items: [
        {
          title: "All Ingredients",
          url: "/ingredients",
        },
        {
          title: "Suppliers",
          url: "/suppliers",
        },
      ],
    },
    {
      title: "Projects",
      url: "/projects",
      icon: ClipboardList,
      items: [
        {
          title: "All Projects",
          url: "/projects",
        },
        {
          title: "Tasks",
          url: "/projects/tasks",
        },
      ],
    },
    {
      title: "Orders",
      url: "/orders",
      icon: ShoppingCart,
      items: [
        {
          title: "All Orders",
          url: "/orders",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
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
