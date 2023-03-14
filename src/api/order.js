const HOST_API = process.env.REACT_APP_HOST_API;

export const getOrdersByTableApi = async(idTable, status) => {
    try {
        const tableFilter = `table=${idTable}`;
        const statusFilter = `status=${status}`;
        const closeFilter = `close=false`;

        const url = `${HOST_API}/api/orders/?${tableFilter}&${statusFilter}&${closeFilter}`;
        
        const resp = await fetch(url);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const checkDeliveredOrderApi = async(id) => {
    try {
        const url = `${HOST_API}/api/orders/${id}`;
        const params = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'DELIVERED'
            })
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}

export const addOrderToTableApi = async(idTable, idProduct) => {
    try {
        const url = `${HOST_API}/api/orders`;
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'PENDING',
                table: idTable,
                product: idProduct
            })
        }
        
        const resp = await fetch(url, params);
        await resp.json();

    } catch (error) {
        throw error;
    }
}

export const addPaymentToOrderApi = async(idOrder, idPayment) => {
    try {
        const url = `${HOST_API}/api/orders/${idOrder}`;
        const params = {
            method: 'PATCH',
            headers: {
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

export const closeOrderApi = async(idOrder) => {
    try {
        const url = `${HOST_API}/api/orders/${idOrder}`;
        const params = {
            method: 'PATCH',
            headers: {
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

export const getOrdersByPaymentApi = async(idPayment) => {
    try {
        const paymentFilter = `payment=${idPayment}`;

        const url = `${HOST_API}/api/orders/?${paymentFilter}`;
        
        const resp = await fetch(url);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}