import { resetKeyApi, reserveTableApi } from "../api/table-booking";
import { useAuth } from "./useAuth";

export function useTableBooking() {

    const { auth } = useAuth();

    const resetKey = async (id) => {
        try {
           return await resetKeyApi(id, auth.token);
        } catch (error) {
            throw error;
        }
    };

    const reserveTable = async (id) => {
        try {
           return await reserveTableApi(id);
        } catch (error) {
            throw error;
        }
    };

    return {
        resetKey,
        reserveTable,
    }
}
