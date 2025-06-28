"use client";

import { LayoutGrid, Menu } from "lucide-react";
import type { Session } from "next-auth";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { NavMenu } from "./nav-menu";

const Navbar = ({ session }: { session: Session | null }) => {
  return (
    <nav className="bg-background fixed inset-x-4 top-6 mx-auto h-14 max-w-screen-xl rounded-lg shadow-lg">
      <div className="mx-auto flex h-full items-center justify-between px-4">
        <Link href="/">
          <LayoutGrid size={30} />
        </Link>
        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />
        <div className="flex items-center gap-3">
          {session == null ? (
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          ) : (
            <Link href={"/redirect"}>
              <Button>Dashboard</Button>
            </Link>
          )}
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetTitle hidden>Menu</SheetTitle>
              <SheetContent className=" p-4">
                <Link href="/">
                  <LayoutGrid size={30} />
                </Link>
                <NavMenu orientation="vertical" className="mt-12" />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
