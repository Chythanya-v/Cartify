import React, { useState, useEffect } from "react";
import { fetchProducts } from "../../utils/api";
import CartImage from "../../assets/cart.png";


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
            <div className="p-4 border-b border-gray-300 flex items-center">
                <img src={CartImage} alt="Cartify" className="inline-block mr-2" />
                <h1 className="font-extrabold text-2xl text-blue-500">Cartify</h1>
            </div>
            <div className="flex flex-wrap gap-2 p-2">
                {products.length > 0 && products.map((product) => (
                    <div key={product.id} className="p-4 border rounded-lg border-gray-300">
                        <img src={product.imageUrl} alt={product.name} className="w-32 h-32 object-cover mb-2" />
                        <h2 className="font-semibold">{product.name}</h2>
                        <p className="text-gray-600 w-xl">{product.description}</p>
                        <p className="font-bold">${product.price.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}