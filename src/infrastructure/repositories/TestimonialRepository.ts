import { Testimonial } from '@/domain/types';

export const testimonialsData: Testimonial[] = [
    {
        id: '1',
        content: "Their team stabilized our billing platform in under two weeks and delivered measurable reductions in reconciliation errors.",
        author: "Head of Finance Operations",
    },
    {
        id: '2',
        content: "We finally have a single partner who understands payments, compliance, and uptime. Incident response is best-in-class.",
        author: "VP of Payments",
    },
    {
        id: '3',
        content: "The revenue assurance reporting and gateway monitoring gave our leadership the visibility we needed.",
        author: "Director of Billing",
    },
];

export class TestimonialRepository {
    async getTestimonials(): Promise<Testimonial[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(testimonialsData), 100);
        });
    }
}

export const testimonialRepository = new TestimonialRepository();
