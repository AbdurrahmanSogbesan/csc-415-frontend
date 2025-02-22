import React, { ReactNode } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "./ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { useLocation } from "react-router";
import { ThemeToggle } from "./ThemeToggle";
import Cookies from "js-cookie";
import { Button } from "./ui/button";
import { useAuthStore } from "@/lib/stores/auth";
import { LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const pathSegments =
    location.pathname === "/"
      ? ["dashboard"]
      : location.pathname.split("/").filter(Boolean);
  const defaultOpen = Cookies.get("sidebar_state") === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                {pathSegments.map((segment, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {index === pathSegments.length - 1 ? (
                        <BreadcrumbPage className="capitalize">
                          {segment.replace(/-/g, " ")}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={`/${pathSegments.slice(0, index + 1).join("/")}`}
                          className="capitalize"
                        >
                          {segment.replace(/-/g, " ")}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LogoutButton />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function LogoutButton() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Log Out</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
