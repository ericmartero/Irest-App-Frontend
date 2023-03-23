import { useState } from "react";
import { getTablesApi } from '../api/table';
import { useAuth } from './';

export function useTable() {

    const [tables, setTables] = useState(null);
    const { auth } = useAuth();

    const getTables = async () => {
        try {
            const response = await getTablesApi(auth.token);
            setTables(response);
        } catch (error) {
            throw error;
        }
    }

    return {
        tables,
        getTables,
    }
}