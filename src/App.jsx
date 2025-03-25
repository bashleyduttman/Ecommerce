import { useState } from "react";
import {
  useNavigate,
  Routes,
  Route,
  BrowserRouter,
  useSearchParams,
} from "react-router-dom";
import Login from "./login";
import Products from "./Products";
import Cart from "./Cart";
import Register from "./register";
import Item from "./Item";
import { jwtDecode } from "jwt-decode";
import Search from "./Search";
import { useEffect } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [reload, setReload] = useState(false);
  const [message, setMessage] = useState("");
  const [searchParameter] = useSearchParams();
  const query = searchParameter.get("query");
  if (query === "newpage") {
    setReload(true);
  }
  const navigate = useNavigate();

  const handleLogoutLogin = (message) => {
    if (message === "Login") {
      navigate("/");
    } else {
      localStorage.removeItem("token");
      setMessage("Login");
    }
  };
  // useEffect(() => {
  //   const reloading = () => {
  //     window.location.reload();
  //     setReload(false);
  //   };
  //   if (reload) {
  //     reloading();
  //   }
  // }, [reload]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Login");
    } else {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 <= Date.now()) {
        setMessage("Login");
      } else {
        setMessage("Logout");
      }
    }
  }, []);
  const changeSearch = (e) => {
    setSearch(e);
  };
  

  const handleSearch = (e) => {
    e.preventDefault();

    window.location.href = `/searchProducts?query=${search}`;

    // navigate(`/searchProducts?query=${search}`)
  };

  const handleCart = () => {
    navigate("/cart");
  };

  return (
    <div>
      <div className="headers">
     
        <div className="headers1">
          <div
         
            className="header-elements"
            onClick={() => {
              window.location.href = `/searchProducts?query=electronics`;
            }}
          >
            Electronics
          </div>
          <div
           
             className="header-elements"
            onClick={() => {
              window.location.href = `/searchProducts?query=mobiles`;
            }}
          >
            Mobiles
          </div>
          <div
           
             className="header-elements"
            onClick={() => {
              window.location.href = `/searchProducts?query=laptop`;
            }}
          >
            Laptops
          </div>
          <div
           
             className="header-elements"
            onClick={() => {
              window.location.href = `/searchProducts?query=Book`;
            }}
          >
            Books
          </div>
          <div className="input-container">
            <form onSubmit={handleSearch}>
              <input
                onChange={(e) => changeSearch(e.target.value)}
                placeholder="search"
                type="text"
                className="search-inp"
              ></input>
            </form>
          </div>
        </div>

      

        <div className="header-elements" onClick={handleCart} >
          Cart
        </div>
        <div
        
           className="header-elements"
          onClick={() => handleLogoutLogin(message)}
        >
          {message}
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/item/:id" element={<Item />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/searchProducts" element={<Search />} />
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </div>
  );
}

export default App;
