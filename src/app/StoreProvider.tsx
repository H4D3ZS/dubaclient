'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { ChatProvider } from '@/context/ChatContext';

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Provider store={store}>
            <ChatProvider>
                {children}
            </ChatProvider>
        </Provider>
    );
}
