import { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import "./cart.css";

function Cart() {
  const navigate=useNavigate()

  const [products, setProducts] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [error, setError] = useState(null);
  const [productQuantity, setProductQuantity] = useState({
    id: null,
    change: 0,
  });
  const [price, setPrice] = useState(0);
  const increaseQuantity = (id) => {
    setProductQuantity({ id, change: 1 });
  };

  const decreaseQuantity = (id) => {
    setProductQuantity({ id, change: -1 });
  };
  const purchasePage=()=>{
    navigate('/purchase',{
      state:{cartData:cartData,products:products,price:(price*0.012).toFixed(2)}
    })
  }

  const deleteItem = async (productId) => {
    console.log(productId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3500/cart/delete/${productId}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error("cant delete product");
      }
      fetchCartData();
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    if (!productQuantity.id) return;

    const updateQuantity = async () => {
      try {
        const token = localStorage.getItem("token");
        const cartItem = await fetch(
          `http://localhost:3500/cart/product?productId=${productQuantity.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-type": "application/json",
            },
          }
        );
        if (!cartItem.ok) {
          throw new Error("cant get cart");
        }
        const quan = await cartItem.json();
        const response = await fetch("http://localhost:3500/cart/add", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: productQuantity.id,
            quantity: quan.quantity + productQuantity.change,
          }),
        });

        if (!response.ok) {
          throw new Error("Can't update product quantity");
        }

        fetchCartData();
      } catch (err) {
        setError(err.message);
      }
    };

    updateQuantity();
  }, [productQuantity]);

  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3500/cart/allproducts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status===401) {
        throw new Error("Login to check out!");
      }
      else if(!response.ok){
        throw new Error("cant fetch products")
      }

      const data = await response.json();
      console.log(data);
      const filtered_data = data.filter((item) => item.quantity > 0);
      setCartData(filtered_data);

      fetchProductDetails(filtered_data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchProductDetails = async (cartData) => {
    try {
      const token = localStorage.getItem("token");
      const productPromises = cartData.map((item) =>
        fetch(`http://localhost:3500/product/item/${item.productId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).then((res) => {
          if (!res.ok) throw new Error("Can't fetch product");
          return res.json();
        })
      );

      const productsData = await Promise.all(productPromises);
      setProducts(productsData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);
  useEffect(() => {
    setTotalPrice();
  }, [products]);
  const setTotalPrice = () => {
    var p = 0;
    products.map((product) => {
      const item = cartData.find(
        (cartItem) => cartItem.productId === product.id
      );
      if (item) {
        p += product.price * item.quantity;
      }
    });
    setPrice(p);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      () => clearTimeout(timer);
      setTimeout(()=>navigate("/"),5000)
      
    }
  }, [error]);

  return (
    <div>
      <div className="cart-container">
        {error && <p style={{ color: "red" }}>{error}</p>}
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const cartItem = cartData.find(
                (item) => item.productId === product.id
              );
              return (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>
                    Rs. {product.price * (cartItem ? cartItem.quantity : 0)}
                  </td>
                  <td className="quantity-container">
                    <button
                      className="btn decrement"
                      onClick={() => decreaseQuantity(product.id)}
                    >
                      -
                    </button>
                    <span className="quantity-btn">
                      {cartItem ? cartItem.quantity : 0}
                    </span>
                    <button
                      className="btn increment"
                      onClick={() => increaseQuantity(product.id)}
                    >
                      +
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn delete-btn"
                      onClick={() => deleteItem(product.id)}
                    >
                       Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="total-price">Total Price: Rs. {price}</div>
      </div>
      {cartData.length > 0 && (
        <div className="buy-container">
          <button className="buy-btn" onClick={purchasePage}>Proceed to buy</button>
        </div>
      )}
    </div>
  );
}

export default Cart;
