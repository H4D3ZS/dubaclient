'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import TopInfoBar from './TopInfoBar';
import ChatWidget from '@/presentation/components/Chat/ChatWidget';

interface LayoutProps {
    children: ReactNode;
    hero?: ReactNode; // Optional Hero content to render above the main container if needed
}

const Layout: React.FC<LayoutProps> = ({ children, hero }) => {
    const pathname = usePathname();

    // Don't show chat widget on admin pages
    const isOnAdminPage = pathname?.startsWith('/admin');

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quickhireprime.ae';
    const pathParts = pathname?.split('/').filter(Boolean) || [];

    // Generate Breadcrumb ItemList
    const breadcrumbItems = pathParts.map((part, index) => {
        const url = `${siteUrl}/${pathParts.slice(0, index + 1).join('/')}`;
        const name = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
        return {
            "@type": "ListItem",
            "position": index + 2,
            "name": name,
            "item": url
        };
    });

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": siteUrl
            },
            ...breadcrumbItems
        ]
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <TopInfoBar />
            <Header />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {hero}
                <div className="container" style={{ flex: 1, paddingTop: hero ? '2rem' : '4rem', paddingBottom: '4rem' }}>
                    {children}
                </div>
            </main>
            <Footer />
            {!isOnAdminPage && <ChatWidget />}
        </div>
    );
};

export default Layout;
