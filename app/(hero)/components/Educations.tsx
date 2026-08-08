import { AnimatedSection } from "@/components/ui/animated-reveal";
import React from "react";
import logoUI from "../../../components/assets/ui.png";
import logoRICCI from "../../../components/assets/ricci.png";

export interface EducationItem {
  id?: string;
  institution: string;
  field: string;
  logoUrl?: string;
  link?: string;
}

const defaultEducations: EducationItem[] = [
  {
    id: "1",
    institution: "Universitas Indonesia",
    field: "Computer Science // 2024-2028",
    logoUrl: logoUI.src,
    link: "https://www.ui.ac.id/",
  },
  {
    id: "2",
    institution: "SMA Katolik RICCI 1",
    field: "IPA // 2021-2024",
    logoUrl: logoRICCI.src,
    link: "https://smaricci1.sekolahricci.sch.id/",
  },
];

function Educations({ items }: { items?: EducationItem[] }) {
  const eduList = Array.isArray(items) ? items : defaultEducations;

  if (Array.isArray(items) && items.length === 0) {
    return null;
  }

  return (
    <div>
      <AnimatedSection>
        <h1 className="font-black text-3xl sm:text-4xl underline underline-offset-4 decoration-cyan-400 my-16">
          My Education
        </h1>
      </AnimatedSection>
      <ul>
        {eduList.map((edu, index) => (
          <AnimatedSection key={edu.id || index}>
            <li
              onClick={() => {
                if (edu.link) window.open(edu.link, "_blank");
              }}
              className="cursor-pointer hover:border-cyan-200 dark:bg-black dark:hover:border-cyan-400 flex flex-col lg:flex-row justify-start items-center gap-6 w-full bg-white border-4 border-cyan-400 px-8 sm:px-16 py-8 my-4 rounded-3xl transition"
            >
              <img
                draggable="false"
                src={edu.logoUrl || logoUI.src}
                alt={edu.institution}
                className="w-20 h-20 object-contain rounded-full"
              />
              <div className="flex-col items-center justify-center">
                <h2 className="font-black text-md sm:text-xl">
                  {edu.institution}
                </h2>
                <h3 className="font-bold text-black dark:text-white opacity-40 text-xs sm:text-sm mb-4">
                  {edu.field}
                </h3>
              </div>
            </li>
          </AnimatedSection>
        ))}
      </ul>
    </div>
  );
}

export default Educations;
