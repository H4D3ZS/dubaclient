'use client';

import React from 'react';
import { Star } from 'lucide-react';
import styles from './Testimonials.module.css';
import { Testimonial } from '@/domain/types';

interface TestimonialsProps {
    testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "LocalBusiness",
                        "name": "Quick Hire Prime Technical Services LLC",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "ratingCount": "154"
                        },
                        "review": testimonials.map((t) => ({
                            "@type": "Review",
                            "author": {
                                "@type": "Person",
                                "name": t.author
                            },
                            "reviewRating": {
                                "@type": "Rating",
                                "ratingValue": "5",
                                "bestRating": "5"
                            },
                            "reviewBody": t.content
                        }))
                    })
                }}
            />
            <section className={styles.section} id="testimonials" aria-labelledby="testimonials-heading">
                <div className="container">
                    <div className={styles.heading}>
                        <h2 id="testimonials-heading">What Our Clients Say</h2>
                        <p>Operations leaders rely on us for revenue protection and uptime.</p>
                    </div>

                    <div className={styles.grid}>
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className={styles.card}>
                                <div className={styles.stars}>
                                    {[1, 2, 3, 4, 5].map((_, i) => (
                                        <Star key={i} size={16} fill="currentColor" />
                                    ))}
                                </div>
                                <p className={styles.quote}>&quot;{testimonial.content}&quot;</p>
                                <p className={styles.author}>- {testimonial.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Testimonials;
