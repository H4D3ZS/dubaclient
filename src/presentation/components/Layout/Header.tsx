'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone } from 'lucide-react';
import styles from './Header.module.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleMobileMenu } from '@/store/uiSlice';

const Header = () => {
    const dispatch = useAppDispatch();
    const isMobileMenuOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        // Initial check to prevent mismatch
        if (typeof window !== 'undefined') {
            setIsScrolled(window.scrollY > 10);
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleToggleMenu = () => {
        dispatch(toggleMobileMenu());
    };

    const navLinks = [
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ];

    return (
        <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
            <div className="container">
                <nav className={styles.nav}>
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoText}>
                            Quick Hire Prime Technical Services LLC
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className={styles.menuDesktop}>
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className={styles.link}>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className={styles.headerActions}>
                        <a href="tel:+971561535466" className={styles.phoneBtn} aria-label="Call Us">
                            <Phone size={20} />
                        </a>
                        <Link href="/contact" className={styles.quoteBtn}>
                            Get Free Quote
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className={styles.menuButton} onClick={handleToggleMenu} aria-label="Toggle menu">
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={styles.link}
                        onClick={handleToggleMenu}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </header>
    );
};

export default Header;
