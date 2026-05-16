import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function normalizeText(value: string | undefined) {
  return (value ?? "")
    .toLowerCase()
    .replace(/\((.*?)\)/g, "")
    .replace(/[^a-z0-9]/g, "")
    .replace(/municipality|local|district|metropolitan|metro/g, "")
    .trim();
}

function parseWebsite(raw: string | undefined) {
  if (!raw) return undefined;
  const cleaned = raw.trim();
  if (!cleaned || cleaned.toLowerCase().includes("not available")) return undefined;

  const locationMatch = cleaned.match(/\/locations\/[^/]+\/(.+)$/i);
  if (locationMatch?.[1]) {
    const target = locationMatch[1];
    return target.startsWith("http") ? target : `https://${target}`;
  }

  if (cleaned.startsWith("http")) {
    return cleaned;
  }

  return `https://${cleaned}`;
}

type MunicipalityItem = {
  data: Record<string, any>;
  url?: string;
  error?: unknown;
};

// Use fuzzy matching so ward names can resolve against municipality names
function findBestMatch(query: string, items: MunicipalityItem[]) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return undefined;

  let bestScore = 0;
  let bestItem: MunicipalityItem | undefined;

  for (const item of items) {
    if (typeof item.data.name !== "string") continue;
    const normalizedName = normalizeText(item.data.name);
    if (!normalizedName) continue;

    if (normalizedName === normalizedQuery) {
      return item;
    }

    if (normalizedName.includes(normalizedQuery) || normalizedQuery.includes(normalizedName)) {
      return item;
    }

    const common = normalizedName.split("").filter((char) => normalizedQuery.includes(char)).length;
    if (common > bestScore) {
      bestScore = common;
      bestItem = item;
    }
  }

  return bestItem;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const municipalityQuery = searchParams.get("municipality") ?? searchParams.get("name") ?? "";

  const filePath = path.join(process.cwd(), "public", "data", "municipalities.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const municipalities = JSON.parse(raw) as MunicipalityItem[];

  if (municipalityQuery) {
    const exactMatch = municipalities.find((item) => normalizeText(item.data.name) === normalizeText(municipalityQuery));
    const match = exactMatch ?? findBestMatch(municipalityQuery, municipalities);

    if (!match) {
      return NextResponse.json({ error: "Municipality not found" }, { status: 404 });
    }

    const responseData = {
      ...match.data,
      website: parseWebsite(match.data.website),
    };

    return NextResponse.json(responseData);
  }

  return NextResponse.json(municipalities.map((item) => item.data.name).sort());
}
