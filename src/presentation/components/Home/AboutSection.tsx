'use client';

import React from 'react';
import Link from 'next/link';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './AboutSection.module.css';

const stats = [
    { value: 30, suffix: '+', label: 'Years Experience' },
    { value: 10000, suffix: '+', label: 'Projects Completed' },
    { value: 5, suffix: '', label: 'Partner Brands' },
    { value: 24, suffix: '/7', label: 'Emergency Support' },
];

const AboutSection: React.FC = () => {
    return (
        <section className={styles.about} id="about">
            <h2 className={styles.heading}>Quick Hire Prime Technical Services LLC</h2>

            <div className={styles.row}>
                <motion.div
                    className={styles.video}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <Image
                        src="/assets/images/tech/dashboard-mockup.png"
                        alt="Home Maintenance Services"
                        width={600}
                        height={400}
                        style={{ borderRadius: '1rem', objectFit: 'cover', width: '100%', height: 'auto' }}
                    />
                </motion.div>

                <motion.div
                    className={styles.content}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <h3>Your One-Stop Solution for All Maintenance Needs</h3>
                    <p>
                        From everyday repairs to complete renovations, our unified network of expert technicians serves apartments, villas, and offices across Dubai. We combine 5 specialized brands under one roof for reliable, high-quality technical services.
                    </p>
                    <p>
                        With over 30 years of combined experience, our teams deliver AC maintenance, electrical work, plumbing, painting, fit-out, and pool services with clean workmanship and dependable service.
                    </p>
                    <Link href="/about" className={styles.btn}>More About Us</Link>
                </motion.div>
            </div>

            <div className={styles.boxContainer}>
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        className={styles.box}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h3>
                            <CountUp
                                end={stat.value}
                                duration={2.5}
                                enableScrollSpy
                                scrollSpyOnce
                            />
                            {stat.suffix}
                        </h3>
                        <p>{stat.label}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default AboutSection;
