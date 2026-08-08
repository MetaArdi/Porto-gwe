"use client";

import { FlipWords } from "@/components/ui/flip-words";
import { Button } from "@/components/ui/moving-border";
import React from "react";

export interface AboutData {
  name: string;
  fullName: string;
  birthYear: string;
  words: string[];
  bio: string;
  cvUrl: string;
  avatarUrl?: string;
  avatarAspectRatio?: "3/4" | "4/5" | "1/1" | "auto";
  avatarFit?: "cover" | "contain";
  avatarPosition?: "top" | "center" | "bottom";
  avatarSize?: "small" | "medium" | "large";
}

const defaultWords = [
  "Software Engineer",
  "Graphic Designer",
  "Competitive Programmer",
  "Problem Solver",
  "Fullstack Developer",
  "Lifelong Learner",
  "Web Developer",
];

function About({
  OnSectionClick,
  data,
}: {
  OnSectionClick: (section: string) => void;
  data?: AboutData;
}) {
  const name = data?.name || "Meta Ardi Setiawan";
  const words = data?.words && data.words.length > 0 ? data.words : defaultWords;
  const bio = data?.bio || "Hi, my name is Meta Ardi Setiawan! I have a strong passion for programming and software engineering.";
  const cvUrl = data?.cvUrl || "#";
  const avatarUrl = data?.avatarUrl || "/uploads/1786141730791-IMG_20260731_014555.png";

  const aspectRatioClass = 
    data?.avatarAspectRatio === "1/1" ? "aspect-[1/1]" :
    data?.avatarAspectRatio === "4/5" ? "aspect-[4/5]" :
    data?.avatarAspectRatio === "auto" ? "h-auto" :
    "aspect-[3/4]"; // Default 3:4 portrait like official passport photos!

  const sizeClass = 
    data?.avatarSize === "small" ? "w-48 sm:w-56" :
    data?.avatarSize === "large" ? "w-64 sm:w-80" :
    "w-56 sm:w-72"; // Default medium

  const fitClass = data?.avatarFit === "contain" ? "object-contain" : "object-cover";

  const positionClass = 
    data?.avatarPosition === "bottom" ? "object-bottom" :
    data?.avatarPosition === "center" ? "object-center" :
    "object-top"; // Default top focus for headshot photos!

  return (
    <div className="min-h-full mt-24 mb-32">
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10">
        {/* Left Side: Avatar Profile Photo Frame */}
        <div className="relative group shrink-0">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-sky-300 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <div className={`relative ${sizeClass} ${aspectRatioClass} rounded-3xl overflow-hidden border-4 border-cyan-400 bg-neutral-100 dark:bg-neutral-900 shadow-2xl shadow-cyan-500/20`}>
            <img
              src={avatarUrl}
              alt={name}
              className={`w-full h-full ${fitClass} ${positionClass} group-hover:scale-105 transition-transform duration-500`}
            />
          </div>
        </div>

        {/* Right Side: Text & Actions */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="font-black text-4xl sm:text-6xl lg:text-7xl">{name}</h1>
          <FlipWords
            className="font-medium text-xl sm:text-3xl lg:text-4xl mt-3 text-cyan-400 dark:text-cyan-300"
            words={words}
          />
          <p className="pt-6 mb-10 text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
            {bio}
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4">
            <Button
              borderRadius="1.75rem"
              className="bg-white font-black hover:bg-cyan-400 hover:text-black transition dark:bg-black text-black dark:text-white border-neutral-200 dark:border-neutral-600"
              onClick={() => {
                window.open(cvUrl, "_blank");
              }}
            >
              My CV
            </Button>
            <button
              onClick={() => OnSectionClick("Contacts")}
              className="h-16 w-36 font-black text-sm bg-cyan-400 text-black hover:bg-cyan-300 border border-cyan-400 hover:opacity-90 rounded-[1.75rem] transition duration-200 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
