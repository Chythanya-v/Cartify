import React, { useState, useEffect } from "react";
import { fetchProducts } from "../../utils/api";
import CartImage from "../../assets/cart.png";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchProducts();
            setProducts(data);
        };
        loadProducts();
    }, []);

    const addItem = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.productId === product.id);
            if (existing) {
                return prev.map(item =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { productId: product.id, name: product.name, unitPrice: product.price, quantity: 1 }];
        });
    };

    const updateCartItem = (productId, action) => {
        setCartItems(prev =>
            prev.map(item =>
                item.productId === productId
                    ? { ...item, quantity: item.quantity + action }
                    : item
            ).filter(item => item.quantity > 0)
        );
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const grandTotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    return (
        <>
            {/* ── Header ── */}
            <div className="p-4 border-b flex justify-between border-gray-300 items-center">
                <div className="flex items-center gap-1">
                    <img src={CartImage} alt="Cartify" className="inline-block mr-2" />
                    <h1 className="font-extrabold text-4xl text-blue-500">Cartify</h1>
                </div>
                <button
                    className="relative bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => setIsCartOpen(true)}
                >
                    View Cart
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {totalItems}
                        </span>
                    )}
                </button>
            </div>

            {/* ── Product Grid ── */}
            <div className="flex flex-wrap gap-2 p-2">
                {products.length > 0 && products.map((product) => {
                    const cartItem = cartItems.find(item => item.productId === product.id);
                    return (
                        <div key={product.id} className="p-4 border rounded-lg border-gray-300">
                            <img src={product.imageUrl} alt={product.name} className="w-32 h-32 object-cover mb-2" />
                            <h2 className="font-semibold">{product.name}</h2>
                            <p className="text-gray-600 w-30">{product.description}</p>
                            <p className="font-bold">${product.price.toFixed(2)}</p>
                            {!cartItem ? (
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={() => addItem(product)}
                                >
                                    Add to Cart
                                </button>
                            ) : (
                                <div className="flex items-center mt-2">
                                    <button
                                        className="bg-gray-300 text-gray-700 px-2 py-1 rounded"
                                        onClick={() => updateCartItem(product.id, -1)}
                                    >-</button>
                                    <span className="mx-2">{cartItem.quantity}</span>
                                    <button
                                        className="bg-gray-300 text-gray-700 px-2 py-1 rounded"
                                        onClick={() => updateCartItem(product.id, 1)}
                                    >+</button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── Cart Sidebar ── */}
            {isCartOpen && (
                <>
                    {/* Backdrop — only covers area to the left of the drawer */}
                    <div
                        className="fixed top-0 left-0 h-full bg-white opacity-60 z-40"
                        style={{ width: 'calc(100% - 20rem)' }}
                        onClick={() => setIsCartOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col">
                        {/* Drawer header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
                            <button
                                className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
                                onClick={() => setIsCartOpen(false)}
                            >
                                ×
                            </button>
                        </div>

                        {/* Drawer body */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {cartItems.length === 0 ? (
                                <p className="text-gray-500 text-center mt-16">Your cart is empty.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {cartItems.map(item => {
                                        const product = products.find(p => p.id === item.productId);
                                        return (
                                            <li key={item.productId} className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                                {product?.imageUrl && (
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800">{item.name}</p>
                                                    <p className="text-sm text-gray-500">${item.unitPrice.toFixed(2)} each</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <button
                                                            className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-sm hover:bg-gray-300"
                                                            onClick={() => updateCartItem(item.productId, -1)}
                                                        >-</button>
                                                        <span className="text-sm font-medium">{item.quantity}</span>
                                                        <button
                                                            className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-sm hover:bg-gray-300"
                                                            onClick={() => updateCartItem(item.productId, 1)}
                                                        >+</button>
                                                    </div>
                                                </div>
                                                <p className="font-bold text-gray-800">
                                                    ${(item.unitPrice * item.quantity).toFixed(2)}
                                                </p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        {/* Drawer footer */}
                        {cartItems.length > 0 && (
                            <div className="p-4 border-t border-gray-200">
                                <div className="flex justify-between text-lg font-bold mb-4">
                                    <span>Total</span>
                                    <span>${grandTotal.toFixed(2)}</span>
                                </div>
                                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 font-semibold">
                                    Checkout
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
}