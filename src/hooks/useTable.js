import { useState, useCallback } from "react";
import { getTablesApi, addTableApi, updateTableApi, deleteTableApi, getTableApi } from '../api/table';
import { useAuth } from './';

export function useTable() {

    const [tables, setTables] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingCrud, setLoadingCrud] = useState(false);
    const [error, setError] = useState(null);
    const { auth } = useAuth();

    const getTables = useCallback( async () => {
        try {
            setLoading(true);
            const response = await getTablesApi(auth.token);
            setLoading(false);

            if (response.error) {
                setError(response.error);
            } else {
                setTables(response);
            }
            
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }, [auth?.token]);

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

    const getTableById = useCallback( async (id) => {
        try {
            const response = await getTableApi(id, auth.token);
            setTables(response);
        } catch (error) {
            throw error;
        }
    }, [auth?.token]) 

    return {
        tables,
        loading,
        loadingCrud,
        error,
        getTables,
        addTable,
        updateTable,
        deleteTable,
        getTableById,
    }
}