import fs from "fs";
import path from "path";

export type Product = {
  id: string;
  name: string;
  price: number;
  currency?: string;
  description: string;
  image?: string;
  stock?: number;
};

const DATA_FILE = path.join(process.cwd(), "data", "products.json");

export function getProducts(): Product[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
}

// Simple keyword search for RAG - finds relevant products for a customer message
export function findRelevantProducts(message: string, limit = 5): Product[] {
  const products = getProducts();
  const q = message.toLowerCase();
  const keywords = q.split(/\s+/).filter((w) => w.length > 2);

  const scored = products.map((p) => {
    const text = `${p.name} ${p.description}`.toLowerCase();
    let score = 0;
    for (const k of keywords) {
      if (text.includes(k)) score += 2;
      if (p.name.toLowerCase().includes(k)) score += 3;
    }
    // price queries
    if (q.includes("price") || q.includes("dam") || q.includes("দাম") || q.includes("koto") || q.includes("কত")) {
      score += 1;
    }
    return { p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const filtered = scored.filter((s) => s.score > 0).slice(0, limit).map((s) => s.p);
  // if no match, return first few as general catalog
  return filtered.length > 0 ? filtered : products.slice(0, 3);
}

export function productsToContext(products: Product[]): string {
  if (products.length === 0) return "No products uploaded yet.";
  return products
    .map(
      (p) =>
        `- ${p.name} | Price: ${p.price} ${p.currency || "BDT"} | ${p.description} | Stock: ${p.stock ?? "available"} | ID: ${p.id}`
    )
    .join("\n");
}
