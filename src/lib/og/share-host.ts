import { createServerFn } from "@tanstack/react-start";

function isVercelSystemHost(host: string) {
  return (
    host === "vercel.app" ||
    host.endsWith(".vercel.app") ||
    host === "vercel.com" ||
    host.endsWith(".vercel.com")
  );
}

/** Same public-host guard the og:image injector uses. Empty means omit the card URL. */
export function publicAppHost(hostHeader: string | null | undefined): string {
  const host = String(hostHeader ?? "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  if (!host || !/^[a-z0-9.-]+$/.test(host) || !host.includes(".")) return "";
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return "";
  if (isVercelSystemHost(host)) return "";
  return host;
}

export const getShareHost = createServerFn({ method: "GET" }).handler(async () => {
  const { getRequest } = await import("@tanstack/react-start/server");
  let header = "";
  try {
    const request = getRequest();
    header = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  } catch {
    header = "";
  }
  return publicAppHost(process.env.VITE_PUBLIC_HOSTNAME) || publicAppHost(header);
});
