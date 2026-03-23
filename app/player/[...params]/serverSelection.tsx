"use client";
import { ServerStatus, ServerTypes } from "@/types/player-types";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import {
  Ban,
  Wifi,
  WifiOff,
  Clock,
  Loader,
  X,
  Minus,
  SquareCheckBig,
  PlayCircle,
  Cast,
  LoaderCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import "swiper/css";
import { cn } from "@/lib/utils";

type Props = {
  servers: ServerTypes[];
  activeIndex: number;
  onSelect: (i: number) => void;
  playingIndex: number | null;

  lockTimer?: () => void;
};

export function LyricsServerPicker({
  servers,
  activeIndex,
  onSelect,
  playingIndex,

  lockTimer,
}: Props) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [visualIndex, setVisualIndex] = useState(activeIndex);

  // Sync swiper when parent changes activeIndex
  useEffect(() => {
    if (!swiperRef.current) return;

    swiperRef.current.slideTo(activeIndex);
    setVisualIndex(activeIndex);
  }, [activeIndex]);

  const handleSlideChange = (swiper: SwiperInstance) => {
    setVisualIndex(swiper.activeIndex);
    // resetTimer();
  };

  const handleClick = (i: number) => {
    onSelect(i); // parent controls activeIndex
  };

  const statusLabel: Record<ServerStatus, string> = {
    queue: "queue",
    checking: "checking...",
    connecting: "connecting...",
    available: "available",
    failed: "No video found",
    cancelled: "cancelled",
  };

  const statusClass: Record<ServerStatus, string> = {
    queue: "text-white/30",
    checking: "text-muted-foreground",
    connecting: "text-muted-foreground animate-pulse",
    available: "text-emerald-500",
    failed: "text-red-600",
    cancelled: "text-white/20",
  };

  const statusIcon: Record<ServerStatus, React.ElementType> = {
    queue: Minus,
    checking: Loader,
    connecting: LoaderCircle,
    available: SquareCheckBig,
    failed: X,
    cancelled: Ban,
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && swiperRef.current) {
        const index = swiperRef.current.activeIndex;
        onSelect(index);
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [onSelect]);
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className=" h-full inset-0  absolute right-0  pointer-events-none bg-linear-to-l from-black/80 lg:via-transparent to-transparent"
      onPointerMove={lockTimer}
    >
      <Swiper
        modules={[Mousewheel, Keyboard]}
        direction="vertical"
        slidesPerView="auto"
        centeredSlides
        mousewheel={{ sensitivity: 1, thresholdDelta: 10, forceToAxis: true }}
        initialSlide={activeIndex}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        className="absolute h-full"
        style={
          {
            "--swiper-wrapper-transition-timing-function":
              "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          } as React.CSSProperties
        }

        // onSlideChangeTransitionEnd={(swiper) => {
        //   // Commit the selection once the user finishes dragging/scrolling
        //   onSelect(swiper.activeIndex);
        // }}
      >
        {servers.map((s, i) => {
          const isActive = i === visualIndex;
          const isNear = Math.abs(i - visualIndex) === 1;
          const isFailed = s.status === "failed";
          const isPlaying = i === playingIndex;
          const Icon = statusIcon[s.status];

          return (
            <SwiperSlide
              key={s.server}
              className={cn(
                "h-auto!  transition-all! duration-200 pointer-events-auto  group cursor-pointer text-end select-none lg:py-10 md:py-8 py-5 max-[340px]:py-3 lg:px-8 px-2  w-fit! ml-auto",
                isActive
                  ? "lg:-translate-x-15 -translate-x-8  max-[340px]:-translate-x-4"
                  : "",
                isNear
                  ? "lg:-translate-x-8 -translate-x-4  max-[340px]:-translate-x-2 opacity-50"
                  : "",
                !isActive && !isNear
                  ? "lg:opacity-30 opacity-10 pointer-events-none"
                  : "",
              )}
              // className="h-auto!  lg:w-sm! w-60! ml-auto"
              onClick={() => handleClick(i)}
            >
              <p
                className={[
                  "transition-all duration-400 font-semibold",
                  isActive
                    ? "lg:text-3xl md:text-2xl text-lg max-[340px]:text-xs text-foreground"
                    : "",
                  isNear && !isActive
                    ? "lg:text-2xl md:text-xl text-base max-[340px]:text-xs "
                    : "",
                  !isActive && !isNear
                    ? "lg:text-2xl md:text-xl text-sm max-[340px]:text-[0.5rem]"
                    : "",
                  isFailed ? "line-through " : "",
                ].join(" ")}
              >
                {s.name}
              </p>

              <p className="text-gray-300 font-medium lg:mt-1 lg:text-base text-sm max-[340px]:text-[0.6rem]">
                {s.desc}
              </p>

              <span
                className={`lg:text-base text-xs max-[340px]:text-[0.6rem] lg:mt-3 mt-1.5 max-[340px]:mt-0.5 capitalize flex justify-end items-center gap-2  ${
                  isPlaying ? "text-green-600" : statusClass[s.status]
                }`}
              >
                <p>{isPlaying ? "connected" : statusLabel[s.status]}</p>

                {isPlaying ? (
                  <Cast className="w-4 h-4" />
                ) : (
                  <Icon
                    className={`w-4 h-4 ${
                      s.status === "checking" || s.status === "connecting"
                        ? "animate-spin"
                        : ""
                    }`}
                  />
                )}
              </span>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </motion.div>
  );
}
