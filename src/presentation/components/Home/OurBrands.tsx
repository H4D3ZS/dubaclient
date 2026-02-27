'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import styles from './OurBrands.module.css';

const brands = [
    {
        id: 'homd',
        name: 'HOMD',
        tagline: 'Home Maintenance Dubai',
        description: 'Your one-stop solution for all big & small home repairs. AC, plumbing, electrical, handyman - available 24/7.',
        website: 'https://home-maintenance-dubai.com/',
        color: '#1e3a5f',
        services: ['AC Services', 'Plumbing', 'Electrical', 'Handyman']
    },
    {
        id: 'homefixer',
        name: 'Home Fixer',
        tagline: 'Team Technical Services LLC',
        description: 'Expert maintenance & fit-out specialists. Painting, electrical, AC, plumbing, tiles, glass, and aluminum work.',
        website: 'https://homefixer.ae/',
        color: '#10b981',
        services: ['Painting', 'Fit-Out', 'Glass Work', 'Tiles']
    },
    {
        id: 'mefm',
        name: 'MEF Maintenance',
        tagline: 'Since 1993',
        description: 'Premier home renovation company with 30+ years of experience. Kitchen, bathroom, villa extensions, pool construction.',
        website: 'https://mefm.ae/',
        color: '#6366f1',
        services: ['Kitchen Renovation', 'Villa Extension', 'Pool Construction']
    },
    {
        id: 'dedicated',
        name: 'Dedicated Technical',
        tagline: 'Expert Solutions',
        description: 'Full technical services in Dubai. AC maintenance, water tank cleaning, pool maintenance, and carpentry services.',
        website: 'https://dedicatedtechnical.com/',
        color: '#ef4444',
        services: ['Water Tank', 'Pool Maintenance', 'Carpentry']
    },
];

const OurBrands: React.FC = () => {
    return (
        <section className={styles.brands} id="our-brands" aria-labelledby="our-brands-heading">
            <h2 className={styles.heading} id="our-brands-heading">Our Partner Brands</h2>
            <p className={styles.subheading}>
                A family of trusted companies serving Dubai&apos;s maintenance needs
            </p>

            <div className={styles.brandGrid}>
                {brands.map((brand, index) => (
                    <motion.a
                        key={brand.id}
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.brandCard}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        style={{ '--brand-color': brand.color } as React.CSSProperties}
                        aria-label={`Visit the official website of ${brand.name}`}
                    >
                        <div className={styles.brandHeader}>
                            <h3 className={styles.brandName}>{brand.name}</h3>
                            <ExternalLink size={16} className={styles.linkIcon} />
                        </div>
                        <span className={styles.tagline}>{brand.tagline}</span>
                        <p className={styles.description}>{brand.description}</p>
                    </motion.a>
                ))}
            </div>
        </section>
    );
};

export default OurBrands;
