import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts, Product } from "@/lib/products";

export async function GET() {
  return NextResponse.json(getProducts());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Accept single product or array (bulk upload)
    const items: Product[] = Array.isArray(body) ? body : [body];
    const existing = getProducts();

    for (const item of items) {
      if (!item.name || !item.price) continue;
      existing.push({
        id: item.id || `p${Date.now()}${Math.floor(Math.random() * 1000)}`,
        name: item.name,
        price: Number(item.price),
        currency: item.currency || "BDT",
        description: item.description || "",
        image: item.image || "",
        stock: item.stock ?? 100,
      });
    }

    saveProducts(existing);
    return NextResponse.json({ ok: true, count: existing.length });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    saveProducts([]);
    return NextResponse.json({ ok: true, cleared: true });
  }
  const filtered = getProducts().filter((p) => p.id !== id);
  saveProducts(filtered);
  return NextResponse.json({ ok: true });
}
