import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
function Login() {
  //useStates
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [shake, setShake] = useState(false);
  const [response, setResponse] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
  
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 >= Date.now()) {
        navigate("/products");
      }
    }
  }, []);

  //handlerFunctions
  const handlePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        throw new Error(
          !password && !email
            ? "Enter email and password"
            : !password
            ? "Enter Password"
            : "Enter Username"
        );
      }
      const response = await fetch("http://localhost:3500/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Username or Password doesn't match");
      }
      setResponse(true);
      const data = await response.json();

      setMessage(data.message);
      localStorage.setItem("token", data.token);
      
      window.location.reload()
      setTimeout(()=>{
        navigate("/products");
      },1000)
     
    } catch (err) {
      setShake(true);
      setResponse(false);
      setTimeout(() => {
        setShake(false);
      }, 300);
      setMessage(err.message);
    }
  };

  //display
  return (
    <div className="main">
      <div className="side-box">
        <div>
          <span className="login-span">LOGIN </span> <br />{" "}
          <span className="login_txt-span">TO GET ACCESS TO YOUR ORDERS.</span>
        </div>
      </div>

      <div>
        <form
          className={`login-form ${shake ? "shake" : ""}`}
          onSubmit={handleLogin}
        >
          <div className="form-box">
            <input
              className="email-in"
              type="text"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password-container">
              <div>
                <input
                  className="password-in"
                  type={!showPassword ? "password" : "text"}
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={handlePassword}
                  className={
                    password.length > 0 ? "password-toggle" : "no-password"
                  }
                >
                  {!showPassword ? "🔒" : "🔓"}
                </button>
              </div>
            </div>
            <button className="submit-btn" type="submit">
              submit
            </button>
          </div>
        </form>
        <button className="no-account" onClick={() => navigate("/register")}>
          No Account?
        </button>
        <p style={{ color: response ? "green" : "red" }}>{message} &nbsp;</p>
      </div>
    </div>
  );
}
export default Login;
