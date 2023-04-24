import { useState, useCallback } from "react";
import { getEstablishmentsApi, addEstablishmentApi } from '../api/establishment';
import { useAuth } from './';

export function useEstablishment() {

    const [establishments, setEstablishments] = useState(null);
    const [loadingCrud, setLoadingCrud] = useState(false);
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

    const addEstablishment = async (data) => {
        try {
            setLoadingCrud(true);
            await addEstablishmentApi(data, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    };

    return {
        loading,
        loadingCrud,
        establishments,
        getEstablishments,
        addEstablishment,
    }
}
