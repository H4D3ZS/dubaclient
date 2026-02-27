import React from 'react';
import Layout from '@/presentation/components/Layout/Layout';
import AboutPreview from '@/presentation/components/Home/AboutPreview';
import OneCallBanner from '@/presentation/components/Home/OneCallBanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Quick Hire Prime Technical Services LLC',
    description: 'Learn about Quick Hire Prime Technical Services LLC, your trusted partner for home and office maintenance in Dubai. Expert technicians available 24/7.',
    alternates: {
        canonical: '/about',
    }
};

export default function AboutPage() {
    return (
        <Layout hero={
            <div style={{ padding: '90px 0 50px', background: 'var(--color-primary)', color: 'white', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>About Quick Hire Prime Technical Services LLC</h1>
                <p>Your complete home & office maintenance partner in Dubai</p>
            </div>
        }>
            <section style={{ padding: '4rem 0' }}>
                <div className="container">
                    <AboutPreview />
                    <div style={{ marginTop: '3rem', color: 'var(--color-text-main)', lineHeight: '1.8' }}>
                        <h3>Who We Are</h3>
                        <p>
                            Quick Hire Prime Technical Services LLC is your one-stop solution for all home and office maintenance needs. We unite 4 specialized partner brands to deliver AC services, electrical work, plumbing, renovation, painting, fit-out, and pool maintenance across the UAE.
                        </p>
                        <br />
                        <h3>Our Mission</h3>
                        <p>
                            To provide reliable, high-quality technical services with transparent pricing, expert technicians, and 24/7 emergency support for residential and commercial properties across Dubai.
                        </p>
                    </div>
                </div>
            </section>
            <OneCallBanner />
        </Layout>
    );
}
