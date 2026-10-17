import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";

const description =
  "Mint and redeem onchain index baskets of tokenized stocks on Robinhood Chain. One share is a fixed mix of Stock Tokens, priced from Chainlink feeds.";

export const metadata: Metadata = {
  metadataBase: new URL("https://robinhood-chain-dapp.vercel.app"),
  title: "Index Baskets · Robinhood Chain",
  description,
  openGraph: {
    title: "Index Baskets on Robinhood Chain",
    description,
    url: "/",
    siteName: "Index Baskets on Robinhood Chain",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Index Baskets on Robinhood Chain",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          <SiteHeader />
          <main className="w-full flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
