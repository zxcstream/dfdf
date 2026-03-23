const ALLOWED_REFERERS = [
  "/api/",
  "localhost",
  "http://192.168.1.2:3000/",
  "https://www.zxcprime.site/",
  "https://zxcprime.site/",
];

export const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://zxcprime.site",
  "http://192.168.1.2:3000",
];
export function isValidReferer(referer: string): boolean {
  return ALLOWED_REFERERS.some((allowed) => referer.includes(allowed));
}
