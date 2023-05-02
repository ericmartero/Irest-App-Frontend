const BOOKING_KEY = process.env.REACT_APP_BOOKING_KEY;

export const ORDER_STATUS = {
    PENDING: 'PENDING',
    PREPARED: 'PREPARED',
    DELIVERED: 'DELIVERED'
}

export const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    PAID: 'PAID'
}

export const PAYMENT_TYPE = {
    CARD: 'CARD',
    CASH: 'CASH'
}

//BOOKING KEY
export const getBookingKey = () => {
    return localStorage.getItem(BOOKING_KEY);
}

export const setBookingKey = (key) => {
    localStorage.setItem(BOOKING_KEY, key);
}

export const removeBookingKey = () => {
    localStorage.removeItem(BOOKING_KEY);
}