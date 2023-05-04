const PRODUCTS_SHOPPING_CART = "products_cart";

export function getProductShoppingCart() {
    const productsCart = localStorage.getItem(PRODUCTS_SHOPPING_CART);
    return JSON.parse(productsCart || "[]");
};

export function addProductShoppingCart(idProduct) {
    const productsCart = getProductShoppingCart();
    productsCart.push(idProduct);
    localStorage.setItem(PRODUCTS_SHOPPING_CART, JSON.stringify(productsCart));
};

export function removeProductShoppingCart(idProduct) {
    const productsCart = getProductShoppingCart();
    const index = productsCart.indexOf(idProduct);
    if (index > -1) {
        productsCart.splice(index, 1);
    }
    localStorage.setItem(PRODUCTS_SHOPPING_CART, JSON.stringify(productsCart));
};

export function cleanProductShoppingCart() {
    localStorage.removeItem(PRODUCTS_SHOPPING_CART);
};