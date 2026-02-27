import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Professional Maintenance Services in Dubai | Quick Hire Prime',
    description: 'Explore our complete range of maintenance services in Dubai: AC Repair, Electrical, Plumbing, Painting, Fit-outs, and more. 24/7 Expert technicians available.',
    alternates: {
        canonical: '/services',
    }
};

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>;
}
