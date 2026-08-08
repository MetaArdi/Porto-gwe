"use client";
import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const FlipWords = ({
  words,
  duration = 2000,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) => {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const startAnimation = useCallback(() => {
    if (!words || words.length === 0) return;
    setIndex((prevIndex) => (prevIndex + 1) % words.length);
    setIsAnimating(true);
  }, [words]);

  useEffect(() => {
    if (!words || words.length === 0) return;
    if (!isAnimating) {
      const timer = setTimeout(() => {
        startAnimation();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration, startAnimation, words]);

  // Keep index within bounds if words array changes
  useEffect(() => {
    if (words && index >= words.length) {
      setIndex(0);
    }
  }, [words, index]);

  const currentWord = words && words.length > 0 ? words[index % words.length] : "";

  if (!currentWord) return null;

  return (
    <AnimatePresence
      onExitComplete={() => {
        setIsAnimating(false);
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
        }}
        exit={{
          opacity: 0,
          y: -10,
          x: 10,
          filter: "blur(8px)",
          scale: 1.1,
          position: "absolute",
        }}
        className={cn("z-10 text-left text-cyan-400 inline-block", className)}
        key={`${currentWord}-${index}`}
      >
        {currentWord.split(" ").map((letter, letterIdx) => (
          <motion.span
            key={currentWord + letterIdx}
            initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: letterIdx * 0.08,
              duration: 0.4,
            }}
            className="inline-block"
          >
            {letter}&nbsp;
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
