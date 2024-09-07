import { useDispatch } from 'react-redux';
import { logout } from '../reducers/userSlice';

const useAuth = () => {
    const dispatch = useDispatch();

    const refreshToken = async () => {
        const refreshResponse = await fetch('http://localhost:8080/api/auth/refresh-token', {
            method: 'POST',
            credentials: 'include',
        });

        if (refreshResponse.ok) {
            return true;
        } else {
            console.error('Unable to refresh access token. Logging out.');
            const logoutResponse = await fetch('http://localhost:8080/api/auth/user/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (logoutResponse.ok) {
                dispatch(logout());
                window.location.href = '/login';
            }

            return false;
        }
    };

    return { refreshToken };
};

export default useAuth;
