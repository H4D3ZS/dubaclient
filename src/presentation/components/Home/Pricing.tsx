'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Building2, Building } from 'lucide-react';
import styles from './Pricing.module.css';

const plans = [
    {
        icon: Building2,
        name: 'Premium',
        price: 'Starting',
        currency: 'AED',
        period: '',
        summary: 'Enhanced maintenance packages with priority scheduling and extended warranties.',
        features: ['Priority scheduling', 'Extended warranties', 'Annual maintenance contracts', '24/7 emergency support', 'Quality guarantee'],
        cta: 'Get Quote',
    },
    {
        icon: Building,
        name: 'Enterprise',
        price: 'Custom',
        currency: '',
        period: '',
        summary: 'Complete facility management solutions with dedicated account management.',
        features: ['Dedicated account manager', 'Custom maintenance plans', 'Preventive maintenance', 'Full-service contracts', 'Annual assessments'],
        cta: 'Contact Sales',
    },
];

const Pricing: React.FC = () => {
    return (
        <section className={styles.pricing} id="pricing" aria-labelledby="pricing-heading">
            <h2 className={styles.heading} id="pricing-heading">Service Packages</h2>

            <div className={styles.boxContainer}>
                {plans.map((plan, index) => (
                    <motion.div
                        key={index}
                        className={styles.box}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.15 }}
                        viewport={{ once: true }}
                    >
                        <plan.icon size={56} className={styles.icon} />
                        <h3>{plan.name}</h3>
                        <p className={styles.summary}>{plan.summary}</p>
                        <div className={styles.price}>
                            {plan.currency && <span>{plan.currency}</span>}
                            {plan.price}
                            {plan.period && <span>/{plan.period}</span>}
                        </div>
                        <div className={styles.list}>
                            {plan.features.map((feature, i) => (
                                <p key={i}>{feature}</p>
                            ))}
                        </div>
                        <Link href="/contact" className={styles.btn} aria-label={`${plan.cta} for ${plan.name} package`}>
                            {plan.cta}
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Pricing;
