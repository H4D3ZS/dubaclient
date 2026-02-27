const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quickhireprime.ae";

export default function Head() {
  const title = "About Quick Hire Prime Technical Services LLC";
  const description =
    "Learn about Quick Hire Prime Technical Services LLC, your one-stop home and office maintenance partner in Dubai and the UAE.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${siteUrl}/about`} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${siteUrl}/about`} />
      <meta property="og:image" content={`${siteUrl}/assets/images/tech/dashboard-mockup.png`} />
    </>
  );
}
