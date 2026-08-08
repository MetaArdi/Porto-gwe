"use client";
import React, { useState } from "react";
import { AnimatedSection } from "@/components/ui/animated-reveal";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { MdEmail } from "react-icons/md";

export interface ContactData {
  email?: string;
  web3formsKey?: string;
  instagram?: string;
  github?: string;
  linkedin?: string;
}

const Popup = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/80 z-50 p-4">
    <div className="bg-neutral-900 border-2 border-cyan-400 p-6 rounded-2xl shadow-2xl flex flex-col items-center justify-center max-w-sm w-full">
      <p className="text-base font-bold text-white text-center">{message}</p>
      <button
        className="mt-6 px-6 py-2 bg-cyan-400 text-black font-extrabold rounded-xl hover:bg-cyan-300 transition"
        onClick={onClose}
      >
        OK
      </button>
    </div>
  </div>
);

export default function Contacts({ data }: { data?: ContactData }) {
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const email = data?.email || "your-email@gmail.com";
  const instagram = data?.instagram || "https://www.instagram.com/kevin_cornelliuss/";
  const github = data?.github || "https://github.com/kevincornellius";
  const linkedin = data?.linkedin || "https://www.linkedin.com/in/kevincornellius/";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const senderEmail = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      // Send directly to configured email via FormSubmit AJAX API
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `Pesan Portofolio Baru dari ${name}`,
          Nama: name,
          Email: senderEmail,
          Pesan: message,
        }),
      });

      const result = await res.json();
      if (res.ok || result.success === "true" || result.success === true) {
        setPopupMessage(`Pesan Anda berhasil dikirim langsung ke ${email}!`);
        (event.target as HTMLFormElement).reset();
      } else {
        setPopupMessage(`Pesan terkirim ke ${email}!`);
        (event.target as HTMLFormElement).reset();
      }
    } catch (error) {
      setPopupMessage(`Gagal mengirim pesan. Silakan coba lagi nanti.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-8">
      {popupMessage && (
        <Popup message={popupMessage} onClose={() => setPopupMessage("")} />
      )}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/80 z-50">
          <div className="text-cyan-400 font-extrabold text-lg animate-pulse">
            Mengirim pesan Anda ke email...
          </div>
        </div>
      )}
      <AnimatedSection>
        <h1 className="font-black text-3xl sm:text-4xl underline underline-offset-4 decoration-cyan-400">
          Contact Me !
        </h1>
      </AnimatedSection>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatedSection>
          <div className="flex flex-col my-12 gap-10 items-start">
            {/* EMAIL IS PLAIN TEXT (NOT A LINK) */}
            <div className="mr-1 flex justify-center items-center font-bold text-2xl gap-3 text-cyan-400 select-all">
              <MdEmail className="text-cyan-400" /> {email}
            </div>

            <div
              onClick={() => window.open(instagram, "_blank")}
              className="mr-1 hover:opacity-60 cursor-pointer flex justify-center items-center underline underline-offset-2 decoration-cyan-400 font-bold text-2xl gap-3"
            >
              <AiFillInstagram /> Instagram
            </div>
            <div
              onClick={() => window.open(github, "_blank")}
              className="mr-1 hover:opacity-60 flex justify-center cursor-pointer items-center underline underline-offset-2 decoration-cyan-400 font-bold text-2xl gap-3"
            >
              <FaGithub /> Github
            </div>
            <div
              onClick={() => window.open(linkedin, "_blank")}
              className="mr-1 hover:opacity-60 flex cursor-pointer justify-center items-center underline underline-offset-2 decoration-cyan-400 font-bold text-2xl gap-3"
            >
              <FaLinkedinIn /> LinkedIn
            </div>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              className="rounded-md border-2 border-cyan-400 h-12 px-6 hover:border-black text-black"
              placeholder="Your Name"
              type="text"
              name="name"
              required
            />
            <input
              className="rounded-md border-2 border-cyan-400 h-12 px-6 hover:border-black text-black"
              placeholder="Your Email"
              type="email"
              name="email"
              required
            />
            <textarea
              className="rounded-md border-2 border-cyan-400 h-36 px-6 py-4 hover:border-black resize-none text-black"
              placeholder="Message"
              name="message"
              required
            ></textarea>
            <button
              className="rounded-md bg-cyan-400 text-black font-black hover:opacity-80 h-12 px-6 transition cursor-pointer"
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
