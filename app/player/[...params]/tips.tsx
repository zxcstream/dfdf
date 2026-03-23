import { useEffect, useState } from "react";

const tips = [
  "Tip: Stuck on loading? Try switching the server.",
  "Please wait… fetching resources, almost there!",
  "One moment please… good things take time!",
  "Did you know? Refreshing the page can work wonders ✨",
  "Tip: Make sure your internet is stable for the best experience!",
  "Tip: Use ↑ ↓ arrow keys or swipe to navigate servers, press Enter to select.",
  "Tip: 4K movies too dim? Adjust brightness in Settings ☀️",
  "Dive into endless free streaming at zxcstream.icu",
  "Tip: Press Space or K to play/pause anytime.",
  "Tip: Press F to toggle fullscreen.",
  "Tip: Press M to mute/unmute.",
  "Tip: Arrow keys ← → skip backward/forward 15 seconds.",
  "Tip: Try Dual Subtitles to learn a new language while watching",
  "Tip: Use Sleep Timer in Settings to auto-pause after a set time 😴",
  "Tip: Adjust playback speed in Settings for faster or slower viewing.",
];

export default function DynamicTip() {
  const [currentTipIndex, setCurrentTipIndex] = useState(() =>
    Math.floor(Math.random() * tips.length),
  );
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade out
      setTimeout(() => {
        setCurrentTipIndex(Math.floor(Math.random() * tips.length));
        setFade(true);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`absolute lg:bottom-4 bottom-2 max-[340px]:bottom-0 left-1/2 -translate-x-1/2 z-10 text-center max-[340px]:text-[0.5rem] text-sm  md:text-base lg:text-lg transition-opacity duration-500 w-full p-4 max-[340px]:p-0.5 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      {tips[currentTipIndex]}
    </div>
  );
}
