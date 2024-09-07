import useAuth from '../utils/useAuth' // Adjust the path as necessary

const useCustomFetch = () => {
    const { refreshToken } = useAuth();

    const customFetch = async (url, options = {}) => {
        let response = await fetch(url, {
            ...options,
            credentials: 'include', // Send cookies with request
        });

        if (response.status !== 200) {
            const tokenRefreshed = await refreshToken();

            if (tokenRefreshed) {
                // Retry original request with the new access token
                response = await fetch(url, {
                    ...options,
                    credentials: 'include',
                });
            }
        }

        return response;
    };

    return { customFetch };
};

export default useCustomFetch;
