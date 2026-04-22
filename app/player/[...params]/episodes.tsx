import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { useTvSeason } from "@/hooks/get-seasons";
import Link from "next/link";
import { EpisodesIcon } from "@/components/icons/episodes";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, VideoOff, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function Episodes({
  tmdbId,
  season,
  episode,
  lockTimer,
  resetTimer,
  totalSeasons,
}: {
  tmdbId: string;
  season: number;
  episode: number;
  lockTimer: () => void;
  resetTimer: () => void;
  totalSeasons: number;
}) {
  const [open, setOpen] = useState(false);
  const [activateSpoiler, setActivateSpoiler] = useState(true);
  const [selectSeason, setSeasonSelect] = useState(season);

  const { data, isLoading } = useTvSeason({
    tmdbId,
    season_number: selectSeason,
    media_type: "tv",
  });

  const closeDrawer = () => {
    setOpen(false);
    resetTimer();
  };

  const params = new URLSearchParams();

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        onPointerMove={lockTimer}
        className="lg:translate-y-0.5 translate-y-1 text-white/80 hover:text-white cursor-pointer"
      >
        <EpisodesIcon className="lg:size-10.5 md:size-10 size-6.5 " />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-linear-to-t from-black to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeDrawer}
            />

            {/* Bottom Panel */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 lg:px-6 px-2 py-4 space-y-3"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 45, stiffness: 420 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Button
                    variant="secondary"
                    disabled={selectSeason <= 1}
                    onClick={() => setSeasonSelect((s) => s - 1)}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button variant="secondary" className="font-medium">
                    Season {selectSeason}
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={selectSeason >= totalSeasons}
                    onClick={() => setSeasonSelect((s) => s + 1)}
                  >
                    <ChevronRight />
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="secondary">
                    <ChevronLeft />
                  </Button>
                  <Button variant="secondary">
                    <ChevronRight />
                  </Button>
                  <Button variant="secondary" onClick={() => setOpen(false)}>
                    <X />
                  </Button>
                </div>
              </div>
              <Swiper
                modules={[FreeMode, Mousewheel]}
                freeMode={{
                  enabled: true,
                }}
                slidesPerView="auto"
                spaceBetween={8}
              >
                {data?.episodes.length === 0 ? (
                  <NoEpisodesFound />
                ) : isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <SwiperSlide key={i} className="w-auto!">
                      <EpisodeSkeletonCard />
                    </SwiperSlide>
                  ))
                ) : (
                  data?.episodes.map((e) => {
                    const isActive =
                      episode === e.episode_number && season === selectSeason;

                    return (
                      <SwiperSlide key={e.id} className="w-auto!">
                        <Link
                          href={`/player/tv/${tmdbId}/${selectSeason}/${
                            e.episode_number
                          }${params.toString() ? `?${params.toString()}` : ""}`}
                          onClick={closeDrawer}
                          className="group"
                        >
                          <div
                            className={cn(
                              "p-1 bg-linear-to-t  rounded-b-md to-transparent hover:from-slate-900 transition duration-200",
                              isActive ? " from-slate-900" : "from-card",
                            )}
                          >
                            <div className="relative flex flex-col max-w-50 sm:max-w-85">
                              <div className="relative w-full aspect-video overflow-hidden rounded-md">
                                {e.still_path ? (
                                  <img
                                    src={`https://image.tmdb.org/t/p/w500${e.still_path}`}
                                    alt={e.name}
                                    loading="lazy"
                                    className={`w-full h-full object-cover transition-all duration-300 group-hover:brightness-75 ${
                                      !activateSpoiler
                                        ? "blur-xl scale-110"
                                        : ""
                                    }`}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                                    <span className="text-5xl font-black text-neutral-800">
                                      {e.episode_number}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="mt-2 pr-2 pl-1 py-1">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-base text-white/40 font-medium tabular-nums shrink-0">
                                    E{e.episode_number}
                                  </span>
                                  {activateSpoiler && (
                                    <p className="text-base text-white/80 font-medium truncate leading-snug">
                                      {e.name}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 mt-0.5">
                                  {e.runtime && (
                                    <span className="text-sm font-medium text-muted-foreground/90">
                                      {e.runtime} min
                                    </span>
                                  )}
                                  {e.runtime && e.air_date && (
                                    <span className="text-sm font-medium text-muted-foreground/90">
                                      ·
                                    </span>
                                  )}
                                  {e.air_date && (
                                    <span className="text-sm font-medium text-muted-foreground/90">
                                      {new Date(e.air_date).toLocaleDateString(
                                        "en-US",
                                        {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        },
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    );
                  })
                )}
              </Swiper>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
function NoEpisodesFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 px-4 w-full min-h-[140px] text-center">
      <div className="flex items-center justify-center size-12 rounded-full bg-white/5">
        <VideoOff className="size-5 text-white/30" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-white/60">No episodes found</p>
        <p className="text-xs text-white/30">
          This season doesn't have any episodes yet.
        </p>
      </div>
    </div>
  );
}
function EpisodeSkeletonCard() {
  return (
    <div className="flex flex-col max-w-50 sm:max-w-85 w-[160px] sm:w-[320px]">
      {/* Thumbnail skeleton */}
      <Skeleton className="w-full aspect-video rounded-md" />

      {/* Text skeletons */}
      <div className="mt-3 pr-2 space-y-2">
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-4 w-6 shrink-0" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}
