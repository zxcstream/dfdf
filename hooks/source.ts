import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import crypto from "crypto";
import { MediaOption } from "./open-subtitle";

export interface QualityTrack {
  resolution?: number;
  format?: string;
  size?: string;
  type: "mp4" | "hls";
  link: string;
}

export interface SourceTypes {
  success: boolean;
  links: QualityTrack[];
  subtitles: MediaOption[];
}

interface UseSourceParams {
  media_type: string;
  tmdbId: string;
  season: number;
  episode: number;
  imdbId: string | null;
  server: string;
  title: string;
  year: string;
  quality?: "4k" | null;
}

export default function useSource(
  params: UseSourceParams & { onCancel?: () => void },
) {
  const {
    media_type,
    tmdbId,
    season,
    episode,
    imdbId,
    server,
    title,
    year,
    quality,
    onCancel,
  } = params;

  return useQuery<SourceTypes>({
    queryKey: [
      "get-source",
      tmdbId,
      media_type,
      season,
      episode,
      imdbId,
      server, // ← only refetches after scroll stops
      title,
      year,
      quality,
    ],
    enabled: Boolean(tmdbId && imdbId && server === server), // ← blocks fetch while scrolling
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    queryFn: async ({ signal }) => {
      if (onCancel) {
        signal.addEventListener(
          "abort",
          () => {
            console.log("Request cancelled!");
            onCancel();
          },
          { once: true },
        );
      }
      if (server === "thanatos") {
        return fetchThanatosSource({
          media_type,
          tmdbId,
          season,
          episode,
          imdbId,
          title,
          year,
          signal,
        });
      }
      const { f_token, f_ts } = generateFrontendToken(String(tmdbId));

      const { ts, token } = await fetchBackendToken(
        tmdbId,
        f_token,
        f_ts,
        signal,
      );
      const url = buildSourceURL({
        server,
        tmdbId,
        media_type,
        season,
        episode,
        imdbId,
        title,
        year,
        // quality,
        ts,
        token,
        f_token,
      });
      const res = await axios.get(url, { signal });
      await sleep(1200);
      return res.data;
    },
  });
}

async function fetchBackendToken(
  id: string,
  f_token: string,
  ts: number,
  signal?: AbortSignal,
) {
  const res = await axios.post(
    "/backend/token",
    { idd: id, f_token, ts },
    { signal },
  );
  return res.data;
}

interface BuildSourceURLParams {
  server: string;
  tmdbId: string;
  media_type: string;
  season: number;
  episode: number;
  imdbId: string | null;
  title: string;
  year: string;
  ts: number;
  token: string;
  f_token: string;
}

function buildSourceURL({
  server,
  tmdbId,
  imdbId,
  media_type,
  season,
  episode,
  title,
  year,
  ts,
  token,
  f_token,
}: BuildSourceURLParams) {
  const params = new URLSearchParams({
    a: String(tmdbId),
    b: media_type,
    gago: String(ts),
    putangnamo: token,
    f_token,
    f: title,
    g: year,
  });

  if (media_type === "tv") {
    params.append("c", String(season));
    params.append("d", String(episode));
  }

  if (imdbId) {
    params.append("e", imdbId);
  }

  return `/backend/servers/${server}?${params.toString()}`;
}

export function generateFrontendToken(id: string) {
  const f_ts = Date.now();

  const f_token = crypto
    .createHash("sha256")
    .update(`${id}:${f_ts}`)
    .digest("hex");

  return { f_token, f_ts };
}
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// videasy-2.zxcprime365.workers.dev

async function fetchThanatosSource({
  media_type,
  tmdbId,
  season,
  episode,
  title,
  year,
  signal,
}: {
  media_type: string;
  tmdbId: string;
  season: number;
  episode: number;
  imdbId: string | null;
  title: string;
  year: string;
  signal?: AbortSignal;
}): Promise<SourceTypes> {
  // Step 1: Fetch encrypted source directly (user's IP)
  const qs = new URLSearchParams({
    title,
    mediaType: media_type,
    year,
    tmdbId,
  });
  if (media_type === "tv") {
    qs.set("seasonId", String(season));
    qs.set("episodeId", String(episode));
  }

  const videasyRes = await axios.get(
    `https://api.videasy.net/myflixerzupcloud/sources-with-title?${qs}`,
    {
      signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        Referer: "https://videasy.net/",
      },
    },
  );

  // Step 2: Decrypt directly from browser (user's IP)
  const decryptRes = await axios.post(
    "https://enc-dec.app/api/dec-videasy",
    { text: videasyRes.data, id: tmdbId },
    { signal },
  );

  const sources = decryptRes.data?.result?.sources;
  if (!Array.isArray(sources) || sources.length === 0) {
    throw new Error("No stream found");
  }

  // Step 3: Still use backend only for proxy selection (no rate-limited calls here)
  const finalM3u8 = encodeURIComponent(
    sources.find((f: any) => f.quality === "1080p")?.url ??
      sources.at(0)?.url ??
      "",
  );

  const proxies = [
    "https://billowing-king-b723.jerometecson33.workers.dev/",
    "https://snowy-recipe-f96e.jerometecson000.workers.dev/",
    "https://morning-unit-723b.jinluxus303.workers.dev/",
    "https://square-darkness-1efb.amenohabakiri174.workers.dev/",
  ];

  // Step 4: Find working proxy client-side
  const workingProxy = await getWorkingProxyClient(finalM3u8, proxies, signal);
  if (!workingProxy) throw new Error("No working proxy available");

  await sleep(1200);
  return {
    success: true,
    links: [{ type: "hls", link: `${workingProxy}?m3u8-proxy=${finalM3u8}` }],
    subtitles: [],
  };
}

async function getWorkingProxyClient(
  url: string,
  proxies: string[],
  signal?: AbortSignal,
): Promise<string | null> {
  for (const proxy of proxies) {
    try {
      const res = await fetch(`${proxy}?m3u8-proxy=${url}`, {
        method: "HEAD",
        headers: { Range: "bytes=0-1" },
        signal,
      });
      if (res.ok) return proxy;
    } catch {
      // try next
    }
  }
  return null;
}
