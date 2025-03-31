import { useState, useEffect } from "react";
import { useNavigate, Routes, Route, BrowserRouter, useSearchParams } from "react-router-dom";
import Login from "./login";
import Products from "./Products";
import Cart from "./Cart";
import Register from "./register";
import Item from "./Item";
import { jwtDecode } from "jwt-decode";
import Search from "./Search";
import "./App.css";
import OrderPlaced from "./OrderPlaced";
import Purchase from "./Purchase";

function App() {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("Login");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setMessage("Logout");
        }
      } catch (error) {
        console.error("JWT Decode Error:", error);
      }
    }
  }, []);

  const handleLogoutLogin = () => {
    if (message === "Login") {
      navigate("/");
    } else {
      localStorage.removeItem("token");
      setMessage("Login");
      window.location.reload();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/searchProducts?query=${search}`);
  };

  return (
    <div>
      <div className="headers">
        <div className="headers1">
          {["electronics", "mobiles", "laptop", "Book"].map((category) => (
            <div key={category} className="header-elements" onClick={() => navigate(`/searchProducts?query=${category}`)}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
          ))}
          <div className="input-container">
            <form onSubmit={handleSearch}>
              <input onChange={(e) => setSearch(e.target.value)} placeholder="Search" type="text" className="search-inp" />
            </form>
          </div>
        </div>

        <div className="header-elements" onClick={() => navigate("/cart")}>Cart</div>
        <div className="header-elements" onClick={handleLogoutLogin}>{message}</div>
      </div>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/item/:id" element={<Item />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/searchProducts" element={<Search />} />
        <Route path="/register" element={<Register />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/order-placed" element={<OrderPlaced />} />
      </Routes>
    </div>
  );
}

export default App;
