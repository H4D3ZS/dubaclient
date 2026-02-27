import React from 'react';
import Layout from '@/presentation/components/Layout/Layout';
import HeroSlider from '@/presentation/components/Home/HeroSlider';
import AboutSection from '@/presentation/components/Home/AboutSection';
import ServicesSection from '@/presentation/components/Home/ServicesSection';
import Pricing from '@/presentation/components/Home/Pricing';
import OurBrands from '@/presentation/components/Home/OurBrands';
import ClientLogos from '@/presentation/components/Home/ClientLogos';
import ContactForm from '@/presentation/components/Home/ContactForm';
import FAQSection from '@/presentation/components/Home/FAQSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quick Hire Prime Technical Services LLC | Best Maintenance in Dubai',
  description: 'Top-rated Dubai home and office maintenance company. Expert AC repair, emergency plumbing, residential electrical work, commercial fit-outs, painting, and professional handyman services across UAE.',
  alternates: {
    canonical: '/',
  }
};

export default function Home() {
  return (
    <Layout hero={<HeroSlider />}>
      <AboutSection />
      <ServicesSection />
      <Pricing />
      <OurBrands />
      <FAQSection />
      <ContactForm />
      <ClientLogos />
    </Layout>
  );
}
