import React, { useState, useEffect } from "react";
import { fetchProducts } from "../../utils/api";

export default function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchProducts();
            setProducts(data);
        };
        loadProducts();
    }, []);

    console.log(products);
    return (
        <div>
            <h1>Products Page</h1>
            {products.length > 0 && products.map((product) => (
                <div key={product.id}>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>Price: ${product.price}</p>
                </div>
            ))}
        </div>
    );
}