import { resetKeyApi, reserveTableApi, joinTableApi, changeAlertApi } from "../api/table-booking";
import { useAuth } from "./useAuth";

export function useTableBooking() {

    const { auth, authClient } = useAuth();

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

    const joinTable = async (id, key) => {
        try {
           return await joinTableApi(id, key);
        } catch (error) {
            throw error;
        }
    };

    const changeAlert = async (id, status) => {
        try {
           return await changeAlertApi(id, status, auth.token);
        } catch (error) {
            throw error;
        }
    };

    const changeAlertClient = async (id, status) => {
        try {
           return await changeAlertApi(id, status, authClient.token);
        } catch (error) {
            throw error;
        }
    };

    return {
        resetKey,
        reserveTable,
        joinTable,
        changeAlert,
        changeAlertClient,
    }
}
