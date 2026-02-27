'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Fan, Wind, Zap, Hammer, Box, Wrench, Building, Truck } from 'lucide-react';
import styles from './ServicesList.module.css';
import { Service } from '@/domain/types';

interface ServicesListProps {
    services: Service[];
}

import { LucideIcon } from 'lucide-react';

const IconMap: Record<string, LucideIcon> = {
    'Fan': Fan,
    'Wind': Wind,
    'Zap': Zap,
    'Hammer': Hammer,
    'Box': Box,
    'Wrench': Wrench,
    'Building': Building,
    'Truck': Truck,
};

const ServicesList: React.FC<ServicesListProps> = ({ services }) => {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.heading}>
                    <h2>Maintenance & Repair Services</h2>
                    <p>Complete home and office maintenance solutions across Dubai and UAE.</p>
                </div>

                <div className={styles.grid}>
                    {services.map((service) => {
                        const Icon = IconMap[service.iconName] || Wrench;

                        return (
                            <div key={service.id} className={styles.card}>
                                <div className={styles.iconWrapper}>
                                    <Icon size={32} />
                                </div>
                                <h3 className={styles.cardTitle}>{service.title}</h3>
                                <p className={styles.cardDescription}>{service.description}</p>
                                <Link href={service.link} className={styles.cardLink}>
                                    Learn More <ArrowRight size={16} />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ServicesList;
