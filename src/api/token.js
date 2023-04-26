const TOKEN = process.env.REACT_APP_TOKEN;
const TOKEN_SESSION = process.env.REACT_APP_CLIENT_TOKEN;

//DASHBOARD TOKEN
export const getToken = () => {
    return localStorage.getItem(TOKEN);
}

export const setToken = (token) => {
    localStorage.setItem(TOKEN, token);
}

export const removeToken = () => {
    localStorage.removeItem(TOKEN);
}

//CLIENT TOKEN
export const getClientToken = () => {
    return localStorage.getItem(TOKEN_SESSION);
}

export const setClientToken = (token) => {
    localStorage.setItem(TOKEN_SESSION, token);
}

export const removeClientToken = () => {
    localStorage.removeItem(TOKEN_SESSION);
}