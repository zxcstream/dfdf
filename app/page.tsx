"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowRight, Copy, Check, Sliders, Tv2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

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
    desc: "Automatically plays the next episode when the current one ends.",
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

function BuiltinPlayer() {
  const [id, setId] = useState("1062722");
  const [type, setType] = useState("movie");
  const [season, setSeason] = useState("1");
  const [episode, setEpisode] = useState("1");
  const [iframeKey, setIframeKey] = useState(0);
  const [url, setUrl] = useState("http://zxcstream.xyz/embed/movie/1062722");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoad = () => {
    if (!id) return;
    const built =
      type === "tv"
        ? `http://zxcstream.xyz/embed/tv/${id}/${season}/${episode}`
        : `http://zxcstream.xyz/embed/movie/${id}`;
    setUrl(built);
    setIframeKey((k) => k + 1);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6">
      <div>
        <p className="text-sm text-zinc-500 uppercase tracking-widest mb-3">
          Player URL
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-zinc-500 text-base">zxcstream.xyz/embed/</span>

          <Select onValueChange={(v) => setType(v)} defaultValue="movie">
            <SelectTrigger className="w-[110px] bg-zinc-800 border-zinc-700 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectGroup>
                <SelectItem value="movie">movie</SelectItem>
                <SelectItem value="tv">tv</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <span className="text-zinc-500">/</span>

          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="ID"
            className="w-25 bg-zinc-800 border-zinc-700 placeholder:text-muted-foreground"
          />

          {type === "tv" && (
            <>
              <span className="text-zinc-500">/</span>
              <Input
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="S"
                className="w-16 bg-zinc-800 border-zinc-700 placeholder:text-muted-foreground"
              />
              <span className="text-zinc-500">/</span>
              <Input
                value={episode}
                onChange={(e) => setEpisode(e.target.value)}
                placeholder="EP"
                className="w-16 bg-zinc-800 border-zinc-700 placeholder:text-muted-foreground"
              />
            </>
          )}

          <Button
            onClick={handleLoad}
            className="bg-slate-700 hover:bg-slate-700 border-0 gap-2 text-foreground"
          >
            Load
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-slate-700 rounded-md border border-zinc-800">
          <span className="text-sm text-muted-foreground truncate flex-1 font-mono">
            {url}
          </span>
          <button
            onClick={handleCopy}
            className="shrink-0 text-muted-foreground hover transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
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
  const [id, setId] = useState("238");
  const [type, setType] = useState("movie");
  const [season, setSeason] = useState("1");
  const [episode, setEpisode] = useState("1");
  const [iframeKey, setIframeKey] = useState(0);
  const [url, setUrl] = useState("/player/movie/238");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("custom");

  const fullUrl = `https://zxcstream.xyz${url}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buildUrl = () =>
    type === "tv"
      ? `/player/tv/${id}/${season}/${episode}`
      : `/player/movie/${id}`;

  const handleLoad = () => {
    if (!id) return;
    setUrl(buildUrl());
    setIframeKey((k) => k + 1);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-700"
      style={{
        background: `linear-gradient(to bottom,rgba(16, 29, 43,0.5), var(--background) 40%, var(--background))`,
      }}
    >
      <div className="absolute inset-x-0 top-0 flex justify-center items-center p-6">
        <div className="flex flex-wrap gap-6 lg:gap-8 lg:text-lg font-medium text-sm">
          <div className="flex-1 text-center text-muted-foreground">
            zxcprime.icu
          </div>{" "}
          <div className="flex-1 text-center text-muted-foreground">
            zxcstream.pro
          </div>{" "}
          <div className="flex-1 text-center">zxcstream.xyz</div>
        </div>
      </div>

      {/* Hero Branding */}
      <div className="flex flex-col items-center justify-center pt-36 pb-20 px-4 text-center select-none">
        <div className="flex items-center gap-3 mb-4">
          <h1
            style={{
              textShadow: "1px 1px 1px rgba(0,0,0,0.2)",
            }}
            className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
          >
            <motion.span
              className="bg-linear-to-r from-[rgb(237,236,233)] via-[rgb(94,84,72)] to-[rgb(172,149,119)] bg-clip-text text-transparent"
              style={{
                backgroundSize: "200% 200%",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
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
        {/* Tab Switcher */}
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-center mx-auto gap-1 p-1 bg-zinc-900 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("custom")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "custom"
                  ? "bg-slate-700 shadow-md"
                  : "text-zinc-400 hover"
              }`}
            >
              <Sliders className="w-4 h-4" />
              Custom Player
            </button>
            <button
              onClick={() => setActiveTab("builtin")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "builtin"
                  ? "bg-slate-700 shadow-md"
                  : "text-zinc-400 hover"
              }`}
            >
              <Tv2 className="w-4 h-4" />
              Built-in Player
            </button>
          </div>
        </div>

        {/* Custom Player Tab */}
        {activeTab === "custom" && (
          <>
            {/* URL Builder */}
            <div className="w-full max-w-4xl">
              <p className="text-sm text-zinc-500 uppercase tracking-widest mb-3">
                Player URL
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-zinc-500 text-base">
                  zxcstream.xyz/player/
                </span>

                <Select onValueChange={(v) => setType(v)} defaultValue="movie">
                  <SelectTrigger className="w-[110px] bg-zinc-800 border-zinc-700 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectGroup>
                      <SelectItem value="movie">movie</SelectItem>
                      <SelectItem value="tv">tv</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <span className="text-zinc-500">/</span>

                <Input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="ID"
                  className="w-25 bg-zinc-800 border-zinc-700 placeholder:text-muted-foreground"
                />

                {type === "tv" && (
                  <>
                    <span className="text-zinc-500">/</span>
                    <Input
                      value={season}
                      onChange={(e) => setSeason(e.target.value)}
                      placeholder="S"
                      className="w-16 bg-zinc-800 border-zinc-700 placeholder:text-muted-foreground"
                    />
                    <span className="text-zinc-500">/</span>
                    <Input
                      value={episode}
                      onChange={(e) => setEpisode(e.target.value)}
                      placeholder="EP"
                      className="w-16 bg-zinc-800 border-zinc-700 placeholder:text-muted-foreground"
                    />
                  </>
                )}

                <Button
                  onClick={handleLoad}
                  className="bg-slate-700 hover:bg-slate-700 border-0 gap-2 text-foreground"
                >
                  Load
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-card rounded-md ">
                <span className="text-sm text-muted-foreground truncate flex-1 font-mono">
                  {fullUrl}
                </span>
                <button
                  onClick={handleCopy}
                  className="shrink-0 text-muted-foreground hover transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Custom Player iframe */}
            <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black/60">
              <iframe
                key={iframeKey}
                className="h-full w-full"
                src={url}
                allowFullScreen
              />
            </div>

            {/* Params */}
            <div className="w-full max-w-4xl space-y-5">
              <p className="text-sm text-zinc-500 uppercase tracking-widest">
                Query Parameters
              </p>
              {DEFAULT_PARAMS.map(({ key, label, desc, example }) => (
                <div
                  key={key}
                  className="space-y-1 pb-5 border-b border-zinc-800 last:border-0"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-sm font-semibold font-mono">
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
              className="w-full max-w-4xl flex justify-between w-full lg:flex-row flex-col  items-center gap-3"
            >
              <h1 className="text-lg font-semibold">Join our community!</h1>
              <div className="flex gap-6">
                <span className="flex items-center gap-3">
                  {/* <IconBrandTelegram
                    size={24}
                    color="#0088CC"
                    strokeWidth={1.5}
                  /> */}
                  <Link target="_blank" href={"https://t.me/+AZZmZ7-_SFsxM2M9"}>
                    <span className="text-sm hover:underline">Telegram</span>
                  </Link>
                </span>
                <span className="flex items-center gap-3">
                  {/* <IconBrandDiscordFilled
                    size={24}
                    color="#7289DA"
                    strokeWidth={1.5}
                  /> */}
                  <Link target="_blank" href={"https://discord.gg/yv7wJV97Jd"}>
                    <span className="text-sm hover:underline">Discord</span>
                  </Link>
                </span>
              </div>
            </motion.div>
          </>
        )}

        {/* Built-in Player Tab */}
        {activeTab === "builtin" && <BuiltinPlayer />}
      </div>
    </div>
  );
}
