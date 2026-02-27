import React from 'react';
import { ShieldCheck, Server, Activity, LineChart } from 'lucide-react';
import styles from './Features.module.css';

const Features = () => {
    const features = [
        {
            icon: <Server size={40} />,
            title: 'Reliable Maintenance',
            description: 'Skilled technicians, quality materials, and reliable scheduling keep your home and office spaces comfortable and functional.',
        },
        {
            icon: <Activity size={40} />,
            title: 'Quality Assurance',
            description: 'Thorough inspections and quality checks ensure all work meets our high standards.',
        },
        {
            icon: <LineChart size={40} />,
            title: 'Efficient Service',
            description: 'Streamlined processes and experienced technicians ensure quick and effective solutions.',
        },
        {
            icon: <ShieldCheck size={40} />,
            title: 'Licensed & Insured',
            description: 'Certified technicians and insurance coverage for peace of mind and quality work.',
        },
    ];

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.heading}>
                    <h2>Why Customers Choose Us</h2>
                </div>
                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.iconWrapper}>
                                {feature.icon}
                            </div>
                            <h3 className={styles.title}>{feature.title}</h3>
                            <p className={styles.description}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
