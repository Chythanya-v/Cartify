const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchProducts = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/products`);
        console.log(response);
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};