export const metadata = { title: "FB Auto Reply - Dashboard", description: "Auto AI reply platform" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", margin: 0, background: "#f5f5f5" }}>{children}</body>
    </html>
  );
}
