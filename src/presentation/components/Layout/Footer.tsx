import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    {/* Company Info */}
                    <div className={styles.column}>
                        <h3>Quick Hire Prime Technical Services LLC</h3>
                        <p className={styles.text}>
                            Complete home & office maintenance solutions across Dubai. AC, electrical, plumbing, renovation, painting, fit-out, and pool maintenance through our 5 partner brands.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                            <a href="#" aria-label="Facebook" style={{ color: 'var(--color-accent)' }}><Facebook size={24} /></a>
                            <a href="#" aria-label="Instagram" style={{ color: 'var(--color-accent)' }}><Instagram size={24} /></a>
                            <a href="#" aria-label="LinkedIn" style={{ color: 'var(--color-accent)' }}><Linkedin size={24} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.column}>
                        <h3>Quick Links</h3>
                        <ul className={styles.links}>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/services">Services</Link></li>
                            <li><Link href="/contact">Contact Us</Link></li>
                            <li><Link href="/terms">Terms & Conditions</Link></li>
                            <li><Link href="/privacy">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className={styles.column}>
                        <h3>Our Services</h3>
                        <ul className={styles.links}>
                            <li><Link href="/services/ac-services">AC Services</Link></li>
                            <li><Link href="/services/electrical">Electrical Work</Link></li>
                            <li><Link href="/services/plumbing">Plumbing</Link></li>
                            <li><Link href="/services/renovation">Home Renovation</Link></li>
                            <li><Link href="/services/handyman">Handyman</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className={styles.column}>
                        <h3>Contact Us</h3>
                        <ul className={styles.links}>
                            <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <MapPin size={18} style={{ color: 'var(--color-accent)', marginTop: '3px' }} />
                                <span>Office 3001-486, Al Rigga Business Centre, Dubai UAE</span>
                            </li>
                            <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Phone size={18} style={{ color: 'var(--color-accent)' }} />
                                <a href="tel:+971561535466">+971 56 153 5466</a>
                            </li>
                            <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Mail size={18} style={{ color: 'var(--color-accent)' }} />
                                <a href="mailto:info@quickhireprime.ae">info@quickhireprime.ae</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <div className={`container ${styles.bottomContainer}`}>
                    <p>Copyright &copy; {new Date().getFullYear()} Quick Hire Prime Technical Services LLC. All Rights Reserved.</p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <span>Coverage:</span>
                        <span style={{ fontWeight: 700 }}>Dubai · Abu Dhabi · Sharjah · UAE</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
