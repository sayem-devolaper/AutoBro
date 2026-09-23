import { NextRequest, NextResponse } from "next/server";
import { generateReply } from "@/lib/gemini";
import { sendMessengerReply } from "@/lib/facebook";

// GET = Facebook webhook verification
export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;
  const mode = search.get("hub.mode");
  const token = search.get("hub.verify_token");
  const challenge = search.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.FB_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

// POST = receive customer messages
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.object !== "page") {
      return NextResponse.json({ status: "ignored" });
    }

    for (const entry of body.entry || []) {
      for (const event of entry.messaging || []) {
        const senderId = event.sender?.id;
        const text = event.message?.text;

        // ignore echoes / delivery receipts
        if (!senderId || !text || event.message?.is_echo) continue;

        console.log(`Incoming from ${senderId}: ${text}`);
        const reply = await generateReply(text);
        await sendMessengerReply(senderId, reply);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
