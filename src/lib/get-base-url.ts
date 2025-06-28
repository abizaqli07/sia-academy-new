export const getBaseProductionUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_ENV === "production") return `${process.env.NEXTAUTH_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`;
}