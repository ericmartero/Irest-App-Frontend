import { PAYMENT_STATUS } from "../utils/constants";
const HOST_API = process.env.REACT_APP_HOST_API;

export const createPaymentApi = async(dtoCreatePayment, token) => {
    try {
        const url = `${HOST_API}/api/payments`;
        const params = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dtoCreatePayment)
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const getPaymentByTableApi = async(idTableBooking, token) => {
    try {
        const tableFilter = `table=${idTableBooking}`;
        const statusFilter = `statusPayment=${PAYMENT_STATUS.PENDING}`;

        const url = `${HOST_API}/api/payments/?${tableFilter}&${statusFilter}`;
        const params = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const closePaymentApi = async(idPayment, token) => {
    try {
        const url = `${HOST_API}/api/payments/${idPayment}`;
        const params = {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                statusPayment: PAYMENT_STATUS.PAID
            })
        }

        await fetch(url, params);

    } catch (error) {
        throw error;
    }
}

export const getPaymentApi = async(token) => {
    try {
        const paymentFilter = `statusPayment=${PAYMENT_STATUS.PAID}`;
        
        const url = `${HOST_API}/api/payments/?${paymentFilter}`;
        const params = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}