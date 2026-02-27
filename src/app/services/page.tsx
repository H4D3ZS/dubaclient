'use client';

import React, { useEffect } from 'react';
import Layout from '@/presentation/components/Layout/Layout';
import ServicesList from '@/presentation/components/Home/ServicesList';
import OneCallBanner from '@/presentation/components/Home/OneCallBanner';
import ContactCTA from '@/presentation/components/Home/ContactCTA';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchServices } from '@/store/contentSlice';

export default function ServicesPage() {
    const dispatch = useAppDispatch();
    const { services } = useAppSelector((state) => state.content);

    useEffect(() => {
        dispatch(fetchServices());
    }, [dispatch]);

    return (
        <Layout hero={
            <div style={{ padding: '90px 0 50px', background: 'var(--color-primary)', color: 'white', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>Maintenance & Repair Services</h1>
                <p>Complete maintenance solutions for residential and commercial properties</p>
            </div>
        }>
            <ServicesList services={services} />
            <OneCallBanner />
            <ContactCTA />
        </Layout>
    );
}
