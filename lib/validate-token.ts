// import crypto from "crypto";
// const SECRET = process.env.API_SECRET!;
// export function validateBackendToken(
//   id: string,
//   f_token: string,
//   ts: number,
//   token: string,
// ) {
//   if (Date.now() - ts > 8000) return false;
//   const expected = crypto
//     .createHmac("sha256", SECRET)
//     .update(`${id}:${f_token}:${ts}`)
//     .digest("hex");
//   return expected === token;
// }
// validate-token.ts
import crypto from "crypto";
const SECRET = process.env.API_SECRET!;

export function validateBackendToken(
  id: string,
  f_token: string,
  ts: number,
  token: string,
  ip: string,
) {
  if (Date.now() - ts > 8000) return false;
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(`${id}:${f_token}:${ts}:${ip}`)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}