import { useDispatch } from 'react-redux';
import { logout } from '../reducers/userSlice';

const useAuth = () => {
    const dispatch = useDispatch();

    const refreshToken = async () => {
        try {
            const refreshResponse = await fetch('https://restaurant-backend-springboot-fwcdbhdkdscvdhhe.uksouth-01.azurewebsites.net/api/auth/refresh-token', {
                method: 'POST',
                credentials: 'include',
            });

            // Check if the refresh token was successful
            if (refreshResponse.ok) {
                console.log("Access token refreshed successfully");
                return true;
            } else if (refreshResponse.status === 401) {
                // Token is invalid or expired, proceed with logout
                console.log("Unauthorized: Unable to refresh access token. Logging out.");
                await logoutUser();
            } else {
                console.log("Unexpected error refreshing token:", refreshResponse.status);
            }
        } catch (error) {
            console.error('Error during token refresh:', error);
        }

        return false;  // Return false if refresh failed
    };

    const logoutUser = async () => {
        try {
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
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return { refreshToken };
};

export default useAuth;
