import { resetKeyApi, reserveTableApi, joinTableApi, changeAlertApi } from "../api/table-booking";
import { useAuth } from "./useAuth";
import { useHistory } from "react-router-dom";

export function useTableBooking() {

    const history = useHistory();
    const { auth, authClient } = useAuth();

    const resetKey = async (id) => {
        try {
            const response = await resetKeyApi(id, auth.token);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            return response;
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
            const response = await changeAlertApi(id, status, auth.token);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            return response;
        } catch (error) {
            throw error;
        }
    };

    const changeAlertClient = async (id, status) => {
        try {
            const response = await changeAlertApi(id, status, authClient.token);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            return response;
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
