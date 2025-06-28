import { redirect } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "~/lib/routes";
import { auth } from "~/server/auth";

const RedirectPage = async () => {
  const session = await auth();

  if (session?.user.role === "USER") {
    redirect(DEFAULT_LOGIN_REDIRECT.USER);
  }
  if (session?.user.role === "MENTOR") {
    redirect(DEFAULT_LOGIN_REDIRECT.MENTOR);
  }
  if (session?.user.role === "ADMIN") {
    redirect(DEFAULT_LOGIN_REDIRECT.ADMIN);
  }

  return;
};

export default RedirectPage;
