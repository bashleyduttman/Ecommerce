import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useLocation, useNavigate } from "react-router-dom";
import "./Purchase.css"; // Import the CSS file

const Purchase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartData, products, price } = location.state || { cartData: [], products: [], price: 0 };

  return (
    <div className="purchase-container">
      <h2 className="purchase-title">Order Summary</h2>
      <ul className="product-list">
        {products.map((product, index) => {
          const cartItem = cartData.find((item) => item.productId === product.id);
          return (
            <li key={index} className="product-item">
              {product.name} - Quantity: {cartItem ? cartItem.quantity : 0}
            </li>
          );
        })}
      </ul>
      <h3 className="total-price">Total Price: ${price}</h3>

      <PayPalScriptProvider options={{ "client-id": "AWJTKYSg80aiM7ttSOa_cZrUzngdQnh0XzNIa4jhS0vAImQAML0TiY1lJ87PBqFvj5i_6yhh7BdmDiYI", currency: "USD" }}>
        <div className="paypal-container">
          <PayPalButtons
            createOrder={(data, actions) => {
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    description: "Purchase from Store",
                    amount: {
                      currency_code: "USD",
                      value: price
                    }
                  }
                ]
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then(() => {
                console.log("Order placed");
                navigate("/order-placed");
              });
            }}
          />
        </div>
      </PayPalScriptProvider>
    </div>
  );
};

export default Purchase;
