import { ServerTypes } from "@/types/player-types";

export const initialServers: ServerTypes[] = [
  {
    name: "Icarus I",
    server: "icarus",
    status: "queue",
    desc: "Vast Collection",
  },

  {
    name: "Atlas V2",
    server: "atlas_v2",
    status: "queue",
    desc: "Fixes Media Mismatch",
  },
  {
    name: "Atlas II",
    server: "atlas",
    status: "queue",
    desc: "4K Support & Multi Audio",
  },
  {
    name: "Thanatos III",
    server: "thanatos",
    status: "queue",
    desc: " Alternative",
  },
  {
    name: "Orion IV",
    server: "orion",
    status: "queue",
    desc: "Built-In Subtitle",
  },

  // {
  //   name: "Lazarus (NEW)",
  //   server: "lazarus",
  //   status: "queue",
  //   desc: "Alternative",
  // },

  // {
  //   name: "Daedalus V",
  //   server: "daedalus",
  //   status: "queue",
  //   desc: "Multi Audio Support",
  // },

  // {
  //   name: "Talos VII",
  //   server: "talos",
  //   status: "queue",
  //   desc: "Spanish Audio",
  // },
];
