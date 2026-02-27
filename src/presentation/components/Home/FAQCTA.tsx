import React from 'react';
import Link from 'next/link';
import { Phone, ArrowRight } from 'lucide-react';
import styles from './FAQCTA.module.css';

const FAQCTA = () => {
    return (
        <section className={styles.section}>
            <div className={`container ${styles.container}`}>
                <div className={styles.content}>
                    <h2 className={styles.title}>Questions about maintenance services?</h2>
                    <p className={styles.subtitle}>We can walk you through our services, pricing, and scheduling in one call.</p>
                </div>

                <div className={styles.ctaBox}>
                    <h3 className={styles.boxTitle}>Speak with Service Team</h3>
                    <Link href="tel:+971561535466" className={styles.callButton}>
                        <Phone size={18} />
                        Call Now
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FAQCTA;
