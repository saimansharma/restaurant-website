import { useDispatch } from 'react-redux';
import { logout } from '../reducers/userSlice';

const useAuth = () => {
    const dispatch = useDispatch();

    const refreshToken = async () => {
        const refreshResponse = await fetch('https://restaurant-backend-springboot-fwcdbhdkdscvdhhe.uksouth-01.azurewebsites.net/api/auth/refresh-token', {
            method: 'POST',
            credentials: 'include',
        });

        if (refreshResponse.status === 200) {
            console.log("reaching inside true")
            return true;
        } else {
            console.log("reaching else statement")
            console.error('Unable to refresh access token. Logging out.');
            const logoutResponse = await fetch('https://restaurant-backend-springboot-fwcdbhdkdscvdhhe.uksouth-01.azurewebsites.net/api/auth/user/logout', {
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
