import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdStore {
  lastAdTime: number;
  triggerAd: () => void;
}

export const useAdStore = create<AdStore>()(
  persist(
    (set, get) => ({
      lastAdTime: 0,
      triggerAd: () => {
        const now = Date.now();
        const fiveMinutes = 10 * 60 * 1000;
        const minutesPassed = (now - get().lastAdTime) / 1000 / 60;

        console.log(
          `Minutes passed since last ad: ${minutesPassed.toFixed(2)} min`,
        );
        if (now - get().lastAdTime >= fiveMinutes) {
          console.log("Opening ad popup...");
          window.open(
            "https://injusticebakery.com/m1n8h68e?key=a640607f30762b7dd7189c135c77afcd",
            "_blank",
          );
          set({ lastAdTime: now });
        } else {
          console.log("Not enough time has passed. Ad will not open.");
        }
      },
    }),
    {
      name: "ad-store",
      storage: {
        getItem: (key) => {
          const item = sessionStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        },
        setItem: (key, value) =>
          sessionStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => sessionStorage.removeItem(key),
      },
    },
  ),
);
