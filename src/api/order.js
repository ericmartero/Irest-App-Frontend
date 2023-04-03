import { ORDER_STATUS } from '../utils/constants';
const HOST_API = process.env.REACT_APP_HOST_API;

export const getOrdersByTableApi = async(idTableBooking, token, status = '') => {
    try {
        const tableFilter = `table=${idTableBooking}`;
        const statusFilter = `status=${status}`;
        const closeFilter = `close=false`;

        let url = '';

        if (status === '') {
            url = `${HOST_API}/api/orders/?${tableFilter}&${closeFilter}`;
        } else {
            url = `${HOST_API}/api/orders/?${tableFilter}&${statusFilter}&${closeFilter}`;
        }
        
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

export const checkDeliveredOrderApi = async(idOrder, status, token) => {
    try {
        const url = `${HOST_API}/api/orders/${idOrder}`;
        const params = {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status
            })
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const addOrderToTableApi = async(idTableBooking, idProduct, token) => {
    try {
        const url = `${HOST_API}/api/orders`;
        const params = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: ORDER_STATUS.PENDING,
                table: idTableBooking,
                product: idProduct
            })
        }
        
        const resp = await fetch(url, params);
        await resp.json();

    } catch (error) {
        throw error;
    }
}

export const deleteOrderApi = async(idOrder, token) => {
    try {
        const url = `${HOST_API}/api/orders/${idOrder}`;
        const params = {
            method: 'DELETE',
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

export const addPaymentToOrderApi = async(idOrder, idPayment, token) => {
    try {
        const url = `${HOST_API}/api/orders/${idOrder}`;
        const params = {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                payment: idPayment
            })
        }
        
        const resp = await fetch(url, params);
        await resp.json();

    } catch (error) {
        throw error;
    }
}

export const closeOrderApi = async(idOrder, token) => {
    try {
        const url = `${HOST_API}/api/orders/${idOrder}`;
        const params = {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                close: true
            })
        }
        
        const resp = await fetch(url, params);
        await resp.json();

    } catch (error) {
        throw error;
    }
}

export const getOrdersByPaymentApi = async(idPayment, token) => {
    try {
        const paymentFilter = `payment=${idPayment}`;

        const url = `${HOST_API}/api/orders/?${paymentFilter}`;
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