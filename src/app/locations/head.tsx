const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quickhireprime.ae";

export default function Head() {
  const title = "Service Areas | Quick Hire Prime Technical Services LLC";
  const description =
    "Explore our service areas across the UAE for AC services, electrical work, plumbing, renovation, painting, fit-out, handyman services, and pool maintenance.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${siteUrl}/locations`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${siteUrl}/locations`} />
      <meta property="og:image" content={`${siteUrl}/assets/images/tech/dashboard-mockup.png`} />
    </>
  );
}
