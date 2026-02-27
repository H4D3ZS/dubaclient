const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quickhireprime.ae";

const locations: Record<string, string> = {
  dubai: "Dubai",
  "abu-dhabi": "Abu Dhabi",
  sharjah: "Sharjah",
  ajman: "Ajman",
  fujairah: "Fujairah",
  "ras-al-khaimah": "Ras Al Khaimah",
  "umm-al-quwain": "Umm Al Quwain",
};

export default function Head({ params }: { params: { slug: string } }) {
  const name = locations[params.slug] || "UAE";
  const title = `${name} Maintenance Services | Quick Hire Prime Technical Services LLC`;
  const description =
    `AC services, electrical work, plumbing, renovation, painting, fit-out works, handyman services, and pool maintenance in ${name}.`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${siteUrl}/locations/${params.slug}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${siteUrl}/locations/${params.slug}`} />
      <meta property="og:image" content={`${siteUrl}/assets/images/tech/dashboard-mockup.png`} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: `${name} Maintenance Services`,
            areaServed: [name, "UAE"],
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
