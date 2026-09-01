import { NextResponse } from "next/server";
import { searchIndianCities } from "@/lib/indian-cities";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  const suggestions = query.length < 2
    ? []
    : searchIndianCities(query, 8).map(({ name, state }) => ({ name, state }));

  return NextResponse.json(suggestions, {
    headers: { "Cache-Control": "public, max-age=300" }
  });
}
