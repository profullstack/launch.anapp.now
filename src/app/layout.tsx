import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { siteOrigin } from "@/lib/env.ts";

const TITLE = "Launch an App Now — Turn Your Idea Into a Real Product | Chovy";
const DESCRIPTION = "Have an app idea? Start with one sentence. Chovy helps turn it into a clear product plan, working software, and previews you can review.";

export async function generateMetadata(): Promise<Metadata> {
  const origin = siteOrigin();
  return {
    metadataBase: new URL(origin),
    title: TITLE,
    description: DESCRIPTION,
    applicationName: "launch.anapp.now",
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
    icons: {
      icon: [
        { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon-180x180.png", sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      url: "/",
      siteName: "launch.anapp.now",
      title: "You have the idea. Launch it.",
      description: "One sentence is enough to start turning an app idea into a real product with Chovy.",
    },
    twitter: { card: "summary_large_image", title: "You have the idea. Launch it.", description: "One sentence is enough to start turning an app idea into a real product with Chovy." },
  };
}

export const viewport = { themeColor: "#0a1230", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {children}
      </body>
    </html>
  );
}
