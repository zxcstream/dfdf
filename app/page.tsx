"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Sliders, Tv2, Tv, Film, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Lamp from "./lamp";
import { Badge } from "@/components/ui/badge";

const DEFAULT_PARAMS = [
  {
    key: "server",
    label: "server",
    desc: "Set your favorite server as default.",
    example: "e.g 1",
  },
  {
    key: "domainAd",
    label: "domainAd",
    desc: "Displays a domain intro splash before the player loads.",
    example: "e.g zxcstream.icu",
  },
  {
    key: "color",
    label: "color",
    desc: "Changes the accent color of the player UI. Pass a hex code without the #.",
    example: "e.g fafafa",
  },
  {
    key: "autoplay",
    label: "autoplay",
    desc: "Automatically plays the movie.",
    example: "e.g true",
  },
  {
    key: "back",
    label: "back",
    desc: "Shows a back button inside the player for navigation.",
    example: "e.g true",
  },
];

type Tab = "custom" | "builtin";

function IdInputs({
  type,
  id,
  setId,
  season,
  setSeason,
  episode,
  setEpisode,
}: {
  type: string;
  id: string;
  setId: (v: string) => void;
  season: string;
  setSeason: (v: string) => void;
  episode: string;
  setEpisode: (v: string) => void;
}) {
  return (
    <div
      className={cn(
        "grid mx-auto",
        type === "tv" ? "grid-cols-3 gap-3 max-w-md" : "grid-cols-1 max-w-xs",
      )}
    >
      <Input
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="ID"
        className="text-center bg-zinc-800 border-zinc-700 placeholder:text-muted-foreground"
      />
      {type === "tv" && (
        <>
          <Input
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            placeholder="S"
            className="bg-zinc-800 border-zinc-700 placeholder:text-muted-foreground"
          />
          <Input
            value={episode}
            onChange={(e) => setEpisode(e.target.value)}
            placeholder="EP"
            className="bg-zinc-800 border-zinc-700 placeholder:text-muted-foreground"
          />
        </>
      )}
    </div>
  );
}

function CopyBar({
  url,
  onCopy,
  copied,
}: {
  url: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="mt-6 flex items-center gap-2 px-3 py-2 bg-card rounded-md">
      <span className="text-sm text-muted-foreground truncate flex-1 font-mono text-center">
        {url}
      </span>
      <button
        onClick={onCopy}
        className="shrink-0 text-muted-foreground hover transition-colors"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

function BuiltinPlayer({ type }: { type: string }) {
  const [id, setId] = useState("1062722");
  const [season, setSeason] = useState("1");
  const [episode, setEpisode] = useState("1");
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const url =
    type === "tv"
      ? `http://zxcstream.xyz/embed/tv/${id}/${season}/${episode}`
      : `http://zxcstream.xyz/embed/movie/${id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6">
      <div className="w-full max-w-4xl">
        <p className="text-sm text-zinc-500 uppercase tracking-widest mb-1.5 font-medium text-center">
          {type === "tv" ? "TMDB ID / SS / EP" : "TMDB ID"}
        </p>
        <IdInputs
          type={type}
          id={id}
          setId={setId}
          season={season}
          setSeason={setSeason}
          episode={episode}
          setEpisode={setEpisode}
        />
        <CopyBar url={url} onCopy={handleCopy} copied={copied} />
      </div>
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black/60">
        <iframe
          key={iframeKey}
          className="h-full w-full"
          src={url}
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [id, setId] = useState("1265609");
  const [type, setType] = useState("movie");
  const [season, setSeason] = useState("1");
  const [episode, setEpisode] = useState("1");
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("custom");

  const playerPath =
    type === "tv"
      ? `/player/tv/${id}/${season}/${episode}`
      : `/player/movie/${id}`;

  const fullUrl = `https://zxcstream.xyz${playerPath}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoad = () => {
    if (id) setIframeKey((k) => k + 1);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col bg-slate-700 overflow-hidden"
      style={{
        background: `linear-gradient(to bottom,rgba(16, 29, 43,0.5), var(--background) 40%, var(--background))`,
      }}
    >
      <Lamp />
      <div className="z-20 absolute inset-x-0 top-0 flex justify-center items-center p-6">
        <div className="flex flex-wrap gap-4 lg:gap-8 lg:text-lg font-medium  items-center">
          <Link href={`https://zxcprime.icu`} target="_blank">
            <div className="flex-1 text-center text-muted-foreground lg:text-base text-sm">
              zxcprime.icu
            </div>
          </Link>

          <div className="flex-1 text-center lg:text-xl text-base">
            zxcstream.xyz
          </div>

          <Link href={`https://zxcstream.pro`} target="_blank ">
            <div className="flex-1 text-center text-muted-foreground lg:text-base text-sm">
              zxcstream.pro
            </div>
          </Link>
        </div>
      </div>

      {/* Hero Branding */}
      <div className="z-10 flex flex-col items-center justify-center lg:pt-50 pt-35  pb-20 px-4 text-center select-none">
        <Badge variant="secondary" className="mb-1" asChild>
          <Link href="https://discord.gg/yv7wJV97Jd">
            Join our Discord <ArrowRight />
          </Link>
        </Badge>
        <div className="flex items-center gap-3 mb-4">
          <h1
            style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.2)" }}
            className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tighter"
          >
            <motion.span
              className="bg-linear-to-r from-[rgb(237,236,233)] via-[rgb(94,84,72)] to-[rgb(172,149,119)] bg-clip-text text-transparent"
              style={{ backgroundSize: "200% 200%" }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              ZXCSTREAM
            </motion.span>
          </h1>
        </div>
        <p className="text-muted-foreground text-sm md:text-2xl max-w-2xl">
          Dive into endless hours of free streaming of Movies & TV Shows. A
          free, easy-to-embed player you can drop into any website
        </p>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center gap-8 px-4 pb-20 w-full">
        {/* Tab Switchers */}
        {[
          {
            label: "PLAYER",
            options: [
              {
                value: "custom",
                icon: <Sliders className="w-4 h-4" />,
                text: "Custom Player",
              },
              {
                value: "builtin",
                icon: <Tv2 className="w-4 h-4" />,
                text: "Built-in Player",
              },
            ],
            active: activeTab,
            setActive: (v: string) => setActiveTab(v as Tab),
          },
          {
            label: "MEDIA TYPE",
            options: [
              {
                value: "movie",
                icon: <Film className="w-4 h-4" />,
                text: "Movie Player",
              },
              {
                value: "tv",
                icon: <Tv className="w-4 h-4" />,
                text: "Series Player",
              },
            ],
            active: type,
            setActive: setType,
          },
        ].map(({ label, options, active, setActive }) => (
          <div key={label}>
            <p className="text-sm text-zinc-500 uppercase tracking-widest mb-1.5 font-medium text-center">
              {label}
            </p>
            <div className="flex items-center justify-center mx-auto gap-1 p-1 bg-zinc-900 rounded-xl w-fit">
              {options.map(({ value, icon, text }) => (
                <button
                  key={value}
                  onClick={() => setActive(value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active === value
                      ? "bg-slate-700 shadow-md"
                      : "text-zinc-400 hover"
                  }`}
                >
                  {icon}
                  {text}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Custom Player Tab */}
        {activeTab === "custom" && (
          <>
            <div className="w-full max-w-4xl">
              <p className="text-sm text-zinc-500 uppercase tracking-widest mb-1.5 font-medium text-center">
                {type === "tv" ? "TMDB ID / SS / EP" : "TMDB ID"}
              </p>
              <IdInputs
                type={type}
                id={id}
                setId={setId}
                season={season}
                setSeason={setSeason}
                episode={episode}
                setEpisode={setEpisode}
              />
              <CopyBar url={fullUrl} onCopy={handleCopy} copied={copied} />
            </div>

            <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black/60">
              <iframe
                key={iframeKey}
                className="h-full w-full"
                src={playerPath}
                allowFullScreen
              />
            </div>

            {/* Params */}
            <div className="w-full max-w-4xl space-y-5">
              <p className="text-sm text-zinc-500 uppercase font-medium tracking-widest">
                Query Parameters
              </p>
              {DEFAULT_PARAMS.map(({ key, label, desc, example }) => (
                <div
                  key={key}
                  className="space-y-1 pb-5 border-b border-zinc-800 last:border-0"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-base font-semibold font-mono">
                      {label}
                    </span>
                    <span className="text-sm font-mono text-muted-foreground">
                      = {example}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
              className="w-full max-w-4xl flex justify-between w-full lg:flex-row flex-col items-center gap-3"
            >
              <h1 className="text-lg font-semibold">Join our community!</h1>
              <div className="flex gap-6">
                <Link target="_blank" href="https://t.me/+AZZmZ7-_SFsxM2M9">
                  <span className="text-sm hover:underline">Telegram</span>
                </Link>
                <Link target="_blank" href="https://discord.gg/yv7wJV97Jd">
                  <span className="text-sm hover:underline">Discord</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}

        {/* Built-in Player Tab */}
        {activeTab === "builtin" && <BuiltinPlayer type={type} />}
      </div>
    </div>
  );
}
