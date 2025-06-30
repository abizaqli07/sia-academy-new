"use client";

import type { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "~/lib/utils";


interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
};

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href

  const onClick = () => {
    router.push(href);
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 px-4 rounded-md text-slate-500 text-base font-[500] transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive && "text-primary bg-primary/10 hover:bg-primary/10 hover:text-primary"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-500 shrink-0",
            isActive && "text-primary"
          )}
        />
        {label}
      </div>
    </button>
  )
}