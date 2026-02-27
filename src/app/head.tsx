const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quickhireprime.ae";

export default function Head() {
  const title =
    "Quick Hire Prime Technical Services LLC | Home & Office Maintenance Solutions";
  const description =
    "Quick Hire Prime Technical Services LLC provides AC services, electrical work, plumbing, renovation, painting, fit-out, and pool maintenance across Dubai and UAE.";
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What services do you offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We provide AC services, electrical work, plumbing, renovation, painting, fit-out works, handyman services, and pool & tank maintenance for homes and offices.",
        },
      },
      {
        "@type": "Question",
        name: "Do you serve residential and commercial properties?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. We handle maintenance and repairs for both residential and commercial properties.",
        },
      },
      {
        "@type": "Question",
        name: "Which areas do you serve?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We serve Dubai and other UAE locations depending on the service type.",
        },
      },
      {
        "@type": "Question",
        name: "Do you provide emergency support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. We offer 24/7 emergency support.",
        },
      },
      {
        "@type": "Question",
        name: "How can I request a service?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use our service request form or contact us by phone or email for quick assistance.",
        },
      },
    ],
  };

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${siteUrl}/`} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${siteUrl}/`} />
      <meta property="og:image" content={`${siteUrl}/assets/images/tech/dashboard-mockup.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Quick Hire Prime Technical Services LLC" />
      <meta
        name="twitter:description"
        content="Home & office maintenance services across Dubai and UAE."
      />
      <meta
        name="twitter:image"
        content={`${siteUrl}/assets/images/tech/dashboard-mockup.png`}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </>
  );
}
