'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

interface HeroProps {
    title: string;
    subtitle: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle }) => {
    return (
        <section className={styles.hero}>
            <Image
                src="/assets/images/tech/server-room.png"
                alt="Home maintenance operations"
                fill
                sizes="100vw"
                style={{ objectFit: 'cover' }}
                priority
            />
            <div className={styles.overlay}></div>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.textContent}>
                        <h1 className={styles.title}>QUICK HIRE PRIME TECHNICAL SERVICES LLC</h1>
                        <p className={styles.description}>
                            Complete home & office maintenance solutions across Dubai. AC, electrical, plumbing, renovation, painting, fit-out, and pool maintenance through our 5 partner brands.
                        </p>
                        <div className={styles.actions}>
                            <Link href="/services" className={styles.primaryBtn}>
                                View Services
                            </Link>
                            <Link href="/contact" className={styles.secondaryBtn}>
                                Schedule Assessment
                            </Link>
                        </div>
                    </div>

                    <div className={styles.formWrapper}>
                        <div className={styles.quoteBox}>
                            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input
                                    type="tel"
                                    placeholder="Phone for a call back"
                                    className={styles.formInput}
                                    required
                                />
                                <button type="submit" className={styles.submitBtn}>
                                    Request Call Back
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
