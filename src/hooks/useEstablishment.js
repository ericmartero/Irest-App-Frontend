import { useState, useCallback } from "react";
import { getEstablishmentsApi } from '../api/establishment';
import { useAuth } from './';

export function useEstablishment() {

    const [establishments, setEstablishments] = useState(null);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();

    const getEstablishments = useCallback( async () => {
        try {
            setLoading(true);
            const response = await getEstablishmentsApi(auth.token);
            setLoading(false);
            setEstablishments(response);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }, [auth?.token]);

    return {
        loading,
        establishments,
        getEstablishments,
    }
}
