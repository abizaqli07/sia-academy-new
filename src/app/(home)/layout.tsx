import { type ReactNode } from "react";
import { auth } from "~/server/auth";
import Footer from "./_components/footer";
import Navbar from "./_components/navbar";

const HomeLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <div className="h-full w-full">
      <Navbar session={session} />

      <main className="mx-auto max-w-screen-xl px-4">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default HomeLayout;
