const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quickhireprime.ae";

export default function Head() {
  const title = "Request a Service | Quick Hire Prime Technical Services LLC";
  const description =
    "Request AC, electrical, plumbing, renovation, painting, fit-out, or pool maintenance services in Dubai. 24/7 emergency support available.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${siteUrl}/contact`} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${siteUrl}/contact`} />
      <meta property="og:image" content={`${siteUrl}/assets/images/tech/dashboard-mockup.png`} />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Request a Service",
            url: `${siteUrl}/contact`,
            about: {
              "@type": "LocalBusiness",
              name: "Quick Hire Prime Technical Services LLC",
              telephone: "+971561535466",
              email: "info@quickhireprime.ae",
              areaServed: ["Dubai", "UAE"],
            },
          }),
        }}
      />
    </>
  );
}
