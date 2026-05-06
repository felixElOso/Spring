"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const HEADSHOT_COUNT = 36

export function WelcomeMosaic() {
  return (
    <div className="grid grid-cols-6 grid-rows-6 gap-3 p-8 w-full h-full">
      {Array.from({ length: HEADSHOT_COUNT }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: i * 0.02,
            ease: "easeOut",
          }}
          className="relative overflow-hidden rounded-[10px]"
        >
          <Image
            src={`/headshots/headshot-${i + 1}.jpg`}
            alt=""
            fill
            className="object-cover"
            sizes="134px"
          />
        </motion.div>
      ))}
    </div>
  )
}
