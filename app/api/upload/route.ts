import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  uploadPortfolioFile,
  UploadValidationError,
} from "@/lib/portfolio-storage";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!isAdminAuthenticated()) {
      return NextResponse.json(
        { error: "Sesi admin tidak valid. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
    }

    const { url, provider } = await uploadPortfolioFile(file);
    return NextResponse.json({ url, provider });
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Gagal mengunggah file: ${error.message}`
            : "Gagal mengunggah file.",
      },
      { status: 500 }
    );
  }
}
