import { NextResponse } from "next/server";
import {
  createSessionToken,
  getSessionCookieOptions,
  isAdminAuthenticated,
  isAuthEnabled,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { getStorageStatus } from "@/lib/portfolio-storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  return NextResponse.json(
    {
      authenticated: isAdminAuthenticated(),
      authEnabled: isAuthEnabled(),
      storage: getStorageStatus(),
    },
    { headers: noStoreHeaders }
  );
}

export async function POST(request: Request) {
  try {
    if (!isAuthEnabled()) {
      return NextResponse.json(
        { authenticated: true, authEnabled: false },
        { headers: noStoreHeaders }
      );
    }

    const body = await request.json();
    const password = typeof body?.password === "string" ? body.password : "";

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: "Password admin salah." },
        { status: 401, headers: noStoreHeaders }
      );
    }

    const token = createSessionToken();
    const response = NextResponse.json(
      { authenticated: true, authEnabled: true },
      { headers: noStoreHeaders }
    );
    response.cookies.set({
      ...getSessionCookieOptions(),
      value: token,
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: "Permintaan login tidak valid." },
      { status: 400, headers: noStoreHeaders }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json(
    { authenticated: false, authEnabled: isAuthEnabled() },
    { headers: noStoreHeaders }
  );
  response.cookies.set({
    ...getSessionCookieOptions(),
    value: "",
    maxAge: 0,
  });
  return response;
}
