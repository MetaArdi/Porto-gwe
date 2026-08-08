import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import defaultData from "@/data/portfolio.json";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const dataFilePath = path.join(process.cwd(), "data", "portfolio.json");

// In-memory cache for serverless environments (Vercel)
let inMemoryData: any = null;

const headers = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET() {
  try {
    if (inMemoryData) {
      return NextResponse.json(inMemoryData, { headers });
    }

    if (fs.existsSync(dataFilePath)) {
      const fileContents = fs.readFileSync(dataFilePath, "utf8");
      const data = JSON.parse(fileContents);
      return NextResponse.json(data, { headers });
    }

    return NextResponse.json(defaultData, { headers });
  } catch (error) {
    return NextResponse.json(defaultData, { headers });
  }
}

export async function POST(request: Request) {
  try {
    const updatedData = await request.json();
    inMemoryData = updatedData;

    try {
      if (fs.existsSync(path.dirname(dataFilePath))) {
        fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2), "utf8");
      }
    } catch (fsError) {
      console.warn("Serverless environment detected (read-only FS). Updated in-memory data.");
    }

    return NextResponse.json({ message: "Portfolio data updated successfully", data: updatedData }, { headers });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update portfolio data" }, { status: 500, headers });
  }
}
