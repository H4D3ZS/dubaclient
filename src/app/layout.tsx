import type { Metadata } from "next";
import { Sora, Fraunces } from "next/font/google";
import "./globals.css";
import StoreProvider from './StoreProvider';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quickhireprime.ae";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-main",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Quick Hire Prime Technical Services LLC | Best Maintenance in Dubai",
    template: "%s | Quick Hire Prime Technical Services UAE",
  },
  description: "Top-rated Dubai home and office maintenance company. Expert AC repair, emergency plumbing, residential electrical work, commercial fit-outs, painting, and professional handyman services across UAE.",
  keywords: ["AC maintenance Dubai", "emergency plumbing UAE", "electrical services Dubai", "handyman near me", "best home renovation Dubai", "commercial fit-out contractors", "pool maintenance"],
  authors: [{ name: "Quick Hire Prime Technical Services" }],
  creator: "Quick Hire Prime Technical Services",
  publisher: "Quick Hire Prime Technical Services",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      'en-AE': '/',
    },
  },
  openGraph: {
    title: "Quick Hire Prime Technical Services LLC | Premium Maintenance in Dubai",
    description: "Expert AC services, electrical work, plumbing, home renovation, painting, commercial fit-outs, and pool maintenance across Dubai and the UAE. Call +971561535466 for rapid response.",
    url: siteUrl,
    siteName: "Quick Hire Prime Technical Services LLC",
    locale: "en_AE",
    type: "website",
    images: [
      {
        url: "/assets/images/tech/dashboard-mockup.png",
        width: 1200,
        height: 630,
        alt: "Quick Hire Prime Technical Services UAE Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quick Hire Prime Technical | UAE's Best Maintenance Service",
    description: "Reliable AC repair, plumbing, and electrical services in Dubai. Available 24/7.",
    images: ["/assets/images/tech/dashboard-mockup.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "add-your-google-verification-code", // Can be replaced later
    yandex: "add-your-yandex-verification-code", // Can be replaced later
  },
  category: "Home Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/assets/images/tech/server-room.png" as="image" />
        <link rel="preload" href="/assets/images/tech/dashboard-mockup.png" as="image" />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": siteUrl,
              "name": "Quick Hire Prime Technical Services LLC",
              "description": "Top-rated Dubai home and office maintenance company offering expert AC repair, emergency plumbing, residential electrical work, commercial fit-outs, painting, and professional handyman services.",
              "url": siteUrl,
              "logo": `${siteUrl}/assets/images/logo.png`,
              "image": `${siteUrl}/assets/images/tech/dashboard-mockup.png`,
              "telephone": "+971561535466",
              "email": "info@quickhireprime.ae",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Dubai",
                "addressRegion": "Dubai",
                "addressCountry": "AE"
              },
              "areaServed": [
                { "@type": "City", "name": "Dubai" },
                { "@type": "City", "name": "Abu Dhabi" },
                { "@type": "City", "name": "Sharjah" },
                { "@type": "City", "name": "Ajman" },
                { "@type": "Country", "name": "United Arab Emirates" }
              ],
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  "opens": "00:00",
                  "closes": "23:59"
                }
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "UAE Maintenance Services",
                "itemListElement": [
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AC Services & Repair" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Electrical Work & Installation" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Plumbing Services" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Home Renovation" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Professional Handyman Services" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Painting & Decor" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Fit-Out Works" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pool & Tank Maintenance" } }
                ]
              }
            }),
          }}
        />
      </head>
      <body className={`${sora.variable} ${fraunces.variable}`}>
        <StoreProvider>
          <main id="main-content">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
