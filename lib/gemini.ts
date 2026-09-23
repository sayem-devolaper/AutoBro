import { GoogleGenerativeAI } from "@google/generative-ai";
import { findRelevantProducts, productsToContext } from "./products";

export async function generateReply(customerMessage: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const businessName = process.env.BUSINESS_NAME || "My Shop";
  const businessInfo = process.env.BUSINESS_INFO || "";

  const relevant = findRelevantProducts(customerMessage);
  const productContext = productsToContext(relevant);

  // Fallback if no API key (test mode)
  if (!apiKey) {
    if (relevant.length === 0) return `Assalamu Alaikum! ${businessName} e welcome. Apnar prosno ti likhun, amra soon reply dibo.`;
    const p = relevant[0];
    return `Assalamu Alaikum! ${p.name} er dam ${p.price} BDT. ${p.description}. Order korte apnar nam, address, phone din.`;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are a friendly sales assistant for "${businessName}".
Business info: ${businessInfo}

Product catalog (only use these products, do not invent prices):
${productContext}

Customer message: "${customerMessage}"

Rules:
1. Reply in Bangla-mixed (Banglish) like Bangladeshi shop owners: e.g. "Assalamu Alaikum! ... er dam ... tk".
2. If customer asks price, give exact price from catalog.
3. If product not in catalog, say politely it's not available and suggest closest alternative.
4. Always end with a call to action: ask for name/address/phone to order.
5. Keep reply under 300 characters, friendly.
6. Never say you are AI. You are "${businessName}" support team.
7. If greeting only (salam/hi/hello), greet back and ask how you can help + show 2-3 popular products.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
