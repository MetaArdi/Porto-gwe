import React from "react";
import PortfolioClient from "./components/PortfolioClient";
import { getPortfolioData } from "@/lib/portfolio-storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const initialData = await getPortfolioData();
  return <PortfolioClient initialData={initialData} />;
}
