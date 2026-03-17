import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Construction Cost Reporting",
  description: "Field production tracking and weekly cost summaries"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
