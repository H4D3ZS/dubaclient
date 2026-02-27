import { Service } from '@/domain/types';

export interface SubService {
    name: string;
    description: string;
}

export interface ExtendedService extends Service {
    subServices: SubService[];
    features: string[];
    priceRange?: string;
    emergencyAvailable: boolean;
    sourcePartner: string;
}

export const servicesData: ExtendedService[] = [
    {
        id: 'ac-services',
        title: 'AC Services',
        description: 'Complete air conditioning solutions including maintenance, duct cleaning, coil cleaning, installation, and 24/7 emergency repairs. We service split AC units, central cooling systems, and VRF systems across residential and commercial properties in Dubai.',
        iconName: 'Fan',
        link: '/services/ac-services',
        sourcePartner: 'Dedicated Technical / HOMD',
        emergencyAvailable: true,
        features: [
            '24/7 Emergency AC Repairs',
            'Same-day service available',
            'All major AC brands serviced',
            'Annual maintenance contracts',
            'Genuine spare parts',
            'Licensed technicians',
        ],
        subServices: [
            { name: 'AC Maintenance', description: 'Regular servicing to keep your AC running efficiently and extend its lifespan.' },
            { name: 'AC Duct Cleaning', description: 'Professional cleaning of air ducts to improve air quality and AC performance.' },
            { name: 'AC Coil Cleaning', description: 'Deep cleaning of evaporator and condenser coils for optimal cooling.' },
            { name: 'AC Installation', description: 'Expert installation of split, central, and VRF systems for homes and offices.' },
            { name: 'AC Gas Refilling', description: 'Refrigerant top-up and leak detection for underperforming units.' },
            { name: 'Central AC Service', description: 'Maintenance and repair of ducted central cooling systems.' },
            { name: 'VRF System Service', description: 'Specialized service for Variable Refrigerant Flow commercial systems.' },
        ],
    },
    {
        id: 'electrical',
        title: 'Electrical Work',
        description: 'Professional electrical services covering power fault troubleshooting, wiring repairs, socket and switch installations, lighting solutions, electrical panel upgrades, and safety inspections. Our certified electricians provide 24/7 emergency support across Dubai.',
        iconName: 'Zap',
        link: '/services/electrical',
        sourcePartner: 'HomeFixer / Dedicated Technical',
        emergencyAvailable: true,
        priceRange: 'AED 100 - 3,000',
        features: [
            '24/7 Emergency callout',
            'DEWA approved technicians',
            'Safety inspections',
            'Commercial and residential',
            'Smart home integration',
            'Free quotations',
        ],
        subServices: [
            { name: 'Power Fault Troubleshooting', description: 'Diagnosis and repair of electrical faults, circuit trips, and power outages.' },
            { name: 'Wiring & Rewiring', description: 'New wiring installation and rewiring of old electrical systems.' },
            { name: 'Socket & Switch Installation', description: 'Installation and replacement of power outlets, light switches, and dimmers.' },
            { name: 'Lighting Solutions', description: 'Indoor and outdoor lighting installation including LED upgrades and chandeliers.' },
            { name: 'Electrical Panel Upgrades', description: 'Distribution board installation, upgrades, and circuit breaker replacement.' },
            { name: 'CCTV Installation', description: 'Security camera installation and wiring for homes and businesses.' },
            { name: 'Ceiling Fan Installation', description: 'Installation and repair of ceiling fans and exhaust systems.' },
        ],
    },
    {
        id: 'plumbing',
        title: 'Plumbing Services',
        description: 'Expert plumbing solutions for leak detection and repair, pipe installation, fixture replacement, water heater services, drain cleaning, and bathroom renovations. Fast response for emergency plumbing issues across apartments, villas, and commercial spaces.',
        iconName: 'Droplets',
        link: '/services/plumbing',
        sourcePartner: 'HOMD / HomeFixer',
        emergencyAvailable: true,
        priceRange: 'AED 120 - 2,000',
        features: [
            '24/7 Emergency plumbing',
            'No callout fee',
            'Licensed plumbers',
            'Same-day service',
            'All brands serviced',
            'Warranty on work',
        ],
        subServices: [
            { name: 'Leak Detection & Repair', description: 'Finding and fixing hidden leaks in pipes, walls, and under floors.' },
            { name: 'Drain Cleaning & Opening', description: 'Unblocking drains, toilets, sinks, and sewer lines with professional equipment.' },
            { name: 'Pipe Installation', description: 'New pipe installation for water supply, drainage, and gas lines.' },
            { name: 'Fixture Replacement', description: 'Installation of taps, mixers, showers, toilets, bidets, and sinks.' },
            { name: 'Water Heater Services', description: 'Installation, repair, and maintenance of electric and solar water heaters.' },
            { name: 'Bathroom Plumbing', description: 'Complete bathroom plumbing for renovations and new installations.' },
            { name: 'Sump Pump Services', description: 'Installation and repair of sump pumps for basement water removal.' },
        ],
    },
    {
        id: 'renovation',
        title: 'Home Renovation',
        description: 'Transform your space with our comprehensive renovation services. We specialize in kitchen remodeling, bathroom renovations, villa extensions, apartment makeovers, and complete home transformations. With 30+ years of experience, we deliver expert craftsmanship and quality materials.',
        iconName: 'Building2',
        link: '/services/renovation',
        sourcePartner: 'MEF Maintenance (Since 1993)',
        emergencyAvailable: false,
        priceRange: 'AED 5,000 - 500,000+',
        features: [
            '30+ years experience',
            'Free design consultation',
            '3D visualization',
            'Project management',
            'Quality materials',
            'Warranty included',
        ],
        subServices: [
            { name: 'Kitchen Renovation', description: 'Complete kitchen remodeling including cabinets, countertops, appliances, and flooring.' },
            { name: 'Bathroom Renovation', description: 'Full bathroom makeovers with modern fixtures, tiling, and waterproofing.' },
            { name: 'Villa Extension', description: 'Adding rooms, floors, or outdoor spaces to existing villa structures.' },
            { name: 'Apartment Renovation', description: 'Complete apartment transformations including layouts, finishes, and systems.' },
            { name: 'Pool Construction', description: 'Swimming pool design, construction, and renovation for residential properties.' },
            { name: 'Flooring Installation', description: 'Installation of marble, tiles, hardwood, vinyl, and laminate flooring.' },
            { name: 'False Ceiling Works', description: 'Gypsum board, suspended, and decorative ceiling installations.' },
        ],
    },
    {
        id: 'handyman',
        title: 'Handyman Services',
        description: 'Reliable handyman solutions for everyday repairs and installations. Services include drilling, mounting, shelf installation, door repairs, furniture assembly, minor carpentry, and general home fixes. Available for same-day appointments across Dubai.',
        iconName: 'Wrench',
        link: '/services/handyman',
        sourcePartner: 'HOMD / Dedicated Technical',
        emergencyAvailable: false,
        priceRange: 'AED 80 - 500',
        features: [
            'Same-day appointments',
            'Hourly rates available',
            'Multi-skilled technicians',
            'Tools provided',
            'Transparent pricing',
            'Satisfaction guarantee',
        ],
        subServices: [
            { name: 'Drilling & Mounting', description: 'TV mounting, shelf installation, curtain rod fitting, and picture hanging.' },
            { name: 'Door & Lock Repairs', description: 'Door alignment, handle replacement, lock changes, and hinge repairs.' },
            { name: 'Furniture Assembly', description: 'Assembly of IKEA and other flat-pack furniture for home and office.' },
            { name: 'Minor Carpentry', description: 'Small carpentry works including repairs, adjustments, and custom pieces.' },
            { name: 'Blind & Curtain Fitting', description: 'Installation of blinds, curtains, and motorized window treatments.' },
            { name: 'General Repairs', description: 'Fixes for household items, appliances, and minor damages.' },
            { name: 'Childproofing', description: 'Safety installations including cabinet locks, gates, and corner protectors.' },
        ],
    },
    {
        id: 'painting',
        title: 'Painting & Decor',
        description: 'Professional painting and decorating services for interior and exterior projects. We offer wall painting, texture finishes, wallpaper installation, decorative coatings, and color consultation. Quality materials and clean workmanship guaranteed.',
        iconName: 'Paintbrush',
        link: '/services/painting',
        sourcePartner: 'HomeFixer / Dedicated Technical',
        emergencyAvailable: false,
        priceRange: 'AED 8 - 25 per sqft',
        features: [
            'Free color consultation',
            'Premium paint brands',
            'Clean workmanship',
            'Furniture protection',
            'Wall preparation included',
            'Touch-up guarantee',
        ],
        subServices: [
            { name: 'Interior Painting', description: 'Wall and ceiling painting for bedrooms, living rooms, and offices.' },
            { name: 'Exterior Painting', description: 'Weather-resistant painting for building facades, villas, and fences.' },
            { name: 'Wallpaper Installation', description: 'Professional wallpaper fixing, removal, and pattern matching.' },
            { name: 'Texture Finishes', description: 'Decorative textures including stucco, polished plaster, and faux finishes.' },
            { name: 'Wood & Metal Painting', description: 'Painting and varnishing of doors, windows, grills, and furniture.' },
            { name: 'Epoxy Flooring', description: 'Industrial-grade epoxy coating for garages, warehouses, and commercial floors.' },
            { name: 'Anti-Mold Treatment', description: 'Specialized paint and treatments to prevent mold and mildew.' },
        ],
    },
    {
        id: 'fit-out',
        title: 'Fit-Out Works',
        description: 'Complete office and residential fit-out services including space planning, partition installation, flooring, ceiling work, custom carpentry, and interior finishing. We deliver turnkey solutions for commercial offices, retail spaces, and luxury homes.',
        iconName: 'Home',
        link: '/services/fit-out',
        sourcePartner: 'HomeFixer / MEF Maintenance',
        emergencyAvailable: false,
        features: [
            'Turnkey solutions',
            'Design to completion',
            'Project management',
            'DM approvals handled',
            'Quality materials',
            'Timeline guarantee',
        ],
        subServices: [
            { name: 'Office Fit-Out', description: 'Complete office interiors including partitions, workstations, and meeting rooms.' },
            { name: 'Retail Fit-Out', description: 'Shop and showroom interiors with custom displays and branding.' },
            { name: 'Partition Installation', description: 'Glass, gypsum, and wooden partitions for space division.' },
            { name: 'Flooring Works', description: 'Carpet tiles, vinyl, wood, and raised flooring for commercial spaces.' },
            { name: 'Ceiling Works', description: 'Grid, gypsum, baffle, and acoustic ceiling installations.' },
            { name: 'Custom Carpentry', description: 'Bespoke furniture, reception desks, and storage solutions.' },
            { name: 'MEP Works', description: 'Electrical, plumbing, and HVAC integration for fit-out projects.' },
            { name: 'Glass & Aluminum Work', description: 'Glass doors, windows, partitions, and aluminum frameworks.' },
        ],
    },
    {
        id: 'pool-maintenance',
        title: 'Pool & Tank Services',
        description: 'Professional pool maintenance and water tank cleaning services. We handle swimming pool cleaning, chemical balancing, filtration system repairs, water tank sanitization, and pump maintenance. Regular service contracts available for residential and commercial properties.',
        iconName: 'Waves',
        link: '/services/pool-maintenance',
        sourcePartner: 'Dedicated Technical / MEF Maintenance',
        emergencyAvailable: true,
        priceRange: 'AED 200 - 1,500',
        features: [
            'Licensed operators',
            'Municipality compliant',
            'Regular contracts',
            'Water quality testing',
            'Equipment supply',
            'Emergency callouts',
        ],
        subServices: [
            { name: 'Swimming Pool Cleaning', description: 'Regular cleaning of pool surfaces, tiles, and debris removal.' },
            { name: 'Chemical Balancing', description: 'Testing and adjusting pH, chlorine, and alkalinity levels.' },
            { name: 'Filtration System Service', description: 'Cleaning, repair, and replacement of pool filters and pumps.' },
            { name: 'Water Tank Cleaning', description: 'Municipal-compliant sanitization and cleaning of water storage tanks.' },
            { name: 'Pool Equipment Repair', description: 'Repair of pool heaters, pumps, covers, and lighting.' },
            { name: 'Pool Renovation', description: 'Retiling, replastering, and equipment upgrades for existing pools.' },
            { name: 'Annual Maintenance Contracts', description: 'Regular scheduled maintenance for hassle-free pool care.' },
        ],
    },
];

export class ServiceRepository {
    async getServices(): Promise<Service[]> {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => resolve(servicesData), 100);
        });
    }

    async getServiceById(id: string): Promise<Service | undefined> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(servicesData.find((s) => s.id === id)), 100);
        });
    }
}

export const serviceRepository = new ServiceRepository();
