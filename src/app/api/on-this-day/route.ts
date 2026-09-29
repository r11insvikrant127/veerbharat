import { NextResponse } from "next/server";
import { getOnThisDayHistory } from "@/services/onThisDay.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getOnThisDayHistory();

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "On This Day API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load On This Day history.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}