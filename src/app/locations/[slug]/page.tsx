'use client';

import React from 'react';
import Layout from '@/presentation/components/Layout/Layout';
import Link from 'next/link';

const locations = [
  { slug: 'dubai', name: 'Dubai' },
  { slug: 'abu-dhabi', name: 'Abu Dhabi' },
  { slug: 'sharjah', name: 'Sharjah' },
  { slug: 'ajman', name: 'Ajman' },
  { slug: 'fujairah', name: 'Fujairah' },
  { slug: 'ras-al-khaimah', name: 'Ras Al Khaimah' },
  { slug: 'umm-al-quwain', name: 'Umm Al Quwain' },
];

function findLocation(slug: string) {
  return locations.find((location) => location.slug === slug);
}

export default function LocationPage({ params }: { params: { slug: string } }) {
  const location = findLocation(params.slug);

  if (!location) {
    return (
      <Layout
        hero={
          <div
            style={{
              padding: '90px 0 50px',
              background: 'var(--color-primary)',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>Service Area</h1>
            <p>Location not found</p>
          </div>
        }
      >
        <section style={{ padding: '2rem 0 4rem' }}>
          <div className="container">
            <p style={{ color: 'var(--color-text-muted)' }}>
              Please visit our service areas page.
            </p>
            <Link href="/locations" style={{ fontWeight: 700 }}>
              View all locations
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout
      hero={
        <div
          style={{
            padding: '90px 0 50px',
            background: 'var(--color-primary)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>
            {location.name} Maintenance Services
          </h1>
          <p>Home & office maintenance solutions in {location.name}</p>
        </div>
      }
    >
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
            Quick Hire Prime Technical Services LLC provides AC services, electrical
            work, plumbing, renovation, painting, fit-out works, handyman services,
            and pool & tank maintenance for residential and commercial properties in{' '}
            {location.name}. We offer 24/7 emergency support and fast response times.
          </p>

          <div
            style={{
              marginTop: '2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {[
              'AC Services',
              'Electrical Work',
              'Plumbing',
              'Home Renovation',
              'Handyman Services',
              'Painting & Decor',
              'Fit-Out Works',
              'Pool & Tank Services',
            ].map((service) => (
              <div
                key={service}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,82,147,0.12)',
                  background: 'white',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                  fontWeight: 600,
                }}
              >
                {service}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                padding: '0.85rem 1.6rem',
                borderRadius: '999px',
                background: 'var(--color-primary)',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              Request a Service in {location.name}
            </Link>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <Link href="/locations" style={{ fontWeight: 700 }}>
              View all service areas
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
