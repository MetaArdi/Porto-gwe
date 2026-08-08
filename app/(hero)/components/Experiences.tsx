"use client";
import React from "react";
import logoPPSN from "../../../components/assets/ppsn.png";
import logoTOKI from "../../../components/assets/Toki.jpg";
import { AnimatedSection } from "@/components/ui/animated-reveal";

export interface ExperienceItem {
  id?: string;
  role: string;
  organization: string;
  description: string;
  logoUrl?: string;
  link?: string;
}

const defaultExperiences: ExperienceItem[] = [
  {
    id: "1",
    role: "Competitive Programming Problemsetting",
    organization: "Perhimpunan Pelajar Sains Nasional - 2024",
    description: "Successfully managed and created challenging tasks for the Informatics Olympiad (Competitive Programming) Try-out , organized by PPSN.",
    logoUrl: logoPPSN.src,
    link: "https://www.ppsnindonesia.com/",
  },
  {
    id: "2",
    role: "Competitive Programming Olympiad Preparation Supervising",
    organization: "Ikatan Alumni Tim Olimpiade Komputer Indonesia - 2024",
    description: "Managed tasks, created editorial content, and helped OSN finalists learn more for the Competitive Programming Olympiad preparation with Ikatan Alumni Tim Olimpiade Komputer Indonesia.",
    logoUrl: logoTOKI.src,
    link: "https://alumni.toki.id/",
  },
];

function Experiences({ items }: { items?: ExperienceItem[] }) {
  const expList = Array.isArray(items) ? items : defaultExperiences;

  if (Array.isArray(items) && items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-full">
      <AnimatedSection>
        <h1 className="font-black text-3xl sm:text-4xl underline underline-offset-4 decoration-cyan-400 my-12">
          My Experiences
        </h1>
      </AnimatedSection>

      <div>
        <ul>
          {expList.map((exp, index) => (
            <AnimatedSection key={exp.id || index}>
              <li
                onClick={() => {
                  if (exp.link) window.open(exp.link, "_blank");
                }}
                className="cursor-pointer hover:border-cyan-200 dark:hover:border-cyan-400 flex flex-col lg:flex-row justify-start items-center gap-6 w-full bg-white dark:bg-black border-4 border-cyan-400 px-8 sm:px-16 py-8 my-4 rounded-3xl transition"
              >
                <img
                  draggable="false"
                  src={exp.logoUrl || logoPPSN.src}
                  alt={exp.organization}
                  className="w-20 h-20 object-contain rounded-full"
                />
                <div>
                  <h2 className="font-black dark:text-white text-md sm:text-xl">
                    {exp.role}
                  </h2>
                  <h3 className="font-bold text-black dark:text-white opacity-40 text-xs sm:text-sm mb-4">
                    {exp.organization}
                  </h3>
                  <p className="text-xs leading-relaxed">{exp.description}</p>
                </div>
              </li>
            </AnimatedSection>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Experiences;
