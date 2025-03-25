import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";
function Register() {
  const navigate=useNavigate()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const handleForm = async (e) => {
    e.preventDefault();
    if (
      email.length == 0 ||
      name.length == 0 ||
      password.length == 0 ||
      confirmPassword.length == 0
    ) {
      setError("fields cant be empty");
      return
    } else if (confirmPassword !== password) {
      setError("password and confirm password doesn't match");
    } else {
      try {
        const response = await fetch("http://localhost:3500/auth/register", {
          method:"POST",
          headers:{"Content-Type": "application/json"},
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
        });
        if (!response.ok) {
          const message=await response.json()
          console.log(message)
          throw new Error(`${message.error}`);
        }
        else{
          navigate("/products")
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };
  
  return (
    <div className="register-page">
      <form onSubmit={handleForm}>
        <div className="register-form">
          <div>
            <input
              onChange={(e) => setName(e.target.value)}
              className="name-inp"
              type="text"
              placeholder="name"
            ></input>
          </div>
          <div>
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="email-inp"
              type="email"
              value={email} 
              placeholder="email"
            ></input>
          </div>

          <div>
            <input
              className="password-inp"
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <div>
            <input
              className="password-inp"
              type="password"
              placeholder="confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>
          </div>
        </div>
        <div>
          <button className="signup-btn">singup</button>
        </div>
        <div>{error}</div>
      </form>
      <button onClick={()=>navigate("/")}>already have account?</button>
    </div>
  );
}
export default Register;
