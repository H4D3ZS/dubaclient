'use client';

import React from 'react';
import Link from 'next/link';
import styles from './AboutPreview.module.css';

const AboutPreview = () => {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.heading}>
                    <h2>Home & Office Maintenance You Can Trust</h2>
                </div>
                <div className={styles.content}>
                    <p>
                        Quick Hire Prime Technical Services LLC delivers complete home and office maintenance for all your residential and commercial needs. We combine expert technicians, quality materials, and reliable service.
                    </p>
                    <p>
                        Our technicians support all maintenance operations across Dubai and UAE, ensuring quality workmanship, clean sites, and reliable scheduling.
                    </p>
                    <div className={styles.cta}>
                        <Link href="/about" className={styles.ctaLink}>
                            Learn About Our Team
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutPreview;
