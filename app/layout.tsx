import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { readContent } from "@/lib/content";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eldiearubang.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const c = await readContent();
    return {
      metadataBase: new URL(SITE_URL),
      title: { default: c.meta.title, template: `%s | ${c.meta.name}` },
      description: c.meta.description,
      openGraph: {
        title: c.meta.title,
        description: c.meta.description,
        url: SITE_URL,
        siteName: c.meta.name,
        type: "website",
        images: [{ url: "/og.png", width: 1200, height: 630, alt: c.meta.name }],
      },
      twitter: {
        card: "summary_large_image",
        title: c.meta.title,
        description: c.meta.description,
        images: ["/og.png"],
      },
      robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
      alternates: { canonical: "/" },
    };
  } catch {
    return { title: "Portfolio", description: "Personal portfolio" };
  }
}

const themeInit = `
(function(){
  try {
    var saved = localStorage.getItem('ea-theme');
    var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    var t = saved || (prefersLight ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <meta name="color-scheme" content="dark light" />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
