import Image from 'next/image';
import styles from './TechnicalDetail.module.css';

const TechnicalDetail = () => {
    return (
        <section className={styles.section}>
            <div className={`container ${styles.container}`}>
                <div className={styles.imageWrapper}>
                    {/* Placeholder image matching the description of a technician */}
                    {/* Professional technician stock image */}
                    <Image
                        src="/assets/images/tech/dashboard-mockup.png"
                        alt="Maintenance operations dashboard"
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 900px) 100vw, 50vw"
                    />
                </div>
                <div className={styles.content}>
                    <div className={styles.heading}>
                        <h2 className={styles.title}>Operational excellence for maintenance teams</h2>
                    </div>
                    <p className={styles.description}>
                        We combine skilled technicians, quality materials, and reliable scheduling to keep your home and office spaces comfortable and functional. Every job is planned, executed, and followed up with quality assurance.
                    </p>
                    <p className={styles.description}>
                        From AC services to complete renovations, we align technical expertise with customer satisfaction and timely completion.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TechnicalDetail;
