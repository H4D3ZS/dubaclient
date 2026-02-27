import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    isMobileMenuOpen: boolean;
    isContactModalOpen: boolean;
}

const initialState: UiState = {
    isMobileMenuOpen: false,
    isContactModalOpen: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleMobileMenu: (state) => {
            state.isMobileMenuOpen = !state.isMobileMenuOpen;
        },
        setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
            state.isMobileMenuOpen = action.payload;
        },
        toggleContactModal: (state) => {
            state.isContactModalOpen = !state.isContactModalOpen;
        },
        setContactModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isContactModalOpen = action.payload;
        },
    },
});

export const {
    toggleMobileMenu,
    setMobileMenuOpen,
    toggleContactModal,
    setContactModalOpen
} = uiSlice.actions;

export default uiSlice.reducer;
