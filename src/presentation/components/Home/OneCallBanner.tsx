import React from 'react';
import styles from './OneCallBanner.module.css';

const OneCallBanner = () => {
    return (
        <section className={styles.banner}>
            <div className={`container ${styles.content}`}>
                <h2 className={styles.title}>Speak with a maintenance specialist today</h2>
                <a href="tel:+971561535466" className={styles.phone}>
                    +971 56 153 5466
                </a>
            </div>
        </section>
    );
};

export default OneCallBanner;
