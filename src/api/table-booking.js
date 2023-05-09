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

        if (resp.status === 409) {
            throw new Error("La mesa en la que intenta acceder esta desactivada");
        }

        return await resp.json();

    } catch (error) {
        throw error;
    }
}

export const joinTableApi = async(tableId, keyBooking) => {
    try {
        const url = `${HOST_API}/api/table-bookings/join`;
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                table: tableId,
                key: keyBooking
            })
        }

        const resp = await fetch(url, params);
        
        if (resp.status === 401) {
            throw new Error("La clave introducida es incorrecta");
        }

        if (resp.status === 409) {
            throw new Error("La mesa en la que intenta acceder esta desactivada");
        }

        return await resp.json();

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

export const changeAlertApi = async(tableBookingId, status, token) => {
    try {
        const url = `${HOST_API}/api/table-bookings/change-alert`;
        const params = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                table: tableBookingId,
                alert: status
            })
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;
        
    } catch (error) {
        throw error;
    }
}