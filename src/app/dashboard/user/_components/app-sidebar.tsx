"use client";

import {
  IconDashboard,
  IconDeviceDesktopCode,
  IconDevicesPc,
  IconInnerShadowTop,
  IconSettings,
  IconUserPentagon,
  IconUserScreen
} from "@tabler/icons-react";
import type { Session } from "next-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { NavDocuments } from "./nav-documents";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/user",
      icon: IconDashboard,
    },
    {
      title: "Kursus Saya",
      url: "/dashboard/user/my_course",
      icon: IconDevicesPc,
    },
    {
      title: "Mentoring Saya",
      url: "/dashboard/user/my_mentoring",
      icon: IconUserScreen,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/user/settings",
      icon: IconSettings,
    },
  ],
  documents: [
    {
      name: "Cari Kursus",
      url: "/dashboard/user/course",
      icon: IconDeviceDesktopCode,
    },
    {
      name: "Cari Mentoring",
      url: "/dashboard/user/mentoring",
      icon: IconUserPentagon,
    },
  ],
};

export function AppSidebar({ session }: { session: Session | null }) {
  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">SIA Academy</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
    </Sidebar>
  );
}
