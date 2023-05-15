const CLIENT_ORDERS = "client_orders";

export function getClientOrders() {
    const clientOrders = localStorage.getItem(CLIENT_ORDERS);
    return JSON.parse(clientOrders || "[]");
};

export function addClientOrder(idOrder) {
    const clientOrders = getClientOrders();
    clientOrders.push(idOrder);
    localStorage.setItem(CLIENT_ORDERS, JSON.stringify(clientOrders));
};

export function removeClientOrder(idOrder) {
    const clientOrders = getClientOrders();
    const index = clientOrders.indexOf(idOrder);
    if (index > -1) {
        clientOrders.splice(index, 1);
    }
    localStorage.setItem(CLIENT_ORDERS, JSON.stringify(clientOrders));
};

export function cleanClientOrders() {
    localStorage.removeItem(CLIENT_ORDERS);
};