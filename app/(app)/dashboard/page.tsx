import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <AppBreadcrumb
            items={[
              {
                label: "Dashboard",
                href: "/dashboard",
              }
            ]}
          />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">

      </div>
      <h1>Dashboard</h1>
    </div>
  )
}
