export async function sendMessengerReply(recipientId: string, text: string) {
  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!token) {
    console.error("Missing FB_PAGE_ACCESS_TOKEN");
    return;
  }

  const res = await fetch(
    `https://graph.facebook.com/v19.0/me/messages?access_token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: recipientId },
        messaging_type: "RESPONSE",
        message: { text: text.slice(0, 2000) },
      }),
    }
  );

  if (!res.ok) {
    console.error("FB send failed:", await res.text());
  }
}
