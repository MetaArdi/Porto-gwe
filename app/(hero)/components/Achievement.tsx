"use client";
import { AnimatedSection } from "@/components/ui/animated-reveal";
import React from "react";
import osnLogo from "../../../components/assets/OSN.jpg";
import unpar from "../../../components/assets/unpar.png";
import bnpchs from "../../../components/assets/bnpchs.png";
import schem from "../../../components/assets/schematics.jpg";
import toki from "../../../components/assets/Toki.jpg";

export interface AchievementItem {
  id?: string;
  title: string;
  organization: string;
  logoUrl?: string;
  link?: string;
}

const defaultAchievements: AchievementItem[] = [
  {
    id: "1",
    title: "Medali Perunggu Olimpiade Sains Nasional Informatika 2024",
    organization: "Kemendikbudristek",
    logoUrl: osnLogo.src,
    link: "https://osn.toki.id/statistik/peserta/1503",
  },
  {
    id: "2",
    title: "3rd Place CHIPS 2022",
    organization: "Universitas Katolik Parahyangan",
    logoUrl: unpar.src,
    link: "https://informatika.unpar.ac.id/chips/chips-2022/",
  },
  {
    id: "3",
    title: "Finalis BNPCHS 2023",
    organization: "Bina Nusantara University",
    logoUrl: bnpchs.src,
    link: "https://competition.binus.ac.id/bnpchs2023/",
  },
  {
    id: "4",
    title: "Finalis Schematics 2023",
    organization: "ITS",
    logoUrl: schem.src,
    link: "https://schematics-its.com/",
  },
  {
    id: "5",
    title: "National Training Stage 2 for IOI",
    organization: "Kemendikbud",
    logoUrl: toki.src,
    link: "https://osn.toki.id/statistik/peserta/1503",
  },
];

function Achievement({ items }: { items?: AchievementItem[] }) {
  const achList = Array.isArray(items) ? items : defaultAchievements;

  if (Array.isArray(items) && items.length === 0) {
    return null;
  }

  return (
    <div className="py-24">
      <AnimatedSection>
        <h1 className="font-black text-3xl sm:text-4xl underline underline-offset-4 decoration-cyan-400 pb-16">
          My Achievement
        </h1>
      </AnimatedSection>

      <ul className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {achList.map((ach, index) => (
          <AnimatedSection key={ach.id || index}>
            <li
              onClick={() => {
                if (ach.link) window.open(ach.link, "_blank");
              }}
              className="cursor-pointer dark:bg-black hover:border-cyan-200 dark:hover:border-cyan-400 flex flex-col justify-center text-center items-center gap-4 h-60 bg-white border-4 border-cyan-400 px-6 py-6 rounded-3xl transition"
            >
              <img
                draggable="false"
                src={ach.logoUrl || toki.src}
                alt={ach.title}
                className="w-16 h-16 object-contain rounded-full"
              />
              <div className="flex-col items-center justify-center">
                <h2 className="font-black text-sm sm:text-md leading-tight">
                  {ach.title}
                </h2>
                <h3 className="font-bold text-black opacity-40 text-xs dark:text-white mt-1">
                  {ach.organization}
                </h3>
              </div>
            </li>
          </AnimatedSection>
        ))}
      </ul>
    </div>
  );
}

export default Achievement;
