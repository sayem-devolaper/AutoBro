"use client";
import { useEffect, useState } from "react";

type Product = { id: string; name: string; price: number; description: string; stock?: number };

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [testMsg, setTestMsg] = useState("Panjabi er dam koto?");
  const [aiReply, setAiReply] = useState("");

  const load = async () => {
    const r = await fetch("/api/products");
    setProducts(await r.json());
  };
  useEffect(() => { load(); }, []);

  const addProduct = async () => {
    if (!name || !price) return alert("Name + price required");
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, description: desc }),
    });
    setName(""); setPrice(""); setDesc("");
    load();
  };

  const testAI = async () => {
    setAiReply("Thinking...");
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: testMsg }),
    });
    const d = await r.json();
    setAiReply(d.reply);
  };

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1>🤖 Auto AI Reply - Dashboard</h1>
      <p>1. Upload products below → 2. AI trains automatically → 3. Connect Facebook webhook</p>

      <section style={{ background: "#fff", padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h3>➕ Add Product + Price</h3>
        <input placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} style={{ marginRight: 8, padding: 8 }} />
        <input placeholder="Price (BDT)" value={price} onChange={(e) => setPrice(e.target.value)} type="number" style={{ marginRight: 8, padding: 8, width: 120 }} />
        <input placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} style={{ marginRight: 8, padding: 8, width: 220 }} />
        <button onClick={addProduct} style={{ padding: "8px 16px" }}>Save</button>

        <ul>
          {products.map((p) => (
            <li key={p.id}><b>{p.name}</b> — {p.price} BDT — {p.description}</li>
          ))}
        </ul>
      </section>

      <section style={{ background: "#fff", padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <h3>🧪 Test AI Reply (Bangla / Mixed)</h3>
        <input value={testMsg} onChange={(e) => setTestMsg(e.target.value)} style={{ width: "70%", padding: 8 }} />
        <button onClick={testAI} style={{ padding: "8px 16px", marginLeft: 8 }}>Test</button>
        {aiReply && <p style={{ background: "#eef", padding: 12, borderRadius: 6 }}>{aiReply}</p>}
      </section>

      <section style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
        <h3>🔗 Connect Facebook Page</h3>
        <ol>
          <li>Deploy this app (Vercel) to get HTTPS URL</li>
          <li>Meta Developers → Messenger → Webhook: <code>https://your-domain/api/webhook</code></li>
          <li>Verify Token = your <code>FB_VERIFY_TOKEN</code></li>
          <li>Subscribe to <code>messages</code> field, connect your Page</li>
        </ol>
      </section>
    </main>
  );
}
