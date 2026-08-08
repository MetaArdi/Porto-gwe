import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import fs from "fs";
import path from "path";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  try {
    const filePath = path.join(process.cwd(), "data", "portfolio.json");
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      const json = JSON.parse(fileData);
      const site = json.siteSettings || {};
      const title = site.title || (json.about?.name ? `${json.about.name} - Portfolio` : "Meta Ardi Setiawan - Portfolio");
      const description = site.description || json.about?.bio || "Personal Portfolio";
      const icon = site.faviconUrl || "/icon.png";

      return {
        title,
        description,
        icons: {
          icon,
          shortcut: icon,
          apple: icon,
        },
      };
    }
  } catch (err) {
    console.error("Error reading metadata from portfolio.json:", err);
  }

  return {
    title: "Meta Ardi Setiawan - Portfolio",
    description: "Personal Portfolio",
    icons: {
      icon: "/icon.png",
      shortcut: "/icon.png",
      apple: "/icon.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className + " scrollbar dark:scrolldark"}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
