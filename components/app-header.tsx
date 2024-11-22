import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumb } from "@/components/app-breadcrumb";

interface AppHeaderProps {
  items: {
    label: string;
    href: string;
  }[];
  children?: React.ReactNode;
}

export function AppHeader({ items, children }: AppHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 justify-between px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <AppBreadcrumb
          items={items}
        />
      </div>
      {children}
    </header>
  )
}
