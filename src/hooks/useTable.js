import { useState, useCallback } from "react";
import { getTablesApi, addTableApi, updateTableApi, deleteTableApi } from '../api/table';
import { useAuth } from './';

export function useTable() {

    const [tables, setTables] = useState(null);
    const { auth } = useAuth();

    const getTables = useCallback( async () => {
        try {
            const response = await getTablesApi(auth.token);
            setTables(response);
        } catch (error) {
            throw error;
        }
    }, [auth?.token]);

    const addTable = async (data) => {
        try {
            await addTableApi(data, auth.token);
        } catch (error) {
            throw error;
        }
    };

    const updateTable = async (id, data) => {
        try {
            await updateTableApi(id, data, auth.token);
        } catch (error) {
            throw error;
        }
    };

    const deleteTable = async (id) => {
        try {
            await deleteTableApi(id, auth.token);
        } catch (error) {
            throw error;
        }
    };

    return {
        tables,
        getTables,
        addTable,
        updateTable,
        deleteTable,
    }
}