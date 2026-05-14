// lib/token.ts  ← single source of truth, change here to rotate
import crypto from "crypto";
// 🔁 Rotate these constants every few weeks
const SALT = "v3"; // bump to v4, v5, etc.
const FIELD_MAP = {
  id: "mid", // was: zxczxc
  fToken: "xt", // was: f_token
  ts: "rt", // was: ts / gago
  token: "sig", // was: putangnamo / token
  title: "q", // was: f
  year: "p", // was: g
  season: "sx", // was: c
  episode: "ex", // was: d
  imdbId: "ref", // was: e
} as const;

export { FIELD_MAP };

export function generateFrontendToken(id: string) {
  const rt = Date.now();
  // 🔁 Rotate: swap order, add SALT, change hash algo to sha512 truncated
  const xt = crypto
    .createHash("sha512")
    .update(`${SALT}:${rt}:${id}`) // was: `${id}:${ts}`
    .digest("hex")
    .slice(0, 64); // truncate to 64 chars

  return { xt, rt }; // was: { f_token, f_ts }
}
