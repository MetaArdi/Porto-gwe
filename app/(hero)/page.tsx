"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import About from "./components/About";
import TechStack from "./components/TechStack";
import { TracingBeam } from "@/components/ui/tracing-beam";
import Projects from "./components/Projects";
import { AnimatedSection } from "@/components/ui/animated-reveal";
import Experiences from "./components/Experiences";
import Achievement from "./components/Achievement";
import Contacts from "./components/Contacts";
import Educations from "./components/Educations";
import { DynamicHead } from "@/components/DynamicHead";

function Page() {
  const AboutRef = useRef<HTMLDivElement>(null);
  const TechStackRef = useRef<HTMLDivElement>(null);
  const ProjectsRef = useRef<HTMLDivElement>(null);
  const ExperiencesRef = useRef<HTMLDivElement>(null);
  const AchievementRef = useRef<HTMLDivElement>(null);
  const ContactsRef = useRef<HTMLDivElement>(null);
  const EducationsRef = useRef<HTMLDivElement>(null);

  const [portfolioData, setPortfolioData] = useState<any>(null);

  const loadPortfolioData = useCallback(() => {
    fetch("/api/portfolio", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setPortfolioData(data);
        }
      })
      .catch((err) => console.error("Error loading portfolio data:", err));
  }, []);

  useEffect(() => {
    loadPortfolioData();

    // Re-fetch when user switches back to this tab from Admin Dashboard
    const handleFocus = () => {
      loadPortfolioData();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [loadPortfolioData]);

  const ScrollToSection = (section: string) => {
    const RefMap: { [key: string]: React.RefObject<HTMLDivElement> } = {
      About: AboutRef,
      TechStack: TechStackRef,
      Projects: ProjectsRef,
      Experiences: ExperiencesRef,
      Education: EducationsRef,
      Achievement: AchievementRef,
      Contacts: ContactsRef,
    };

    const Ref = RefMap[section]?.current;
    if (Ref) {
      const offset = 180;
      const top = Ref.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen dark:bg-black bg-white overflow-hidden dark:bg-grid-white/[0.09] bg-grid-black/[0.05]">
      <DynamicHead siteSettings={portfolioData?.siteSettings} about={portfolioData?.about} />
      <div className="max-w-xs sm:max-w-sm mx-auto xl:max-w-5xl lg:max-w-3xl">
        <TracingBeam className="">
          <Navbar OnSectionClick={ScrollToSection} data={portfolioData} />
          <div className="pt-40 max-w-7xl">
            {/* Main Content */}
            <AnimatedSection>
              <div ref={AboutRef}>
                <About OnSectionClick={ScrollToSection} data={portfolioData?.about} />
              </div>
            </AnimatedSection>

            {/* My Tech Stack Section (Above Projects) */}
            <div ref={TechStackRef}>
              <TechStack items={portfolioData?.techStack} />
            </div>

            <div ref={ProjectsRef}>
              <Projects items={portfolioData?.projects} />
            </div>

            <div ref={ExperiencesRef}>
              <Experiences items={portfolioData?.experiences} />
            </div>

            <div ref={EducationsRef}>
              <Educations items={portfolioData?.educations} />
            </div>

            <div ref={AchievementRef}>
              <Achievement items={portfolioData?.achievements} />
            </div>

            <div ref={ContactsRef}>
              <Contacts data={portfolioData?.contacts} />
            </div>
          </div>
        </TracingBeam>
      </div>
    </div>
  );
}

export default Page;
