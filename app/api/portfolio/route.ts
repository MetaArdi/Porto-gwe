import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getPortfolioData,
  getStorageStatus,
  PORTFOLIO_CACHE_TAG,
  savePortfolioData,
  StorageNotConfiguredError,
} from "@/lib/portfolio-storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const headers = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data, { headers });
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data portofolio." },
      { status: 500, headers }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isAdminAuthenticated()) {
      return NextResponse.json(
        { error: "Sesi admin tidak valid. Silakan login terlebih dahulu." },
        { status: 401, headers }
      );
    }

    const updatedData = await request.json();
    if (!updatedData || typeof updatedData !== "object") {
      return NextResponse.json(
        { error: "Payload data portofolio tidak valid." },
        { status: 400, headers }
      );
    }

    const { provider } = await savePortfolioData(updatedData);

    // Immediately invalidate Next.js Data Cache & page caches so changes appear live
    revalidateTag(PORTFOLIO_CACHE_TAG);
    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json(
      {
        message: "Perubahan tersimpan & langsung aktif di halaman utama!",
        data: updatedData,
        provider,
        storage: getStorageStatus(),
      },
      { headers }
    );
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) {
      return NextResponse.json(
        { error: error.message, storage: getStorageStatus() },
        { status: error.statusCode, headers }
      );
    }

    console.error("POST /api/portfolio error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Gagal menyimpan data: ${error.message}`
            : "Gagal menyimpan data portofolio.",
      },
      { status: 500, headers }
    );
  }
}
