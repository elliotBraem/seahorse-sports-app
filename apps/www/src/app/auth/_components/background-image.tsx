'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export function BackgroundImage() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    // Add a dark background color that matches the image tone
    <div className="relative w-full h-full bg-gray-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="relative w-full h-full"
      >
        <Image
          src="https://images.unsplash.com/photo-1556816214-6d16c62fbbf6?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Stadium at Night Background"
          fill
          priority
          className="object-cover blur-sm"
          unoptimized
          onLoad={() => setIsLoaded(true)}
        />
      </motion.div>
    </div>
  );
}
