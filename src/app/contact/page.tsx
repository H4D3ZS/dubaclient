import React from 'react';
import Layout from '@/presentation/components/Layout/Layout';
import ServiceRequestForm from '@/presentation/components/Forms/ServiceRequestForm';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Quick Hire Prime Technical Services LLC Dubai',
    description: 'Get in touch with Quick Hire Prime Technical Services LLC for reliable home and office maintenance in Dubai. Fill out our form for a free quote or call us 24/7.',
    alternates: {
        canonical: '/contact',
    }
};

export default function ContactPage() {
    return (
        <Layout hero={
            <div style={{ padding: '90px 0 50px', background: 'var(--color-primary)', color: 'white', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>Request a Service</h1>
                <p>Fill out the form below and download your service request PDF</p>
            </div>
        }>
            <section style={{ padding: '4rem 0', background: 'linear-gradient(180deg, #f8fafc 0%, white 100%)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
                        {/* Contact Info Sidebar */}
                        <div>
                            <h2 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Quick Hire Prime Technical Services</h2>
                            <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
                                Licensed by Dubai Economy (License #1587149), we provide professional technical services including AC systems, electrical work, plumbing, painting, tiling, and more.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: 'var(--color-primary)', padding: '12px', borderRadius: '50%' }}>
                                        <Phone size={22} color="white" />
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Phone</h4>
                                        <a href="tel:+971561535466" style={{ color: 'var(--color-text-main)' }}>+971 56 153 5466</a>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: 'var(--color-primary)', padding: '12px', borderRadius: '50%' }}>
                                        <Mail size={22} color="white" />
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Email</h4>
                                        <a href="mailto:info@quickhireprime.ae" style={{ color: 'var(--color-text-main)' }}>info@quickhireprime.ae</a>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: 'var(--color-primary)', padding: '12px', borderRadius: '50%' }}>
                                        <MapPin size={22} color="white" />
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Location</h4>
                                        <p style={{ color: 'var(--color-text-main)' }}>Dubai, United Arab Emirates</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ background: 'var(--color-accent)', padding: '12px', borderRadius: '50%' }}>
                                        <Clock size={22} color="var(--color-primary)" />
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Working Hours</h4>
                                        <p style={{ color: 'var(--color-text-main)' }}>24/7 Emergency Support</p>
                                    </div>
                                </div>
                            </div>

                            {/* License Badge */}
                            <div style={{
                                marginTop: '2rem',
                                padding: '1.25rem',
                                background: 'linear-gradient(135deg, rgba(0,82,147,0.05), rgba(247,181,0,0.08))',
                                borderRadius: '12px',
                                border: '1px solid rgba(0,82,147,0.1)'
                            }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                                    Licensed by Dubai Economy & Tourism
                                </p>
                                <p style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                                    Trade License: 1587149
                                </p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                                    Quick Hire Prime Technical Services L.L.C
                                </p>
                            </div>
                        </div>

                        {/* Service Request Form */}
                        <div>
                            <ServiceRequestForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Frame */}
            <section style={{ height: '350px', width: '100%', background: '#eee' }}>
                <iframe
                    src="https://www.google.com/maps?q=Dubai%2C%20UAE&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </section>
        </Layout>
    );
}
