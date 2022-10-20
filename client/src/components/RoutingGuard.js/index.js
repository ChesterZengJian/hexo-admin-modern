import { getToken } from '@/utils';
import { Navigate } from 'react-router-dom';

function RoutingGuard({ children }) {
    const token = getToken();
    console.log('token:', token);

    if (token) {
        return <>{children}</>;
    } else {
        console.log('to login');
        return <Navigate to="/login" replace />;
    }
}

export { RoutingGuard };
