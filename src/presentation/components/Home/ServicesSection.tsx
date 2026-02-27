'use client';

import React, { lazy, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './ServicesSection.module.css';

// Lazy load icons to reduce initial bundle size
const Fan = lazy(() => import('lucide-react').then(module => ({ default: module.Fan })));
const Zap = lazy(() => import('lucide-react').then(module => ({ default: module.Zap })));
const Droplets = lazy(() => import('lucide-react').then(module => ({ default: module.Droplets })));
const Building2 = lazy(() => import('lucide-react').then(module => ({ default: module.Building2 })));
const Wrench = lazy(() => import('lucide-react').then(module => ({ default: module.Wrench })));
const Paintbrush = lazy(() => import('lucide-react').then(module => ({ default: module.Paintbrush })));
const Home = lazy(() => import('lucide-react').then(module => ({ default: module.Home })));
const Waves = lazy(() => import('lucide-react').then(module => ({ default: module.Waves })));
const Truck = lazy(() => import('lucide-react').then(module => ({ default: module.Truck })));

const services = [
    { id: 'ac-services', icon: Fan, title: 'AC Services', description: 'Maintenance, duct cleaning, coil cleaning, and professional installation across Dubai.', link: '/services/ac-services' },
    { id: 'electrical', icon: Zap, title: 'Electrical Work', description: 'Power fault troubleshooting, repairs, installations, and 24/7 emergency support.', link: '/services/electrical' },
    { id: 'plumbing', icon: Droplets, title: 'Plumbing Services', description: 'Leak repairs, fixture installations, drain cleaning, and water heater services.', link: '/services/plumbing' },
    { id: 'renovation', icon: Building2, title: 'Home Renovation', description: 'Kitchen, bathroom, villa, and apartment remodeling with expert craftsmanship.', link: '/services/renovation' },
    { id: 'handyman', icon: Wrench, title: 'Handyman Services', description: 'Drilling, mounting, furniture repair, door fixes, and general maintenance.', link: '/services/handyman' },
    { id: 'painting', icon: Paintbrush, title: 'Painting & Decor', description: 'Interior and exterior painting, wallpaper fixing, and decorative finishes.', link: '/services/painting' },
    { id: 'fit-out', icon: Home, title: 'Fit-Out Works', description: 'Complete office and residential fit-out, carpentry, and interior design.', link: '/services/fit-out' },
    { id: 'pool-maintenance', icon: Waves, title: 'Pool & Tank Services', description: 'Swimming pool maintenance, water tank cleaning, and filtration systems.', link: '/services/pool-maintenance' },
];

// Component to render lazy-loaded icons
const LazyIcon = ({ icon: IconComponent, size = 56, className }: { icon: React.ComponentType<any>, size?: number, className?: string }) => (
    <Suspense fallback={<div style={{ width: size, height: size }} />}>
        <IconComponent size={size} className={className} />
    </Suspense>
);

const ServicesSection: React.FC = () => {
    return (
        <section className={styles.services} id="services" aria-labelledby="services-heading">
            <h2 className={styles.heading} id="services-heading">Our Technical Services</h2>

            <div className={styles.boxContainer}>
                {services.map((service, index) => (
                    <motion.div
                        key={service.id}
                        className={styles.box}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.03 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10 }}
                    >
                        <LazyIcon icon={service.icon} size={56} className={styles.serviceIcon} />
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                        <Link href={service.link} className={styles.link} aria-label={`Learn more about ${service.title}`}>
                            Learn More
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default ServicesSection;
