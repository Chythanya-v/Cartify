import React from "react";
import { Routes, Route } from "react-router-dom";
import Products from "./Produts";

export default function ProductsDashboard() {
    return (
        <Routes>
            <Route path="/" element={<Products />} />
        </Routes>
    );
}