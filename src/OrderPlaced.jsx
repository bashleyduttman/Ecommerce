import React from "react";
import { useNavigate } from "react-router-dom";
import "./OrderPlaced.css"; // Add some styling

const OrderPlaced = () => {
  const navigate = useNavigate();

  return (
    <div className="order-container">
      <h2>🎉 Order Placed Successfully!</h2>
      <p>Thank you for your purchase. Your order is being processed.</p>
      <button onClick={() => navigate("/products")}>Go to Home</button>
    </div>
  );
};

export default OrderPlaced;
