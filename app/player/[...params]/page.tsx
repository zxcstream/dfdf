"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import MainControls from "./controls/main";
import { LyricsServerPicker } from "./serverSelection";
import { useEffect, useState } from "react";
import { usePlayerServers } from "./useServers";
import useMovieById from "@/hooks/metadata";
import useSource from "@/hooks/source";
import { useVideoPlayer } from "./useVideoPlayer";
import { useSettingsStore } from "@/zustand/settings-store";
import { cn } from "@/lib/utils";
import SubtitleOverlay from "./subtitle/SubtitleOverlay";
import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";
import { useHiddenOverlay } from "@/lib/hide-overlay";
import { AnimatePresence, motion } from "framer-motion";
import { useDoubleTap } from "use-double-tap";
import Pause from "./pause";
import DynamicTip from "./tips";
import { useOpenSubtitle } from "@/hooks/open-subtitle";
import { makeKey } from "@/zustand/videoProgressStore";
export default function Player() {
  const { params } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const media_type = String(params?.[0]);
  const tmdbId = String(params?.[1]);
  const season = Number(params?.[2]) || 1;
  const episode = Number(params?.[3]) || 1;
  const defaultServerIndex = Number(searchParams.get("server")) || 0;
  const domain = searchParams.get("domainAd") || "zxcstream.icu";
  const color = searchParams.get("color") || "fafafa";
  const back = Boolean(searchParams.get("back")) || false;
  const [serverQuality, setServerQuality] = useState<"4k" | null>(null);
  const [doubleTapSide, setDoubleTapSide] = useState<"left" | "right" | null>(
    null,
  );
  // SETTINGS ZUSTAND
  const aspectRatio = useSettingsStore(
    (state) => state.values["Aspect Ratio"]?.id ?? "16:9",
  );
  const mirror = useSettingsStore(
    (state) => state.values["Mirror"]?.id ?? "off",
  );
  const subtitleUrl = useSettingsStore(
    (state) => state.values["Subtitles"]?.file ?? null,
  );
  const dualSubtitleUrl = useSettingsStore(
    (state) => state.values["Dual subtitles"]?.file ?? null,
  );
  const autoplay = useSettingsStore(
    (state) => state.values["Autoplay"]?.id ?? "on",
  );
  const sourceQualityId = useSettingsStore(
    (s) => s.values["Source quality"]?.id ?? "0",
  );
  const brightness = useSettingsStore(
    (s) => s.values["Brightness"]?.id ?? "100%",
  );
  const {
    handleCanPlay,
    handleManualSelect,
    handleServerFail,
    handleMarkConnecting,
    handleMarkChecking,
    handleQualityChange,
    serverIndex,
    servers,
    setServers,
    playingIndex,
  } = usePlayerServers({ defaultServerIndex });
  const fetchServer = servers[serverIndex];
  //MOVIE METADATA
  const { data: metadata } = useMovieById({ media_type, tmdbId });
  const imdbId = metadata?.external_ids?.imdb_id ?? null;
  const title = metadata?.title || metadata?.name || "";
  const date = metadata?.release_date ?? metadata?.first_air_date;
  const year = date ? String(new Date(date).getFullYear()) : "";
  const totalSeasons = metadata?.number_of_seasons || 0;
  const [cCToggle, setCcToggle] = useState(true);
  const [loaded, setLoaded] = useState(false);
  //MOVIE SOURCE
  const {
    data: source,
    error: sourceError,
    isLoading: sourceLoading,
  } = useSource({
    media_type,
    tmdbId,
    season,
    episode,
    server: fetchServer.server,
    imdbId,
    title,
    year,
    quality: serverQuality,
    onCancel: () => {
      setServers((prev) =>
        prev.map((s, i) =>
          i === serverIndex && s.status === "checking"
            ? { ...s, status: "cancelled" }
            : s,
        ),
      );
    },
  });

  //OPEN SUBTITLE
  const { data: openSubtitleData = [] } = useOpenSubtitle({
    imdbId,
    season: media_type === "tv" ? season : undefined,
    episode: media_type === "tv" ? episode : undefined,
  });

  const subtitleData = source?.subtitles || [];
  const mergeSubtitles = [...subtitleData, ...openSubtitleData];
  const { isVisible, resetTimer, setIsVisible, lockTimer } =
    useHiddenOverlay(1500000);

  const playerSrc =
    servers[serverIndex].status === "connecting" ||
    servers[serverIndex].status === "available"
      ? (source?.links[Number(sourceQualityId)].link ?? null)
      : null;
  const srcType = source?.links?.[Number(sourceQualityId)]?.type ?? "";

  //VIDEO LISTENERS
  const { videoRef, containerRef, state, controls, quality, audioTracks } =
    useVideoPlayer({
      playerSrc,
      srcType,
      serverIndex,
      progressKey: makeKey(media_type, tmdbId, season, episode),
    });

  useEffect(() => {
    if (sourceLoading) {
      handleMarkChecking();
    }
  }, [serverIndex, sourceLoading]);
  useEffect(() => {
    if (!source?.links) return;
    handleQualityChange();
  }, [sourceQualityId]);
  useEffect(() => {
    if (sourceLoading || (!source?.links && !sourceError)) return;
    if (sourceError || source?.links.length === 0) {
      handleServerFail();
    } else {
      handleMarkConnecting();
    }
  }, [source?.links, sourceError, sourceLoading, sourceQualityId]);
  useEffect(() => {
    if (!state.ended) return;
    if (autoplay !== "on") return;
    if (media_type === "movie") return;

    router.push(`/player/tv/${tmdbId}/${season}/${episode + 1}`);
  }, [state.ended]);
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          controls.togglePlay();
          break;
        case "ArrowRight":
          controls.skipBy(10);
          setDoubleTapSide("right");
          setTimeout(() => setDoubleTapSide(null), 600);
          break;
        case "ArrowLeft":
          controls.skipBy(-10);
          setDoubleTapSide("left");
          setTimeout(() => setDoubleTapSide(null), 600);
          break;
        case "f":
          controls.toggleFullscreen();
          break;
        case "m":
          controls.toggleMute();
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  const handleDoubleTap = useDoubleTap(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const side = e.clientX - rect.left < rect.width / 2 ? "left" : "right";
      controls.skipBy(side === "left" ? -15 : 15);
      setDoubleTapSide(side);
      setTimeout(() => setDoubleTapSide(null), 600);
    },
    250,
    {
      onSingleTap: () => {
        if (isMobile) {
          // resetTimer();
          setIsVisible((prev) => !prev);
        } else {
          controls.togglePlay();
        }
      },
    },
  );
  useEffect(() => {
    setLoaded(false);
  }, [serverIndex]);

  useEffect(() => {
    if (!mergeSubtitles.length) return;
    console.log(
      "🔁 subtitle auto-select fired, length:",
      mergeSubtitles.length,
    ); // ← add this
    const exactMatch = [...mergeSubtitles]
      .reverse()
      .find((s) => s.display.toLowerCase() === "english");

    const fuzzyMatch = mergeSubtitles.find((s) =>
      s.display.toLowerCase().includes("english"),
    );

    const chosen = exactMatch ?? fuzzyMatch;

    useSettingsStore.getState().setValue("Subtitles", {
      display: chosen?.display ?? "Off",
      id: chosen?.id ?? "off",
      file: chosen?.file,
    });

    useSettingsStore.getState().setValue("Dual subtitles", {
      display: "Off",
      id: "off",
    });
  }, [mergeSubtitles.length]);
  return (
    <div
      ref={containerRef}
      className="relative h-svh w-full  overflow-hidden bg-black"
    >
      <div className="h-full w-full">
        <video
          key={`${playerSrc}-${sourceQualityId}`}
          ref={videoRef}
          onCanPlay={handleCanPlay}
          onError={handleServerFail}
          autoPlay
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-700 mx-auto brightness-200",
            servers[serverIndex].status === "available"
              ? "opacity-100"
              : "opacity-0",
            mirror === "on" && "-scale-x-100",
            aspectRatio === "fill" && "object-fill",
            aspectRatio === "4:3" && "object-contain max-w-[calc(100vh*4/3)]",
            aspectRatio === "21:9" && "object-contain max-w-[calc(100vh*21/9)]",
            aspectRatio === "16:9" && "object-contain",
            brightness === "50%" && "brightness-50",
            brightness === "75%" && "brightness-75",
            brightness === "100%" && "brightness-100",
            brightness === "125%" && "brightness-125",
            brightness === "150%" && "brightness-150",
            brightness === "200%" && "brightness-200",
          )}
        />
      </div>

      <AnimatePresence>
        {!state.canPlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className={cn(
              "fixed inset-0",
              loaded ? "opacity-100" : "opacity-0",
            )}
          >
            <img
              src={`https://image.tmdb.org/t/p/original/${metadata?.backdrop_path}`}
              alt=""
              className={`h-full w-full object-cover transition-opacity duration-700`}
              onLoad={() => setLoaded(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!state.canPlay && <DynamicTip />}
      <AnimatePresence>
        {metadata && !state.playing && !isVisible && state.canPlay && (
          <Pause metadata={metadata} color={color} />
        )}
      </AnimatePresence>
      {/* DOUBLE TAP */}
      <AnimatePresence>
        {doubleTapSide && state.canPlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`absolute top-0 bottom-0 w-1/2 flex items-center justify-center z-20 pointer-events-none
      ${doubleTapSide === "left" ? "left-0" : "right-0"}`}
          >
            <div className="flex flex-col items-center gap-1 text-white">
              <span className="text-3xl font-medium">
                {doubleTapSide === "left" ? "−15s" : "+15s"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className={cn(
          "absolute -translate-y-1/2 top-1/2 -translate-x-1/2 left-1/2 z-30 transition-opacity duration-300",
          state.waiting && state.canPlay
            ? "opacity-100"
            : "opacity-0 pointer-events-none",
        )}
      >
        <Tailspin size="60" stroke="8" speed="0.9" color="white" />
      </div>
      {cCToggle && state.canPlay && state.playing && (
        <>
          <SubtitleOverlay
            subtitleUrl={subtitleUrl}
            currentTime={state.currentTime}
            isVisible={isVisible}
            domain={domain}
          />
          <SubtitleOverlay
            subtitleUrl={dualSubtitleUrl}
            currentTime={state.currentTime}
            position="top"
            isVisible={isVisible}
            domain={domain}
          />
        </>
      )}

      {state.canPlay && (
        <div
          className="absolute inset-0"
          onPointerMove={() => {
            resetTimer();
          }}
          {...handleDoubleTap}
        />
      )}
      <AnimatePresence>
        {(isVisible || !state.canPlay) && (
          <LyricsServerPicker
            servers={servers}
            playingIndex={playingIndex}
            activeIndex={serverIndex}
            onSelect={handleManualSelect}
            //
            lockTimer={lockTimer}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isVisible && playerSrc && state.canPlay && (
          <MainControls
            state={state}
            controls={controls}
            playerSrc={playerSrc}
            //skip Intro Props
            tmdbId={tmdbId}
            imdbId={imdbId}
            season={season}
            episode={episode}
            media_type={media_type}
            currentTime={state.currentTime}
            skipBy={controls.skipBy}
            //
            quality={quality}
            audioTracks={audioTracks}
            //
            //
            mergeSubtitles={mergeSubtitles}
            //
            title={title}
            //
            onPip={controls.togglePip}
            //
            cCToggle={cCToggle}
            setCcToggle={setCcToggle}
            //
            resetTimer={resetTimer}
            lockTimer={lockTimer}
            //
            totalSeasons={totalSeasons}
            //

            source={source?.links ?? []}
            //

            color={color}
            back={back}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
