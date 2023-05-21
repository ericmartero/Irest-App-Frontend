import { useState, useCallback } from "react";
import { getEstablishmentsApi, addEstablishmentApi, updateEstablishmentApi, deleteEstablishmentApi } from '../api/establishment';
import { useAuth } from './';
import { useHistory } from "react-router-dom";

export function useEstablishment() {

    const history = useHistory();
    const [establishments, setEstablishments] = useState(null);
    const [loadingCrud, setLoadingCrud] = useState(false);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();

    const getEstablishments = useCallback( async () => {
        try {
            setLoading(true);
            const response = await getEstablishmentsApi(auth.token);
            setLoading(false);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            setEstablishments(response);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }, [auth?.token, history]);

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

    const updateEstablishment = async (id, data) => {
        try {
            setLoadingCrud(true);
            await updateEstablishmentApi(id, data, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    };

    const deleteEstablishment = async (id) => {
        try {
            setLoadingCrud(true);
            await deleteEstablishmentApi(id, auth.token);
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
        updateEstablishment,
        deleteEstablishment,
    }
}
