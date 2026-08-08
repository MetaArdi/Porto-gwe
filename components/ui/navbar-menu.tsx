"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
  onClick,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) => {
  const handleClick = () => {
    setActive(item);
    if (onClick) onClick();
  };
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-sm sm:text-lg text-black dark:text-white font-bold"
        onClick={handleClick}
      >
        {item === "icon" ? (
          <span className="flex justify-center mt-0.5 md:mt-1 mr-5">
            <MdLightMode className="absolute dark:scale-0 scale-100" />
            <MdDarkMode className="absolute dark:scale-100 scale-0" />
          </span>
        ) : (
          <span className="cursor-pointer text-sm sm:text-lg text-black hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-1 before:z-0 before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-cyan-400 before:absolute before:left-0 before:-bottom-2 dark:text-white font-bold">
            {item}
          </span>
        )}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4 z-50">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white dark:bg-black backdrop-blur-md rounded-2xl overflow-hidden border border-black/[0.2] dark:border-cyan-400/40 shadow-2xl shadow-cyan-500/10"
              >
                <motion.div
                  layout
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full dark:bg-black bg-white shadow-input flex justify-center space-x-4 px-8 py-6"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link
      href={href && href !== "" ? href : "#"}
      target={href && href !== "" ? "_blank" : undefined}
      className="flex flex-row items-center gap-4 p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition group border border-transparent hover:border-cyan-400/40 w-full"
    >
      <div className="w-28 h-18 sm:w-32 sm:h-20 shrink-0 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950 shadow-md relative">
        <img
          src={src}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-white group-hover:text-cyan-400 transition line-clamp-1">
          {title}
        </h4>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
      {...rest}
      target="_blank"
      className="text-neutral-700 dark:text-neutral-200 hover:text-cyan-400 flex justify-between items-center transition"
    >
      {children}
    </Link>
  );
};
