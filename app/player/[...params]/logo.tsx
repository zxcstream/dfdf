import { MovieTypes } from "@/types/types";
import { motion } from "framer-motion";

export default function LoadingMetadata({ logo }: { logo: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0   overflow-hidden pointer-events-none"
    >
      <div className="absolute left-[5%] -translate-x-[5%] sm:bottom-[10%] top-[50%] lg:top-[unset] sm:-translate-y-[10%] -translate-y-[50%] lg:max-w-md max-w-sm h-60 w-full   flex justify-center items-center ">
        <img
          className="object-contain object-left h-full w-full drop-shadow-sm"
          src={`https://image.tmdb.org/t/p/w780/${logo}`}
          alt=""
        />
      </div>
    </motion.div>
  );
}
