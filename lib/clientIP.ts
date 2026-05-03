import axios from "axios";

export async function fetchClientIP(): Promise<string> {
  try {
    const res = await axios.get("/backend/cloudfare.min.js");
    return res.data.ip ?? "unknown";
  } catch {
    return "unknown";
  }
}
