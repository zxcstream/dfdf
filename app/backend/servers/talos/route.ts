// import { fetchWithTimeout } from "@/lib/fetch-timeout";
// import { NextRequest, NextResponse } from "next/server";
// import { validateBackendToken } from "@/lib/validate-token";
// import { isValidReferer } from "@/lib/allowed-referers";

// export async function GET(req: NextRequest) {
//   try {
//     const tmdbId = req.nextUrl.searchParams.get("a");
//     const mediaType = req.nextUrl.searchParams.get("b");
//     const title = req.nextUrl.searchParams.get("f");
//     const year = req.nextUrl.searchParams.get("g");
//     const season = req.nextUrl.searchParams.get("s");
//     const episode = req.nextUrl.searchParams.get("e");
//     const ts = Number(req.nextUrl.searchParams.get("gago"));
//     const token = req.nextUrl.searchParams.get("putangnamo")!;
//     const f_token = req.nextUrl.searchParams.get("f_token")!;

//     if (!tmdbId || !mediaType || !title || !year || !ts || !token) {
//       return NextResponse.json(
//         { success: false, error: "need token" },
//         { status: 404 },
//       );
//     }

//     // ⏱ expire after 8 seconds
//     if (Date.now() - Number(ts) > 8000) {
//       return NextResponse.json(
//         { success: false, error: "Invalid token" },
//         { status: 403 },
//       );
//     }

//     if (!validateBackendToken(tmdbId, f_token, ts, token)) {
//       return NextResponse.json(
//         { success: false, error: "Invalid token" },
//         { status: 403 },
//       );
//     }

//     // block direct /api access
//     const referer = req.headers.get("referer") || "";
//     if (!isValidReferer(referer)) {
//       return NextResponse.json(
//         { success: false, error: "Forbidden" },
//         { status: 403 },
//       );
//     }

//     // ─── Fetch source link ────────────────────────────────────────────────────
//     const sourceUrl = new URL("https://test2.jerometecson-main.workers.dev/");
//     sourceUrl.searchParams.set("id", tmdbId);
//     sourceUrl.searchParams.set("type", mediaType);
//     if (season && mediaType === "tv")
//       sourceUrl.searchParams.set("season", season);
//     if (episode && mediaType === "tv")
//       sourceUrl.searchParams.set("episode", episode);

//     const sourceRes = await fetchWithTimeout(
//       sourceUrl.toString(),
//       {
//         headers: {
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
//         },
//       },
//       10000,
//     );

//     if (!sourceRes.ok) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Source upstream failed",
//           status: sourceRes.status,
//         },
//         { status: sourceRes.status },
//       );
//     }

//     const sourceData = await sourceRes.json();

//     if (!sourceData.iframeSrc) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "No stream link from source",
//           detail: sourceData,
//         },
//         { status: 404 },
//       );
//     }

//     // ─── Step 4: Resolve final video URL from Streamtape ─────────────────────
//     const step4Res = await fetchWithTimeout(
//       `${req.nextUrl.origin}/backend/proxy/streamtape/?url=${encodeURIComponent(sourceData.iframeSrc)}`,
//       {
//         headers: {
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
//         },
//       },
//       10000,
//     );

//     if (!step4Res.ok) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Step 4 upstream failed",
//           status: step4Res.status,
//         },
//         { status: step4Res.status },
//       );
//     }

//     const step4Data = await step4Res.json();

//     if (!step4Data.videoUrl) {
//       return NextResponse.json(
//         { success: false, error: "No videoUrl from Step 4", detail: step4Data },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       links: [
//         {
//           type: "mp4",
//           link: step4Data.videoUrl,
//         },
//       ],
//       subtitles: [],
//     });
//   } catch (err) {
//     const message = err instanceof Error ? err.message : String(err);
//     const stack = err instanceof Error ? err.stack : undefined;
//     return NextResponse.json(
//       { success: false, error: message, stack },
//       { status: 500 },
//     );
//   }
// }
import { fetchWithTimeout } from "@/lib/fetch-timeout";
import { NextRequest, NextResponse } from "next/server";
import { validateBackendToken } from "@/lib/validate-token";
import { isValidReferer } from "@/lib/allowed-referers";

export async function GET(req: NextRequest) {
  try {
    const tmdbId = req.nextUrl.searchParams.get("a");
    const mediaType = req.nextUrl.searchParams.get("b");
    const title = req.nextUrl.searchParams.get("f");
    const year = req.nextUrl.searchParams.get("g");
    const season = req.nextUrl.searchParams.get("s");
    const episode = req.nextUrl.searchParams.get("e");
    const ts = Number(req.nextUrl.searchParams.get("gago"));
    const token = req.nextUrl.searchParams.get("putangnamo")!;
    const f_token = req.nextUrl.searchParams.get("f_token")!;

    if (!tmdbId || !mediaType || !title || !year || !ts || !token) {
      return NextResponse.json(
        { success: false, error: "need token" },
        { status: 404 },
      );
    }

    // ⏱ expire after 8 seconds
    if (Date.now() - Number(ts) > 8000) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 403 },
      );
    }

    if (!validateBackendToken(tmdbId, f_token, ts, token)) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 403 },
      );
    }

    // block direct /api access
    const referer = req.headers.get("referer") || "";
    if (!isValidReferer(referer)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    // ─── Fetch source link ────────────────────────────────────────────────────
    const sourceUrl = new URL("https://test2.jerometecson-main.workers.dev/");
    sourceUrl.searchParams.set("id", tmdbId);
    sourceUrl.searchParams.set("type", mediaType);
    if (season && mediaType === "tv")
      sourceUrl.searchParams.set("season", season);
    if (episode && mediaType === "tv")
      sourceUrl.searchParams.set("episode", episode);

    const sourceUrlStr = sourceUrl.toString();

    const sourceRes = await fetchWithTimeout(
      sourceUrlStr,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        },
      },
      10000,
    );

    if (!sourceRes.ok) {
      let sourceBody: unknown = null;
      try {
        sourceBody = await sourceRes.json();
      } catch {
        try {
          sourceBody = await sourceRes.text();
        } catch {
          sourceBody = null;
        }
      }
      return NextResponse.json(
        {
          success: false,
          step: "source_fetch",
          error: "Source upstream failed",
          debug: {
            url: sourceUrlStr,
            status: sourceRes.status,
            statusText: sourceRes.statusText,
            body: sourceBody,
          },
        },
        { status: sourceRes.status },
      );
    }

    const sourceData = await sourceRes.json();

    if (!sourceData.iframeSrc) {
      return NextResponse.json(
        {
          success: false,
          step: "source_parse",
          error: "No iframeSrc from source",
          debug: {
            url: sourceUrlStr,
            body: sourceData,
          },
        },
        { status: 404 },
      );
    }

    // ─── Step 4: Resolve final video URL from Streamtape ─────────────────────
    const step4Url = `${req.nextUrl.origin}/backend/proxy/streamtape/?url=${encodeURIComponent(sourceData.iframeSrc)}`;

    const step4Res = await fetchWithTimeout(
      step4Url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        },
      },
      10000,
    );

    if (!step4Res.ok) {
      let step4Body: unknown = null;
      try {
        step4Body = await step4Res.json();
      } catch {
        try {
          step4Body = await step4Res.text();
        } catch {
          step4Body = null;
        }
      }
      return NextResponse.json(
        {
          success: false,
          step: "step4_fetch",
          error: "Step 4 upstream failed",
          debug: {
            url: step4Url,
            iframeSrc: sourceData.iframeSrc,
            status: step4Res.status,
            statusText: step4Res.statusText,
            body: step4Body,
          },
        },
        { status: step4Res.status },
      );
    }

    const step4Data = await step4Res.json();

    if (!step4Data.videoUrl) {
      return NextResponse.json(
        {
          success: false,
          step: "step4_parse",
          error: "No videoUrl from Step 4",
          debug: {
            url: step4Url,
            iframeSrc: sourceData.iframeSrc,
            body: step4Data,
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      links: [
        {
          type: "mp4",
          link: step4Data.videoUrl,
        },
      ],
      subtitles: [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    return NextResponse.json(
      { success: false, step: "exception", error: message, stack },
      { status: 500 },
    );
  }
}
