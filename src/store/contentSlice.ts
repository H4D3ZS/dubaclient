import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Service, CompanyInfo, Testimonial } from '@/domain/types';
import { serviceRepository } from '@/infrastructure/repositories/ServiceRepository';
import { companyInfoRepository } from '@/infrastructure/repositories/CompanyInfoRepository';
import { testimonialRepository } from '@/infrastructure/repositories/TestimonialRepository';

interface ContentState {
    services: Service[];
    companyInfo: CompanyInfo | null;
    testimonials: Testimonial[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ContentState = {
    services: [],
    companyInfo: null,
    testimonials: [],
    isLoading: false,
    error: null,
};

export const fetchServices = createAsyncThunk(
    'content/fetchServices',
    async () => {
        const services = await serviceRepository.getServices();
        return services;
    }
);

export const fetchCompanyInfo = createAsyncThunk(
    'content/fetchCompanyInfo',
    async () => {
        const info = await companyInfoRepository.getCompanyInfo();
        return info;
    }
);

export const fetchTestimonials = createAsyncThunk(
    'content/fetchTestimonials',
    async () => {
        const testimonials = await testimonialRepository.getTestimonials();
        return testimonials;
    }
);

const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.services = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch services';
            })
            .addCase(fetchCompanyInfo.fulfilled, (state, action) => {
                state.companyInfo = action.payload;
            })
            .addCase(fetchTestimonials.fulfilled, (state, action) => {
                state.testimonials = action.payload;
            });
    },
});

export default contentSlice.reducer;
