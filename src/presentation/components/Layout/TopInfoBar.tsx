import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import styles from './TopInfoBar.module.css';

const TopInfoBar = () => {
    return (
        <div className={styles.topBar}>
            <div className={`container ${styles.container}`}>
                <div className={styles.contactInfo}>
                    <div className={styles.infoItem}>
                        <Phone className={styles.icon} />
                        <span>+971 56 153 5466</span>
                    </div>
                    <div className={styles.infoItem}>
                        <Mail className={styles.icon} />
                        <span>info@quickhireprime.ae</span>
                    </div>
                    <div className={styles.infoItem}>
                        <MapPin className={styles.icon} />
                        <span>Dubai, UAE</span>
                    </div>
                </div>
                <div className={styles.socialIcons}>
                    <a href="#" className={styles.socialLink} aria-label="Facebook">
                        <Facebook className={styles.icon} />
                    </a>
                    <a href="#" className={styles.socialLink} aria-label="Instagram">
                        <Instagram className={styles.icon} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TopInfoBar;
