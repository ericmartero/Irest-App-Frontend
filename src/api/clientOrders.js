const CLIENT_ORDERS = "client_orders";

export function getClientOrders() {
    const clientOrders = localStorage.getItem(CLIENT_ORDERS);
    return JSON.parse(clientOrders || "[]");
};

export function addClientOrder(idProductOrder) {
    const clientOrders = getClientOrders();
    clientOrders.push(idProductOrder);
    localStorage.setItem(CLIENT_ORDERS, JSON.stringify(clientOrders));
};

export function removeClientOrder(idProductOrder) {
    const clientOrders = getClientOrders();
    const index = clientOrders.indexOf(idProductOrder);
    if (index > -1) {
        clientOrders.splice(index, 1);
    }
    localStorage.setItem(CLIENT_ORDERS, JSON.stringify(clientOrders));
};

export function cleanClientOrders() {
    localStorage.removeItem(CLIENT_ORDERS);
};