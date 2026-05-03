// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";
// import { ALLOWED_ORIGINS, isValidReferer } from "@/lib/allowed-referers";

// const SECRET = process.env.API_SECRET!;

// function validateFrontendToken(f_token: string, id: string, ts: number) {
//   const expected = crypto
//     .createHash("sha256")
//     .update(`${id}:${ts}`)
//     .digest("hex");
//   return expected === f_token && Date.now() - ts < 5000;
// }

// function generateBackendToken(f_token: string, id: string) {
//   const ts = Date.now();
//   const token = crypto
//     .createHmac("sha256", SECRET)
//     .update(`${id}:${f_token}:${ts}`)
//     .digest("hex");
//   return { token, ts };
// }
// const blockedIPs = ["45.86.86.43"];

// export async function POST(req: NextRequest) {
//   const { id, f_token, ts } = await req.json();
//   const forwardedFor = req.headers.get("x-forwarded-for");
//   const ip = forwardedFor?.split(",")[0] || "Unknown";
//   const connectingIp = req.headers.get("cf-connecting-ip");
//   const ua = req.headers.get("user-agent") || "unknown";
//   const origin = req.headers.get("origin") || "";
//   const referer = req.headers.get("referer") || "";

//   console.log({ connectingIp: connectingIp, ip: ip });
//   if (!ALLOWED_ORIGINS.includes(origin)) {
//     return NextResponse.json(
//       { success: false, error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }

//   if (!isValidReferer(referer)) {
//     return NextResponse.json(
//       { success: false, error: "Forbiden" },
//       { status: 403 },
//     );
//   }

//   if (blockedIPs.includes(ip)) {
//     console.log("Blocked IP tried to access:", ip, ua);
//     return new Response(null, { status: 403 });
//   }

//   if (!validateFrontendToken(f_token, id, ts)) {
//     return NextResponse.json(
//       { error: "Blocked IP tried to access:" },
//       { status: 422 },
//     );
//   }

//   const b_token = generateBackendToken(f_token, id);
//   return NextResponse.json(b_token);
// }
// // Bind HMAC token to IP — so even a stolen token is useless
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ALLOWED_ORIGINS, isValidReferer } from "@/lib/allowed-referers";

const SECRET = process.env.API_SECRET!;
const CLIENT_SALT = process.env.NEXT_PUBLIC_CLIENT_SALT!;
function getIP(req: NextRequest) {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

function validateFrontendToken(
  f_token: string,
  id: string,
  ts: number,
  ip: string,
) {
  const now = Date.now();
  if (now - ts > 3_000 || ts > now + 500) return false;

  const expected = crypto
    .createHmac("sha256", CLIENT_SALT)
    .update(`${id}:${ts}:${ip}`)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(f_token));
}

function generateBackendToken(f_token: string, id: string, ip: string) {
  const ts = Date.now();
  const token = crypto
    .createHmac("sha256", SECRET)
    .update(`${id}:${f_token}:${ts}:${ip}`)
    .digest("hex");
  return { token, ts };
}

const BLOCKED_IPS = new Set(["45.86.86.43"]);
const deny = () => NextResponse.json({ error: "Bad request" }, { status: 403 });

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  const origin = req.headers.get("origin") ?? "";
  const referer = req.headers.get("referer") ?? "";

  if (!ALLOWED_ORIGINS.includes(origin) || !isValidReferer(referer))
    return deny();
  if (BLOCKED_IPS.has(ip)) return deny();

  let id: string, f_token: string, ts: number;
  try {
    ({ id, f_token, ts } = await req.json());
    if (!id || !f_token || typeof ts !== "number") throw new Error();
  } catch {
    return deny();
  }

  if (!validateFrontendToken(f_token, id, ts, ip)) return deny();

  return NextResponse.json(generateBackendToken(f_token, id, ip));
}
