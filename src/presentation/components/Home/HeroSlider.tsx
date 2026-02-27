'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import Link from 'next/link';
import styles from './HeroSlider.module.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const slides = [
    {
        image: '/assets/images/tech/server-room.png',
        alt: 'Professional home maintenance team',
        kicker: 'Quick Hire Prime Technical Services LLC',
        title: 'Complete Home & Office Maintenance',
        description: 'From AC repairs to full renovations, our expert technicians deliver reliable solutions for apartments, villas, and commercial spaces across Dubai.',
    },
    {
        image: '/assets/images/tech/dashboard-mockup.png',
        alt: 'AC and electrical services',
        kicker: 'AC, Electrical & Plumbing',
        title: '24/7 Emergency Support When You Need It',
        description: 'Fast response, skilled technicians, and quality workmanship. We handle urgent repairs and scheduled maintenance for all property types.',
    },
    {
        image: '/assets/images/tech/server-room.png',
        alt: 'Home renovation experts',
        kicker: 'Renovation & Fit-Out',
        title: 'Transform Your Space with Expert Craftsmanship',
        description: 'Kitchen remodeling, bathroom renovations, villa extensions, and complete office fit-outs. 30+ years of combined experience.',
    },
];

const HeroSlider: React.FC = () => {
    return (
        <section className={styles.hero}>
            <Swiper
                modules={[Navigation, Autoplay, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={{
                    nextEl: `.${styles.swiperButtonNext}`,
                    prevEl: `.${styles.swiperButtonPrev}`,
                }}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                loop={true}
                grabCursor={true}
                effect="fade"
                className={styles.homeSlider}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className={styles.slide}>
                            <div className={styles.imageWrap}>
                                <Image
                                    src={slide.image}
                                    alt={slide.alt}
                                    fill
                                    priority={index === 0}
                                    sizes="100vw"
                                    style={{ objectFit: 'cover' }}
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAADAAQDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwAfwA=="
                                />
                            </div>
                            <div className={styles.content}>
                                <span className={styles.kicker}>{slide.kicker}</span>
                                <h3>{slide.title}</h3>
                                <p>{slide.description}</p>
                                <div className={styles.actions}>
                                    <Link href="/contact" className={styles.primaryBtn}>
                                        Get Free Quote
                                    </Link>
                                    <Link href="/services" className={styles.secondaryBtn}>
                                        View Services
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className={styles.swiperButtonNext} aria-label="Next slide" role="button"></div>
            <div className={styles.swiperButtonPrev} aria-label="Previous slide" role="button"></div>
        </section>
    );
};

export default HeroSlider;
