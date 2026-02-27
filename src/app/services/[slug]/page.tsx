import React from 'react';
import Layout from '@/presentation/components/Layout/Layout';
import ContactForm from '@/presentation/components/Home/ContactForm';
import Link from 'next/link';
import { servicesData, ExtendedService } from '@/infrastructure/repositories/ServiceRepository';
import { Clock, Phone, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import styles from './ServiceDetail.module.css';

import type { Metadata } from 'next';

export const dynamicParams = false;

export async function generateStaticParams() {
    return servicesData.map((service) => ({
        slug: service.id,
    }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const service = servicesData.find((item) => item.id === slug) as ExtendedService | undefined;

    if (!service) {
        return {
            title: 'Service Not Found',
            description: 'The requested maintenance service could not be found.',
        };
    }

    const title = `${service.title} in Dubai | Quick Hire Prime Technical Services`;
    const description = `Professional ${service.title.toLowerCase()} across Dubai and UAE. 24/7 expert maintenance from Quick Hire Prime Technical Services. ${service.emergencyAvailable ? 'Emergency services available.' : ''}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        alternates: {
            canonical: `/services/${slug}`,
        }
    };
}

interface ServiceDetailPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
    const { slug } = await params;
    const service = servicesData.find((item) => item.id === slug) as ExtendedService | undefined;

    if (!service) {
        return (
            <Layout hero={<div style={{ height: '300px', background: 'var(--color-primary)' }}></div>}>
                <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                    <h1>Service Not Found</h1>
                    <Link href="/services" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
                        Back to Services
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout hero={
            <>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Service",
                            "name": service.title,
                            "provider": {
                                "@type": "LocalBusiness",
                                "name": "Quick Hire Prime Technical Services LLC"
                            },
                            "areaServed": [
                                { "@type": "City", "name": "Dubai" },
                                { "@type": "Country", "name": "United Arab Emirates" }
                            ],
                            "description": service.description,
                            "offers": {
                                "@type": "Offer",
                                "priceCurrency": "AED",
                                "price": "100", // Baseline placeholder
                                "description": service.priceRange || "Competitive Pricing"
                            },
                            "hasOfferCatalog": {
                                "@type": "OfferCatalog",
                                "name": `${service.title} Included Services`,
                                "itemListElement": service.subServices.map((sub, index) => ({
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": sub.name,
                                        "description": sub.description
                                    },
                                    "position": index + 1
                                }))
                            }
                        }),
                    }}
                />
                <div className={styles.hero}>
                    <div className="container">
                        <div className={styles.heroContent}>
                            <div className={styles.badges}>
                                {service.emergencyAvailable && (
                                    <span className={styles.emergencyBadge}>
                                        <Clock size={14} /> 24/7 Emergency
                                    </span>
                                )}
                                <span className={styles.partnerBadge}>{service.sourcePartner}</span>
                            </div>
                            <h1>{service.title}</h1>
                            <p className={styles.heroDescription}>{service.description}</p>
                            {service.priceRange && (
                                <p className={styles.priceRange}>
                                    Starting from <strong>{service.priceRange}</strong>
                                </p>
                            )}
                            <div className={styles.heroCTA}>
                                <a href="tel:+971561535466" className={styles.primaryBtn}>
                                    <Phone size={18} /> Call Now
                                </a>
                                <a href="#contact-form" className={styles.secondaryBtn}>
                                    Get Free Quote
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        }>
            {/* Features Section */}
            <section className={styles.features}>
                <div className="container">
                    <h2>Why Choose Us for {service.title}</h2>
                    <div className={styles.featureGrid}>
                        {service.features.map((feature, index) => (
                            <div key={index} className={styles.featureCard}>
                                <CheckCircle size={24} className={styles.featureIcon} />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sub-Services Section */}
            <section className={styles.subServices}>
                <div className="container">
                    <h2>Our {service.title} Include</h2>
                    <p className={styles.subServicesIntro}>
                        Explore our comprehensive range of {service.title.toLowerCase()} offerings:
                    </p>
                    <div className={styles.subServiceGrid}>
                        {service.subServices.map((subService, index) => (
                            <div key={index} className={styles.subServiceCard}>
                                <h3>{subService.name}</h3>
                                <p>{subService.description}</p>
                                <a href="#contact-form" className={styles.subServiceLink}>
                                    Enquire Now <ArrowRight size={14} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Emergency CTA (if applicable) */}
            {service.emergencyAvailable && (
                <section className={styles.emergencyCTA}>
                    <div className="container">
                        <div className={styles.emergencyContent}>
                            <AlertCircle size={40} />
                            <div>
                                <h3>Need Emergency {service.title}?</h3>
                                <p>Our technicians are available 24/7 for urgent repairs across Dubai.</p>
                            </div>
                            <a href="tel:+971561535466" className={styles.emergencyBtn}>
                                <Phone size={20} /> +971 56 153 5466
                            </a>
                        </div>
                    </div>
                </section>
            )}

            {/* Contact Form Section */}
            <section className={styles.contactSection} id="contact-form">
                <div className="container">
                    <div className={styles.contactGrid}>
                        <div className={styles.contactInfo}>
                            <h2>Request {service.title}</h2>
                            <p>
                                Fill out the form and our team will get back to you within 24 hours with a detailed quote.
                            </p>
                            <div className={styles.contactDetails}>
                                <div className={styles.contactItem}>
                                    <strong>Phone:</strong>
                                    <a href="tel:+971561535466">+971 56 153 5466</a>
                                </div>
                                <div className={styles.contactItem}>
                                    <strong>Email:</strong>
                                    <a href="mailto:info@quickhireprime.ae">info@quickhireprime.ae</a>
                                </div>
                                <div className={styles.contactItem}>
                                    <strong>Coverage:</strong>
                                    <span>All areas across Dubai & UAE</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.formWrapper}>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* Other Services */}
            <section className={styles.otherServices}>
                <div className="container">
                    <h2>Explore Other Services</h2>
                    <div className={styles.otherServicesGrid}>
                        {servicesData
                            .filter((s) => s.id !== service.id)
                            .slice(0, 4)
                            .map((otherService) => (
                                <Link key={otherService.id} href={otherService.link} className={styles.otherServiceCard}>
                                    <h4>{otherService.title}</h4>
                                    <ArrowRight size={16} />
                                </Link>
                            ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
