'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import styles from './ClientLogos.module.css';

import 'swiper/css';

const logos = [
    'Apartments',
    'Villas',
    'Commercial Offices',
    'Retail Spaces',
    'Hotels',
    'Warehouses',
];

const ClientLogos: React.FC = () => {
    return (
        <section className={styles.logoContainer} aria-labelledby="client-logos-heading">
            <div className={`container ${styles.inner}`}>
                <div className={styles.heading}>
                    <h2 id="client-logos-heading">Trusted Across Dubai</h2>
                    <p>Providing maintenance services for homes and businesses across the UAE.</p>
                </div>
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={20}
                    loop={true}
                    grabCursor={true}
                    autoplay={{ delay: 2000, disableOnInteraction: false }}
                    breakpoints={{
                        450: { slidesPerView: 2 },
                        640: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                        1000: { slidesPerView: 5 },
                    }}
                    className={styles.logoSlider}
                >
                    {logos.map((logo, index) => (
                        <SwiperSlide key={index} className={styles.slide}>
                            <div className={styles.logoCard}>
                                {logo}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default ClientLogos;
