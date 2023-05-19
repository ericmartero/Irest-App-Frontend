const HOST_API = process.env.REACT_APP_HOST_API;

export const checkoutStripeApi = async(amount, paymentMethodId, token) => {
    try {
        const url = `${HOST_API}/api/stripe`;
        const params = {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "amount": amount,
            "paymentMethod": paymentMethodId
        })
        }

        const resp = await fetch(url, params);
        const result = await resp.json();

        return result;

    } catch (error) {
        throw error;
    }
}