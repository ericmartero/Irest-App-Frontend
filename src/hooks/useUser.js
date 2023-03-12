import { getMeApi } from '../api/auth';

export function useUser() {
    const getMe = async (token) => {
        try {
            const response = await getMeApi(token);
            return response;

        } catch (error) {
            throw error;
        }
    };

    return {
        getMe,
    };
}