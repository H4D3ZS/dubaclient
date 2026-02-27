const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quickhireprime.ae";

export default function Head() {
  const title = "Maintenance & Repair Services in Dubai";
  const description =
    "Explore AC services, electrical work, plumbing, renovation, painting, fit-out, and pool maintenance for residential and commercial properties across Dubai and UAE.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${siteUrl}/services`} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${siteUrl}/services`} />
      <meta property="og:image" content={`${siteUrl}/assets/images/tech/dashboard-mockup.png`} />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Maintenance & Repair Services",
            areaServed: ["Dubai", "UAE"],
            provider: {
              "@type": "LocalBusiness",
              name: "Quick Hire Prime Technical Services LLC",
              url: siteUrl,
              telephone: "+971561535466",
            },
            serviceType: [
              "AC Services",
              "Electrical Work",
              "Plumbing",
              "Home Renovation",
              "Handyman Services",
              "Painting & Decor",
              "Fit-Out Works",
              "Pool & Tank Services",
            ],
          }),
        }}
      />
    </>
  );
}
