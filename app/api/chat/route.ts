import { NextRequest, NextResponse } from "next/server";
import { generateReply } from "@/lib/gemini";

// Test the AI without Facebook - used by dashboard playground
export async function POST(req: NextRequest) {
  const { message } = await req.json();
  if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });
  const reply = await generateReply(message);
  return NextResponse.json({ reply });
}
