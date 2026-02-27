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

export default function LocationsPage() {
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
          <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>Service Areas</h1>
          <p>Quick Hire Prime Technical Services LLC across the UAE</p>
        </div>
      }
    >
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            We provide AC services, electrical work, plumbing, renovation, painting, fit-out
            works, handyman services, and pool & tank maintenance for residential and
            commercial properties across the UAE.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {locations.map((location) => (
              <Link
                key={location.slug}
                href={`/locations/${location.slug}`}
                style={{
                  display: 'block',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,82,147,0.12)',
                  textDecoration: 'none',
                  color: 'var(--color-text-main)',
                  background: 'white',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                  fontWeight: 700,
                }}
              >
                {location.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
