'use client';

import React, { useState } from 'react';
import styles from './ContactForm.module.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here (e.g., API call)
        alert('Thanks for reaching out. Our technical team will contact you shortly.');
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    };

    return (
        <section className={styles.section} id="contact-form">
            <div className={`container ${styles.container}`}>
                <div className={styles.heading}>
                    <h2>Get a Free Quote</h2>
                    <p>Tell us about your maintenance needs and we&apos;ll respond within 24 hours.</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name" className={styles.label}>Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your full name"
                            className={styles.input}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="your@email.com"
                            className={styles.input}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="phone" className={styles.label}>Phone (Optional)</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="+971 50 123 4567"
                            className={styles.input}
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="service" className={styles.label}>Service Required</label>
                        <select
                            id="service"
                            name="service"
                            className={styles.select}
                            value={formData.service}
                            onChange={handleChange}
                        >
                            <option value="">Select a service</option>
                            <option value="AC_SERVICES">AC Services</option>
                            <option value="ELECTRICAL">Electrical Work</option>
                            <option value="PLUMBING">Plumbing Services</option>
                            <option value="RENOVATION">Home Renovation</option>
                            <option value="HANDYMAN">Handyman Services</option>
                            <option value="PAINTING">Painting & Decor</option>
                            <option value="FIT_OUT">Fit-Out Works</option>
                            <option value="POOL_TANK">Pool & Tank Services</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                        <label htmlFor="message" className={styles.label}>Message</label>
                        <textarea
                            id="message"
                            name="message"
                            placeholder="Describe your maintenance requirements or issues."
                            rows={4}
                            className={styles.textarea}
                            value={formData.message}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                        <button type="submit" className={styles.submitButton}>
                            Get Free Quote
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ContactForm;
