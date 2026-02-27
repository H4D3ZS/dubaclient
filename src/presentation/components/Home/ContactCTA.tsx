'use client';

import React from 'react';
import Link from 'next/link';
import styles from './ContactCTA.module.css';

const ContactCTA = () => {
    return (
        <section className={styles.section}>
            <div className={`container ${styles.container}`}>
                <p className={styles.subheading}>LET'S TALK</p>
                <div className={styles.heading}>
                    <h2>Need professional maintenance?<br />We can help.</h2>
                </div>
                <p className={styles.description}>
                    Share your maintenance needs and we'll connect you with the right technicians. Fast response, quality work, transparent pricing.
                </p>
                <Link href="/contact" className={styles.button}>
                    Talk to a Specialist
                </Link>
            </div>
        </section>
    );
};

export default ContactCTA;
