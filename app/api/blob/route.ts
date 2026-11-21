import { NextResponse } from "next/server";
import { readUploadedBlobImage } from "@/lib/portfolio-storage";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blobPath = searchParams.get("path")?.trim() || "";

    if (
      !blobPath ||
      !blobPath.startsWith("uploads/") ||
      blobPath.includes("..")
    ) {
      return NextResponse.json({ error: "Path tidak valid." }, { status: 400 });
    }

    const result = await readUploadedBlobImage(blobPath);
    if (!result) {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 404 });
    }

    return new Response(result.stream, {
      status: 200,
      headers: {
        "Content-Type": result.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("GET /api/blob error:", error);
    return NextResponse.json(
      { error: "Gagal memuat file gambar." },
      { status: 500 }
    );
  }
}
