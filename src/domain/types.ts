export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string; // We'll map this to Lucide icons dynamically or via a helper
  link: string; // Internal routing link
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Testimonial {
  id: string;
  content: string;
  author: string; // The HTML didn't have names, so we might use "Satisfied Client" or similar
}
