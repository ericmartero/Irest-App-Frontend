import { useState, useCallback } from "react";
import { getTablesApi, addTableApi, updateTableApi, deleteTableApi, getTableApi, getTableClientApi } from '../api/table';
import { useAuth } from './';
import { useHistory } from "react-router-dom";

export function useTable() {

    const history = useHistory();
    const [tables, setTables] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingCrud, setLoadingCrud] = useState(false);
    const [error, setError] = useState(null);
    const { auth, authClient } = useAuth();

    const getTables = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getTablesApi(auth.token);
            setLoading(false);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            if (response.error) {
                setError(response.error);
            } else {
                setTables(response);
            }

        } catch (error) {
            setLoading(false);
            throw error;
        }
    }, [auth?.token, history]);

    const addTable = async (data) => {
        try {
            setLoadingCrud(true);
            await addTableApi(data, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    };

    const updateTable = async (id, data) => {
        try {
            setLoadingCrud(true);
            await updateTableApi(id, data, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    };
    const updateTableClient = async (id, data) => {
        try {
            setLoadingCrud(true);
            await updateTableApi(id, data, authClient.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    };

    const deleteTable = async (id) => {
        try {
            setLoadingCrud(true);
            await deleteTableApi(id, auth.token);
            setLoadingCrud(false);
        } catch (error) {
            setLoadingCrud(false);
            throw error;
        }
    };

    const getTableById = useCallback(async (id) => {
        try {
            const response = await getTableApi(id, auth.token);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            setTables(response);

        } catch (error) {
            throw error;
        }
    }, [auth?.token, history])

    const getTableClient = useCallback(async (id) => {
        try {
            setLoading(true);
            const response = await getTableClientApi(id);
            setLoading(false);

            if (response.statusCode === 401 || response.statusCode === 500) {
                localStorage.clear();
                history.push("/");
            }

            setTables(response);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }, [history]);

    return {
        tables,
        loading,
        loadingCrud,
        error,
        getTables,
        addTable,
        updateTable,
        updateTableClient,
        deleteTable,
        getTableById,
        getTableClient,
    }
}