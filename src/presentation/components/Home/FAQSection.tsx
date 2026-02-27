'use client';

import React from 'react';
import Link from 'next/link';
import styles from './FAQSection.module.css';

const faqs = [
  {
    question: 'What services do you offer?',
    answer:
      'We provide AC services, electrical work, plumbing, renovation, painting, fit-out works, handyman services, and pool & tank maintenance for homes and offices.',
  },
  {
    question: 'Do you serve residential and commercial properties?',
    answer:
      'Yes. We handle maintenance and repairs for both residential and commercial properties.',
  },
  {
    question: 'Which areas do you serve?',
    answer:
      'We serve Dubai and other UAE locations depending on the service type.',
  },
  {
    question: 'Do you provide emergency support?',
    answer:
      'Yes. We offer 24/7 emergency support.',
  },
  {
    question: 'How can I request a service?',
    answer:
      'Use our service request form or contact us by phone or email for quick assistance.',
  },
];

const FAQSection: React.FC = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
      <section className={styles.section} id="faq" aria-labelledby="faq-heading">
        <div className="container">
          <div className={styles.heading}>
            <h2 id="faq-heading">Frequently Asked Questions</h2>
            <p>Quick answers about our home and office maintenance services.</p>
          </div>

          <div className={styles.list}>
            {faqs.map((faq) => (
              <div key={faq.question} className={styles.item}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className={styles.cta}>
            <Link href="/contact" className={styles.ctaLink} aria-label="Request a service from Quick Hire Prime">
              Request a Service
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQSection;
