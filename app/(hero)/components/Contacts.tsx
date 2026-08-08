"use client";
import React from "react";
import { AnimatedSection } from "@/components/ui/animated-reveal";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { MdEmail } from "react-icons/md";

export interface ContactData {
  email?: string;
  whatsapp?: string;
  web3formsKey?: string;
  instagram?: string;
  github?: string;
  linkedin?: string;
}

export default function Contacts({ data }: { data?: ContactData }) {
  const email = data?.email || "metaflash55@gmail.com";
  const whatsapp = data?.whatsapp || "62895358055627";
  const instagram = data?.instagram || "https://instagram.com/metaardi_";
  const github = data?.github || "https://github.com/MetaArdi";
  const linkedin = data?.linkedin || "https://www.linkedin.com/in/meta-setiawan-320934265/";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    const waNumber = whatsapp ? whatsapp.replace(/[^0-9]/g, "") : "62895358055627";
    const waMessage = `Halo Meta Ardi,\n\nNama: ${name}\nSubject: ${subject}\n\nPesan:\n${message}`;

    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, "_blank");
    (event.target as HTMLFormElement).reset();
  }

  return (
    <div className="py-8">
      <AnimatedSection>
        <h1 className="font-black text-3xl sm:text-4xl underline underline-offset-4 decoration-cyan-400">
          Contact Me !
        </h1>
      </AnimatedSection>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatedSection>
          <div className="flex flex-col my-12 gap-10 items-start">
            {/* EMAIL ITEM -> CLICK OPENS DIRECT GMAIL COMPOSE */}
            <div
              onClick={() => {
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
                window.open(gmailUrl, "_blank");
              }}
              className="mr-1 hover:opacity-60 cursor-pointer flex justify-center items-center underline underline-offset-2 decoration-cyan-400 font-bold text-2xl gap-3 text-white"
            >
              <MdEmail /> Email
            </div>

            <div
              onClick={() => window.open(instagram, "_blank")}
              className="mr-1 hover:opacity-60 cursor-pointer flex justify-center items-center underline underline-offset-2 decoration-cyan-400 font-bold text-2xl gap-3 text-white"
            >
              <AiFillInstagram /> Instagram
            </div>
            <div
              onClick={() => window.open(github, "_blank")}
              className="mr-1 hover:opacity-60 flex justify-center cursor-pointer items-center underline underline-offset-2 decoration-cyan-400 font-bold text-2xl gap-3 text-white"
            >
              <FaGithub /> Github
            </div>
            <div
              onClick={() => window.open(linkedin, "_blank")}
              className="mr-1 hover:opacity-60 flex cursor-pointer justify-center items-center underline underline-offset-2 decoration-cyan-400 font-bold text-2xl gap-3 text-white"
            >
              <FaLinkedinIn /> LinkedIn
            </div>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              className="rounded-md border-2 border-cyan-400 h-12 px-6 hover:border-black text-black bg-white font-medium"
              placeholder="Your Name"
              type="text"
              name="name"
              required
            />
            <input
              className="rounded-md border-2 border-cyan-400 h-12 px-6 hover:border-black text-black bg-white font-medium"
              placeholder="Subject"
              type="text"
              name="subject"
              required
            />
            <textarea
              className="rounded-md border-2 border-cyan-400 h-36 px-6 py-4 hover:border-black resize-none text-black bg-white font-medium"
              placeholder="Message"
              name="message"
              required
            ></textarea>
            <button
              className="rounded-md bg-cyan-400 text-black font-black hover:opacity-80 h-12 px-6 transition cursor-pointer shadow-lg shadow-cyan-500/20"
              type="submit"
            >
              Submit Form
            </button>
          </form>
        </AnimatedSection>
      </div>
    </div>
  );
}
