import { CompanyInfo } from '@/domain/types';

export const companyInfoData: CompanyInfo = {
    name: 'Quick Hire Prime Technical Services LLC',
    tagline: 'Home & Office Maintenance Solutions',
    address: 'Office 3001-486, Al Rigga Business Centre, Dubai UAE',
    phone: '+971 56 153 5466',
    email: 'info@quickhireprime.ae',
    socialLinks: {
        facebook: 'https://www.facebook.com/',
        instagram: 'https://www.instagram.com/',
    },
};

export class CompanyInfoRepository {
    async getCompanyInfo(): Promise<CompanyInfo> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(companyInfoData), 100);
        });
    }
}

export const companyInfoRepository = new CompanyInfoRepository();
