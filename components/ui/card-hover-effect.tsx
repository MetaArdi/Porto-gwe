"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { IconType } from "react-icons/lib";

export type Project = {
  title: string;
  description: string;
  link: string;
  image?: any;
  imageUrl?: string;
  githubLink?: string;
  icons?: Array<{
    icon?: IconType;
    link?: string;
  }>;
};

export const HoverEffect = ({
  items,
  className,
}: {
  items: Project[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 py-10", className)}>
      {items.map((item, idx) => {
        const imgSrc = typeof item.image === "string" 
          ? item.image 
          : item.image?.src || item.imageUrl || "/assets/beautyweb.png";

        return (
          <Link
            target="_blank"
            href={item.link || "#"}
            key={item.link || idx}
            className="relative group block p-2 h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-cyan-200 dark:bg-cyan-400 dark:bg-opacity-80 block rounded-3xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <Card className="">
              <CardImage src={imgSrc} alt={item.title} />
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
              {item.icons && item.icons.length > 0 && <CardIcons icons={item.icons} />}
              <div className="flex justify-between pt-6">
                <button className="z-10 px-6 py-2 bg-opacity-0 border-2 border-cyan-400 bg-white dark:bg-black transition-colors duration-500 ease-in-out hover:bg-cyan-400 dark:hover:bg-cyan-400 text-black dark:text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer">
                  Demo
                </button>
                {item.githubLink && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      window.open(item.githubLink, "_blank");
                    }}
                    className="flex items-center gap-2 z-10 px-6 py-2 border-2 border-black dark:border-white dark:bg-white bg-black transition-colors duration-500 ease-in-out hover:bg-white dark:hover:bg-black dark:text-black dark:hover:text-white text-white hover:text-black font-bold rounded-xl text-xs sm:text-sm cursor-pointer"
                  >
                    <FaGithub /> <h1>Github Page</h1>
                  </div>
                )}
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-white dark:bg-black border-2 border-cyan-400 group-hover:border-black relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardImage = ({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) => {
  return (
    <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "font-black text-xl sm:text-2xl underline underline-offset-4 decoration-cyan-400 tracking-wide mt-4",
        className
      )}
    >
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "font-black text-xs sm:text-sm mt-8 text-neutral-600 dark:text-neutral-300 tracking-wide leading-relaxed",
        className
      )}
    >
      {children}
    </p>
  );
};

export const CardIcons = ({
  icons,
}: {
  icons: Array<{ icon?: any; link?: string }>;
}) => {
  return (
    <div className="flex mt-4 gap-2 space-x-2">
      {icons.map((iconData, index) => {
        if (!iconData.icon) return null;
        const IconComponent = iconData.icon;
        return (
          <div
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (iconData.link) window.open(iconData.link, "_blank");
            }}
            className="text-cyan-400 hover:text-cyan-200 transition-colors cursor-pointer"
          >
            <IconComponent size={30} />
          </div>
        );
      })}
    </div>
  );
};
