"use client";

import React, { useState } from "react";
import { AnimatedSection } from "@/components/ui/animated-reveal";
import { FaReact, FaGithub, FaPython } from "react-icons/fa";
import { FaCss3Alt } from "react-icons/fa6";
import { DiHtml5 } from "react-icons/di";
import { IoLogoJavascript } from "react-icons/io5";
import { SiExpress, SiMongodb, SiNextdotjs, SiTypescript, SiTailwindcss, SiCplusplus } from "react-icons/si";
import { RiNodejsLine } from "react-icons/ri";

export interface TechStackItem {
  id?: string;
  name: string;
  category?: string;
  iconName?: string;
  iconUrl?: string;
}

const iconMap: { [key: string]: any } = {
  FaReact,
  SiNextdotjs,
  SiTypescript,
  IoLogoJavascript,
  SiTailwindcss,
  RiNodejsLine,
  SiExpress,
  SiMongodb,
  DiHtml5,
  FaCss3Alt,
  SiCplusplus,
  FaGithub,
  FaPython,
};

export const defaultTechStack: TechStackItem[] = [
  { id: "1", name: "React", category: "Frontend", iconName: "FaReact", iconUrl: "/assets/react.png" },
  { id: "2", name: "Next.js", category: "Framework", iconName: "SiNextdotjs", iconUrl: "/assets/next.png" },
  { id: "3", name: "TypeScript", category: "Language", iconName: "SiTypescript", iconUrl: "/assets/tslogo.png" },
  { id: "4", name: "JavaScript", category: "Language", iconName: "IoLogoJavascript", iconUrl: "/assets/jslogo.png" },
  { id: "5", name: "Tailwind CSS", category: "Styling", iconName: "SiTailwindcss", iconUrl: "/assets/css.png" },
  { id: "6", name: "Node.js", category: "Backend", iconName: "RiNodejsLine", iconUrl: "/assets/node.png" },
  { id: "7", name: "Express.js", category: "Backend", iconName: "SiExpress", iconUrl: "/assets/express.png" },
  { id: "8", name: "MongoDB", category: "Database", iconName: "SiMongodb", iconUrl: "/assets/mongo.png" },
  { id: "9", name: "HTML5", category: "Frontend", iconName: "DiHtml5", iconUrl: "/assets/html.jpg" },
  { id: "10", name: "CSS3", category: "Styling", iconName: "FaCss3Alt", iconUrl: "/assets/css.png" },
  { id: "11", name: "C++", category: "Competitive Programming", iconName: "SiCplusplus", iconUrl: "/assets/cpp.png" },
  { id: "12", name: "Python", category: "Language", iconName: "FaPython", iconUrl: "/assets/python.jpg" },
];

function TechStack({ items }: { items?: TechStackItem[] }) {
  const stackList = Array.isArray(items) ? items : defaultTechStack;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (Array.isArray(items) && items.length === 0) {
    return null;
  }

  const categories = ["All", ...Array.from(new Set(stackList.map((i) => i.category || "General").filter(Boolean)))];

  const filteredItems = selectedCategory === "All"
    ? stackList
    : stackList.filter((i) => (i.category || "General") === selectedCategory);

  return (
    <div className="py-16">
      <AnimatedSection>
        <h1 className="font-black text-3xl sm:text-4xl underline underline-offset-4 decoration-cyan-400 mb-8">
          My Tech Stack
        </h1>
      </AnimatedSection>

      {/* Category Filter Pills */}
      <AnimatedSection>
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition duration-300 ${
                selectedCategory === cat
                  ? "bg-cyan-400 text-black shadow-lg shadow-cyan-500/20"
                  : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-800 hover:border-cyan-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Tech Stack Cards Grid */}
      <AnimatedSection>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredItems.map((tech, idx) => {
            const IconComp = tech.iconName && iconMap[tech.iconName] ? iconMap[tech.iconName] : null;

            return (
              <div
                key={tech.id || idx}
                className="group relative flex flex-col items-center justify-center p-6 bg-white dark:bg-black border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl hover:border-cyan-400 dark:hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.25)] transition-all duration-300 hover:-translate-y-1 cursor-default"
              >
                <div className="w-12 h-12 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
                  {tech.iconUrl ? (
                    <img
                      src={tech.iconUrl}
                      alt={tech.name}
                      className="w-10 h-10 object-contain"
                    />
                  ) : IconComp ? (
                    <IconComp className="text-3xl text-cyan-400" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-cyan-400/20 text-cyan-400 font-bold flex items-center justify-center text-sm">
                      {tech.name.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100 text-center">
                  {tech.name}
                </h3>

                {tech.category && (
                  <span className="mt-1 text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    {tech.category}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </AnimatedSection>
    </div>
  );
}

export default TechStack;
