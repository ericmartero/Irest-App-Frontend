const HOST_API = process.env.REACT_APP_HOST_API;

export const reserveTableApi = async(tableId) => {
    try {
        const url = `${HOST_API}/api/table-bookings/reserve`;
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                table: tableId
            })
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const joinTableApi = async(dtoJoinTable) => {
    try {
        const url = `${HOST_API}/api/table-bookings/join`;
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dtoJoinTable)
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const resetKeyApi = async(tableBookingId, token) => {
    try {
        const url = `${HOST_API}/api/table-bookings/reset-key`;
        const params = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                table: tableBookingId
            })
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;
        
    } catch (error) {
        throw error;
    }
}