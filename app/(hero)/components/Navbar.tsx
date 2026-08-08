"use client";

import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FaGithub } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Navbar({
  OnSectionClick,
  data,
}: {
  OnSectionClick: (section: string) => void;
  data?: any;
}) {
  const [active, setActive] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const brandName = data?.siteSettings?.brandName || data?.about?.name || "Meta Ardi Setiawan";
  const instagram = data?.contacts?.instagram || "https://instagram.com/metaardi_";
  const github = data?.contacts?.github || "https://github.com/MetaArdi";
  const linkedin = data?.contacts?.linkedin || "https://linkedin.com/in/metaardi";
  const projects = data?.projects || [];

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <div
      className={cn(
        "fixed top-16 inset-x-0 max-w-sm sm:max-w-xl mx-auto z-50 border border-cyan-400 rounded-full flex justify-evenly dark:bg-black bg-white transition-transform duration-300 shadow-lg shadow-cyan-500/10",
        showNavbar ? "transform-y-0" : "translate-y-[-300%]"
      )}
    >
      <Menu setActive={setActive}>
        <MenuItem
          setActive={setActive}
          active={active}
          item="icon"
          onClick={() => {
            theme === "light" ? setTheme("dark") : setTheme("light");
          }}
        >
          <div className="flex flex-col space-y-4 text-sm">
            <div className="cursor-pointer" onClick={() => setTheme("light")}>
              Light
            </div>
            <div className="cursor-pointer" onClick={() => setTheme("dark")}>
              Dark
            </div>
          </div>
        </MenuItem>{" "}
        <div className="mr-5 sm:mr-10">
          <MenuItem
            setActive={setActive}
            active={active}
            item={brandName}
            onClick={() => OnSectionClick("Contacts")}
          >
            <div className="flex flex-col space-y-4 text-sm items-start">
              <HoveredLink href={instagram}>
                <div className="mr-1">
                  <AiFillInstagram />
                </div>
                Instagram
              </HoveredLink>
              <HoveredLink href={github}>
                <div className="mr-1">
                  <FaGithub />
                </div>
                Github
              </HoveredLink>
              <HoveredLink href={linkedin}>
                <div className="mr-1">
                  <FaLinkedinIn />
                </div>
                LinkedIn
              </HoveredLink>
            </div>
          </MenuItem>
        </div>

        <MenuItem
          setActive={setActive}
          active={active}
          item="Projects"
          onClick={() => OnSectionClick("Projects")}
        >
          {projects.length > 0 ? (
            <div className="flex flex-col gap-2 p-1 max-h-96 overflow-y-auto w-[310px] sm:w-[400px]">
              {projects.slice(0, 6).map((proj: any, idx: number) => (
                <ProductItem
                  key={proj.id || idx}
                  title={proj.title}
                  href={proj.link || "#"}
                  src={proj.imageUrl || "/assets/beautyweb.png"}
                  description={proj.description || ""}
                />
              ))}
            </div>
          ) : (
            <div className="p-4 text-xs text-neutral-400">Belum ada project</div>
          )}
        </MenuItem>

        <MenuItem
          setActive={setActive}
          active={active}
          item="About"
          onClick={() => OnSectionClick("About")}
        >
          <div className="flex flex-col space-y-4 text-sm">
            <div
              className="cursor-pointer"
              onClick={() => OnSectionClick("About")}
            >
              About Me
            </div>
            <div
              className="cursor-pointer"
              onClick={() => OnSectionClick("TechStack")}
            >
              Tech Stack
            </div>
            <div
              className="cursor-pointer"
              onClick={() => OnSectionClick("Experiences")}
            >
              Experiences
            </div>
            <div
              className="cursor-pointer"
              onClick={() => OnSectionClick("Education")}
            >
              Education
            </div>
            <div
              className="cursor-pointer"
              onClick={() => OnSectionClick("Achievement")}
            >
              Achievement
            </div>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default Navbar;
