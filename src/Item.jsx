import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import "./Item.css";

function Item() {
  const { id } = useParams();
  const [userId, setUserId] = useState();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3500/product/item/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchAllProduct = async () => {
      if (product) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:3500/product/allproducts?category=${product.category}&limit=1000`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) throw new Error("Can't fetch products");

          const obj = await response.json();
          const data=obj.allProducts
          setAllProducts(data.filter((item) => item.id !== product.id));
        } catch (err) {
          setError(err.message);
        }
      }
    };
    if (product) fetchAllProduct();
  }, [product]);

  useEffect(() => {
    const getUserid = () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const decode = jwtDecode(token);
        setUserId(decode.id);
      } catch (err) {
        setError(err.message);
      }
    };
    getUserid();
  }, []);

  useEffect(() => {
    const getCartValue = async () => {
      if (userId && product) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:3500/cart/product?productId=${id}&userId=${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) throw new Error("Can't get cart");

          const data = await response.json();
          setQuantity(data.quantity);
        } catch (err) {
          console.error("Error fetching cart:", err);
        }
      }
    };
    getCartValue();
  }, [userId, product]);

  useEffect(() => {
    const cartUpdate = async () => {
      if (quantity !== null && product) {
        try {
          const token = localStorage.getItem("token");
          await fetch("http://localhost:3500/cart/add", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId: product.id,
              quantity: quantity,
              price: product.price,
            }),
          });
        } catch (err) {
          console.error("Error updating cart:", err);
        }
      }
    };
    cartUpdate();
  }, [quantity, product, userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="main-container">
      <div className="item-card">
        <img src={product.image} alt={product.name} className="item-img" />
        <div className="item-info">
          <h2>{product.name}</h2>
          <p className="item-description">{product.description}</p>
          <p className="price">Price: ₹{product.price}</p>
          <div className="cart-controls">
            <button 
              className="cart-btn" 
              onClick={() => setQuantity((prev) => (prev > 0 ? prev - 1 : 0))}
            >
              -
            </button>
            <span className="cart-quantity">{quantity}</span>
            <button 
              className="cart-btn" 
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <h3 className="more-products-title">More items you may like</h3>
      <div className="more-products">
        {allProducts.map((item) => (
          <div key={item.id} className="product-card" onClick={() => navigate(`/item/${item.id}`)}>
            <img  src={item.image} alt={item.name} className="product-img" />
            <p className="product-name">{item.name}</p>
            <p className="product-price">₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Item;
