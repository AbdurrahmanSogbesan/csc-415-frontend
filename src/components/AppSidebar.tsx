import * as React from "react";
import { Bot, LayoutDashboard, Settings } from "lucide-react";

import { NavMain } from "@/components/NavMain";
import { NavUser } from "@/components/NavUser";
import { TeamSwitcher } from "@/components/TeamSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useMemo } from "react";
import { useAuthStore } from "@/lib/stores/auth";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((s) => s.user);

  const data = useMemo(() => {
    return {
      navMain: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
        ...(user?.role === "student"
          ? [
              {
                title: "Rate Lecturers",
                url: "/rate-lecturers",
                icon: Bot,
              },
            ]
          : []),
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        },
      ],
    };
  }, [user?.role]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
