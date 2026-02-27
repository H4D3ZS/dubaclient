import Image from 'next/image';
import styles from './SpecialOffers.module.css';

const SpecialOffers = () => {
    const offers = [
        {
            title: 'Maintenance Check-Up',
            discount: '2-Week Sprint',
            image: '/assets/images/tech/dashboard-mockup.png',
        },
        {
            title: 'Gateway Reliability Review',
            discount: '48-Hour Report',
            image: '/assets/images/tech/server-room.png',
        },
        {
            title: 'Revenue Leakage Scan',
            discount: 'Limited Slots',
            image: '/assets/images/tech/dashboard-mockup.png',
        },
    ];

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.heading}>
                    <h2>Rapid Engagements</h2>
                </div>
                <div className={styles.grid}>
                    {offers.map((offer, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.imageArea}>
                                <div className={styles.badge}>{offer.discount}</div>
                                <Image
                                    src={offer.image}
                                    alt={offer.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.title}>{offer.title}</h3>
                                <p className={styles.description}>Limited time offer. Call now to book.</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SpecialOffers;
