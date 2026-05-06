const ALLOWED_REFERERS = [
  "/api/",
  "localhost",
  "http://192.168.1.2:3000/",
  "https://zxcprime.site/",
  "https://www.zxcprime.site/",
  "https://zxcstream.xyz/",
  "https://www.zxcstream.xyz/",
  "https://meow-production-9394.up.railway.app/",
];

export const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://zxcprime.site",
  "https://www.zxcprime.site",
  "https://zxcstream.xyz",
  "https://www.zxcstream.xyz",
  "http://192.168.1.2:3000",
  "https://meow-production-9394.up.railway.app",
];
export function isValidReferer(referer: string): boolean {
  return ALLOWED_REFERERS.some((allowed) => referer.includes(allowed));
}
