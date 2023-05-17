const BOOKING_KEY = process.env.REACT_APP_BOOKING_KEY;

export const getBookingKey = () => {
    return localStorage.getItem(BOOKING_KEY);
}

export const setBookingKey = (key) => {
    localStorage.setItem(BOOKING_KEY, key);
}

export const removeBookingKey = () => {
    localStorage.removeItem(BOOKING_KEY);
}