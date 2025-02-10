import React from 'react';
import { useStore } from './useStore';
import { Navigate } from 'react-router';
import { ROUTES } from '@/configs/constants';

// Định nghĩa kiểu cho các props của HOC
interface WithAuthenticationProps {
    // Các props khác bạn muốn truyền vào
}

export default function withAuthentication<P extends object>(
    WrappedComponent: React.ComponentType<P>
) {
    const WithAuthentication = (props: P & WithAuthenticationProps): React.ReactElement => {
        // store
        const {
            authStore: { token }
        } = useStore();

        if (!token) {
            return <Navigate to={ROUTES.home.href} />;
        }

        return <WrappedComponent {...(props as P)} />;
    };

    return WithAuthentication;
}
