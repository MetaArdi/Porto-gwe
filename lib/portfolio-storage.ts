import fs from "fs";
import path from "path";
import { unstable_cache } from "next/cache";
import { Redis } from "@upstash/redis";
import { put, list, del, get } from "@vercel/blob";
import defaultData from "@/data/portfolio.json";

export type DataStorageProvider =
  | "upstash-redis"
  | "vercel-blob"
  | "local-fs"
  | "unconfigured";

export type UploadStorageProvider =
  | "vercel-blob"
  | "local-fs"
  | "base64-fallback";

export interface StorageStatus {
  dataProvider: DataStorageProvider;
  uploadProvider: UploadStorageProvider;
  isVercel: boolean;
  writable: boolean;
}

export class StorageNotConfiguredError extends Error {
  statusCode = 503;
  constructor(message: string) {
    super(message);
    this.name = "StorageNotConfiguredError";
  }
}

export class UploadValidationError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "UploadValidationError";
    this.statusCode = statusCode;
  }
}

const DATA_FILE_PATH = path.join(process.cwd(), "data", "portfolio.json");
const REDIS_KEY = "portfolio:data";
const BLOB_DATA_PREFIX = "portfolio/data";
const MAX_UPLOAD_BYTES = 4.5 * 1024 * 1024; // 4.5 MB (Vercel serverless payload limit)
const MAX_BASE64_FALLBACK_BYTES = 500 * 1024; // 500 KB safety cap when Blob isn't configured

export const PORTFOLIO_CACHE_TAG = "portfolio";

// Short-lived in-memory cache for immediate read-after-write consistency on Vercel Blob
let recentBlobWrite: { data: any; savedAt: number } | null = null;
const RECENT_BLOB_TTL_MS = 15_000;
let preferredBlobAccess: "public" | "private" = "public";

function isPrivateStoreMismatchError(err: unknown): boolean {
  const msg =
    err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  return (
    msg.includes("private store") ||
    msg.includes("cannot use public access")
  );
}

function isPublicStoreMismatchError(err: unknown): boolean {
  const msg =
    err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  return (
    msg.includes("public store") ||
    msg.includes("cannot use private access")
  );
}

async function putBlobAutoAccess(
  pathname: string,
  body: string | Buffer,
  options: {
    addRandomSuffix?: boolean;
    contentType?: string;
    cacheControlMaxAge?: number;
    token?: string;
    storeId?: string;
  }
) {
  const firstAccess = preferredBlobAccess;
  try {
    const blob = await put(pathname, body, {
      ...options,
      access: firstAccess,
    });
    return { blob, access: firstAccess };
  } catch (err) {
    if (firstAccess === "public" && isPrivateStoreMismatchError(err)) {
      preferredBlobAccess = "private";
      const blob = await put(pathname, body, {
        ...options,
        access: "private",
      });
      return { blob, access: "private" as const };
    }
    if (firstAccess === "private" && isPublicStoreMismatchError(err)) {
      preferredBlobAccess = "public";
      const blob = await put(pathname, body, {
        ...options,
        access: "public",
      });
      return { blob, access: "public" as const };
    }
    throw err;
  }
}

function isVercelEnvironment(): boolean {
  return Boolean(process.env.VERCEL === "1" || process.env.VERCEL_ENV);
}

function findEnvBySuffix(suffix: string): string | undefined {
  for (const [key, value] of Object.entries(process.env)) {
    if (key.endsWith(suffix) && value && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

function getRedisCredentials(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim() ||
    findEnvBySuffix("_REST_API_URL") ||
    findEnvBySuffix("_REDIS_REST_URL");
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim() ||
    findEnvBySuffix("_REST_API_TOKEN") ||
    findEnvBySuffix("_REDIS_REST_TOKEN");

  if (url && token) {
    return { url, token };
  }
  return null;
}

let cachedRedisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  const creds = getRedisCredentials();
  if (!creds) return null;
  if (!cachedRedisClient) {
    cachedRedisClient = new Redis({ url: creds.url, token: creds.token });
  }
  return cachedRedisClient;
}

function getBlobConfig(): { token?: string; storeId?: string } | null {
  const rwToken =
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
    findEnvBySuffix("_BLOB_READ_WRITE_TOKEN") ||
    findEnvBySuffix("_READ_WRITE_TOKEN");
  if (rwToken) {
    return { token: rwToken };
  }

  // Newly created Vercel Blob stores use OIDC authentication with BLOB_STORE_ID.
  // On Vercel runtime, @vercel/blob automatically reads the OIDC token from the
  // incoming `x-vercel-oidc-token` request header (not process.env.VERCEL_OIDC_TOKEN).
  const storeId =
    process.env.BLOB_STORE_ID?.trim() ||
    findEnvBySuffix("_BLOB_STORE_ID");
  if (storeId && (isVercelEnvironment() || process.env.VERCEL_OIDC_TOKEN?.trim())) {
    return { storeId };
  }

  return null;
}

function hasBlobStorage(): boolean {
  return Boolean(getBlobConfig());
}

export function getStorageStatus(): StorageStatus {
  const isVercel = isVercelEnvironment();
  const hasRedis = Boolean(getRedisCredentials());
  const hasBlob = hasBlobStorage();

  let dataProvider: DataStorageProvider;
  if (hasRedis) {
    dataProvider = "upstash-redis";
  } else if (hasBlob) {
    dataProvider = "vercel-blob";
  } else if (isVercel) {
    dataProvider = "unconfigured";
  } else {
    dataProvider = "local-fs";
  }

  let uploadProvider: UploadStorageProvider;
  if (hasBlob) {
    uploadProvider = "vercel-blob";
  } else if (isVercel) {
    uploadProvider = "base64-fallback";
  } else {
    uploadProvider = "local-fs";
  }

  return {
    dataProvider,
    uploadProvider,
    isVercel,
    writable: dataProvider !== "unconfigured",
  };
}

function readLocalPortfolioData(): any {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContents = fs.readFileSync(DATA_FILE_PATH, "utf8");
      return JSON.parse(fileContents);
    }
  } catch (err) {
    console.error("Failed reading local portfolio.json:", err);
  }
  return defaultData;
}

function writeLocalPortfolioDataBestEffort(updatedData: any): void {
  if (isVercelEnvironment()) return;
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updatedData, null, 2), "utf8");
  } catch (err) {
    console.warn("Best-effort local portfolio.json sync skipped:", err);
  }
}

async function fetchLatestBlobPortfolioRaw(noStore: boolean): Promise<any | null> {
  const blobCfg = getBlobConfig();
  if (!blobCfg) return null;

  const { blobs } = await list({
    prefix: BLOB_DATA_PREFIX,
    limit: 25,
    ...blobCfg,
  });
  if (!blobs || blobs.length === 0) return null;

  const sorted = [...blobs].sort((a, b) => {
    const timeDiff =
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    if (timeDiff !== 0) return timeDiff;
    return b.pathname.localeCompare(a.pathname);
  });

  const latest = sorted[0];
  if (latest.url.includes(".private.blob.vercel-storage.com")) {
    preferredBlobAccess = "private";
    const result = await get(latest.pathname, {
      access: "private",
      useCache: false,
      ...blobCfg,
    });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    return await new Response(result.stream).json();
  }

  const response = await fetch(
    latest.url,
    noStore ? { cache: "no-store" } : undefined
  );
  if (!response.ok) return null;
  return await response.json();
}

const getCachedBlobPortfolio = unstable_cache(
  async () => fetchLatestBlobPortfolioRaw(false),
  ["portfolio-blob-json"],
  { tags: [PORTFOLIO_CACHE_TAG], revalidate: 3600 }
);

async function readFromBlob(): Promise<any | null> {
  if (
    recentBlobWrite &&
    Date.now() - recentBlobWrite.savedAt < RECENT_BLOB_TTL_MS
  ) {
    return recentBlobWrite.data;
  }

  try {
    return await getCachedBlobPortfolio();
  } catch {
    return await fetchLatestBlobPortfolioRaw(true);
  }
}

export async function getPortfolioData(): Promise<any> {
  // 1. Primary cloud storage: Upstash Redis (instant, strongly consistent)
  const redis = getRedisClient();
  if (redis) {
    try {
      const stored = await redis.get(REDIS_KEY);
      if (stored !== null && stored !== undefined) {
        return typeof stored === "string" ? JSON.parse(stored) : stored;
      }
      return readLocalPortfolioData();
    } catch (err) {
      console.error("Failed reading portfolio from Upstash Redis:", err);
    }
  }

  // 2. Secondary cloud storage: Vercel Blob
  if (hasBlobStorage()) {
    try {
      const blobData = await readFromBlob();
      if (blobData) return blobData;
      return readLocalPortfolioData();
    } catch (err) {
      console.error("Failed reading portfolio from Vercel Blob:", err);
    }
  }

  // 3. Local filesystem / bundled fallback
  return readLocalPortfolioData();
}

export async function savePortfolioData(
  updatedData: any
): Promise<{ provider: DataStorageProvider }> {
  // 1. Primary cloud storage: Upstash Redis
  const redis = getRedisClient();
  if (redis) {
    await redis.set(REDIS_KEY, updatedData);
    writeLocalPortfolioDataBestEffort(updatedData);
    return { provider: "upstash-redis" };
  }

  // 2. Secondary cloud storage: Vercel Blob (supports both Public and Private stores automatically)
  const blobCfg = getBlobConfig();
  if (blobCfg) {
    const { blob: newBlob } = await putBlobAutoAccess(
      `${BLOB_DATA_PREFIX}-${Date.now()}.json`,
      JSON.stringify(updatedData, null, 2),
      {
        addRandomSuffix: true,
        contentType: "application/json",
        cacheControlMaxAge: 0,
        ...blobCfg,
      }
    );

    recentBlobWrite = { data: updatedData, savedAt: Date.now() };
    writeLocalPortfolioDataBestEffort(updatedData);

    // Best-effort cleanup of older JSON snapshots so only the latest stays in Blob
    try {
      const { blobs } = await list({
        prefix: BLOB_DATA_PREFIX,
        limit: 50,
        ...blobCfg,
      });
      const staleUrls = blobs
        .filter((b) => b.url !== newBlob.url)
        .map((b) => b.url);
      if (staleUrls.length > 0) {
        await del(staleUrls, blobCfg);
      }
    } catch (cleanupErr) {
      console.warn("Failed cleaning up previous portfolio JSON blobs:", cleanupErr);
    }

    return { provider: "vercel-blob" };
  }

  // 3. Vercel without any configured cloud storage -> fail loudly, never fake success
  if (isVercelEnvironment()) {
    throw new StorageNotConfiguredError(
      "Storage cloud Vercel belum dihubungkan. Buka Vercel Dashboard -> Project -> Storage -> Create Database (pilih Upstash Redis atau Vercel Blob), hubungkan ke project ini, lalu Redeploy."
    );
  }

  // 4. Local development filesystem
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updatedData, null, 2), "utf8");
    return { provider: "local-fs" };
  } catch (err) {
    throw new StorageNotConfiguredError(
      "Filesystem bersifat read-only dan storage cloud (Upstash Redis / Vercel Blob) belum dikonfigurasi."
    );
  }
}

export async function uploadPortfolioFile(
  file: File
): Promise<{ url: string; provider: UploadStorageProvider }> {
  if (!file || file.size === 0) {
    throw new UploadValidationError("File gambar tidak boleh kosong.", 400);
  }

  if (file.type && !file.type.startsWith("image/")) {
    throw new UploadValidationError(
      "Format file tidak didukung. Harap unggah file gambar (PNG, JPG, WEBP, SVG, ICO).",
      400
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadValidationError(
      "Ukuran file terlalu besar (maksimal 4,5 MB). Kompres gambar terlebih dahulu.",
      413
    );
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filename = `${Date.now()}-${safeName}`;

  const bytes = await file.arrayBuffer();

  // 1. Primary: Vercel Blob (supports both Public and Private stores automatically)
  const blobCfg = getBlobConfig();
  if (blobCfg) {
    const { blob, access } = await putBlobAutoAccess(
      `uploads/${filename}`,
      Buffer.from(bytes),
      {
        addRandomSuffix: true,
        contentType: file.type || undefined,
        ...blobCfg,
      }
    );
    const url =
      access === "private"
        ? `/api/blob?path=${encodeURIComponent(blob.pathname)}`
        : blob.url;
    return { url, provider: "vercel-blob" };
  }

  // 2. Local development filesystem
  if (!isVercelEnvironment()) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, new Uint8Array(bytes));
    return { url: `/uploads/${filename}`, provider: "local-fs" };
  }

  // 3. Serverless without Vercel Blob: safe base64 fallback only for small images
  if (file.size > MAX_BASE64_FALLBACK_BYTES) {
    throw new UploadValidationError(
      "Vercel Blob belum terhubung. Hubungkan Vercel Blob di Vercel Dashboard -> Storage agar bisa upload gambar hingga 4,5 MB (tanpa Blob maksimal 500 KB).",
      413
    );
  }

  const base64Data = Buffer.from(bytes).toString("base64");
  const mimeType = file.type || "image/png";
  return {
    url: `data:${mimeType};base64,${base64Data}`,
    provider: "base64-fallback",
  };
}

export async function readUploadedBlobImage(
  blobPath: string
): Promise<{ stream: ReadableStream<Uint8Array>; contentType: string } | null> {
  const blobCfg = getBlobConfig();
  if (!blobCfg) return null;

  try {
    const result = await get(blobPath, {
      access: "private",
      ...blobCfg,
    });
    if (result && result.statusCode === 200 && result.stream) {
      return {
        stream: result.stream,
        contentType: result.blob.contentType || "application/octet-stream",
      };
    }
  } catch (err) {
    if (isPublicStoreMismatchError(err)) {
      const publicResult = await get(blobPath, {
        access: "public",
        ...blobCfg,
      });
      if (publicResult && publicResult.statusCode === 200 && publicResult.stream) {
        return {
          stream: publicResult.stream,
          contentType: publicResult.blob.contentType || "application/octet-stream",
        };
      }
      return null;
    }
    throw err;
  }

  return null;
}
