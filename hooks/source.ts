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

  // if (server === "resshin" && quality) {
  //   params.append("quality", quality);
  // }

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
