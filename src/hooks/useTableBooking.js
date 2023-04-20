import { resetKeyApi } from "../api/table-booking";
import { useAuth } from "./useAuth";

export function useTableBooking() {

    const { auth } = useAuth();

    const resetKey = async (id) => {
        try {
            await resetKeyApi(id, auth.token);
        } catch (error) {
            throw error;
        }
    };

    return {
        resetKey,
    }
}
