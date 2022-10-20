import { getToken } from '@/utils';
import { Navigate } from 'react-router-dom';

function RoutingGuard({ children }) {
    const token = getToken();

    if (token) {
        return <>{children}</>;
    } else {
        return <Navigate to="/login" replace />;
    }
}

export { RoutingGuard };
