import { type LucideIcon } from "lucide-react"
import * as React from "react"

import { useUser } from "@/app/auth-provider"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { User } from "@/db/schema"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    show?: (user: User) => boolean
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { user } = useUser()

  if (!user) return null

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            if (item.show && !item.show(user)) return null

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild size="sm">
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
