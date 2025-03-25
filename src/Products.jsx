import { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import fashionLogo from "./images/pexels-photo-14742011.webp";
import fridge from "./images/Appliances-QC-PC-186x116--B08345R1ZW._SY116_CB667322346_.jpg";
import air_conditioner from "./images/Appliances-QC-PC-186x116--B08RDL6H79._SY116_CB667322346_.jpg";
import microwave from "./images/Appliances-QC-PC-186x116--B07G5J5FYP._SY116_CB667322346_.jpg";
import washingmachine from "./images/186x116---wm._SY116_CB667322346_.jpg";
import clothing from "./images/clothing.jpg";
import footwear from "./images/footwear.jpg";
import jewels from "./images/jewels.jpg";
import watches from "./images/watches.jpg";
import toy1 from "./images/toy1.jpg";
import toy2 from "./images/toy2.jpg";
import toy3 from "./images/toy3.jpg";
import toy4 from "./images/toy4.jpg";
import zebronics from "./images/zebronics.jpg";
import noise from "./images/noise.jpg";
import boult from "./images/boult.jpg";
import boat from "./images/boat.jpg";
import fit1 from "./images/fit1.jpg";
import { Link } from "react-router-dom";
import fit2 from "./images/fit2.jpg";
import fit3 from "./images/fit3.jpg";
import fit4 from "./images/fit4.jpg";
import { useNavigation } from "react-router-dom";

// Importing background images correctly
import bg1 from "./images/background-img.jpg";
import bg2 from "./images/background-img2.jpg";
import bg3 from "./images/Background-img3.png";

import "./Products.css";

function Products() {
  // State variables
  const [message, setMessage] = useState("");

  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [ind, setInd] = useState(0);

  // Array of background images
  const images = [bg1, bg2,bg3];
  //useRef
  const rightScroll=()=>{
    if(scrollByRef.current){
     
      scrollByRef.current.scrollBy({left:300})
    }
  }
  const leftScroll=()=>{
    if(scrollByRef.current){
      scrollByRef.current.scrollBy({left:-300})
    }
  }
  const scrollByRef=useRef(null)
  const rightScroll2=()=>{
    if(scrollByRef2.current){
     
      scrollByRef2.current.scrollBy({left:300})
    }
  }
  const leftScroll2=()=>{
    if(scrollByRef2.current){
      scrollByRef2.current.scrollBy({left:-300})
    }
  }
  const scrollByRef2=useRef(null)
  //useEffect
  useEffect(() => {
    const allproduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:3500/product/allproducts?limit=${100}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 401) {
          navigate("/");
        }
        if (!response.ok) {
          throw new Error("Can't fetch products");
        }
        const p = await response.json();
        console.log(p)
        setData(p.allProducts);
      } catch (err) {
        setMessage(err.message);
      }
    };

    allproduct();
  }, [navigate, token]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
   
     setInterval(() => {
      setInd((prev) => (prev + 1) % images.length);
    }, 3000);
    

    
  }, []);
  //datafilter
const book=data.filter((item)=>(item.category==="book"))
const laptop=data.filter((item)=>(item.category==="laptop"))
console.log(book)
  const groupedData = data.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    if (acc[product.category].length < 4) {
      acc[product.category].push(product);
    }
    return acc;
  }, {});
  //navigation
 
  return (
    <div className="container">
      

      {/* Background Image */}
      <div
        className="table"
        style={{
          backgroundImage: `url(${images[ind]})`,
        }}
      >
        <div className="category-box">
          <div>
            <p>Electronics up to 50% offers</p>
          </div>

          <div className="box-row1">
            <div className="box">
              <img className="product-img" src={fridge} alt="Fridge" />
              <p>Fridge</p>
            </div>
            <div className="box">
              <img className="product-img" src={air_conditioner} alt="Air Conditioner" />
              <p>Air Conditioner</p>
            </div>
          </div>
          <div className="box-row1">
            <div className="box">
              <img className="product-img" src={microwave} alt="Microwave" />
              <p>Microwave</p>
            </div>
            <div className="box">
              <img className="product-img" src={washingmachine} alt="Washing Machine" />
              <p>Washing Machine</p>
            </div>
          </div>
        </div>

        <div className="category-box">
          <div>
            <p>Up to 40% off on styles</p>
          </div>

          <div className="box-row1">
            <div className="box">
              <img className="product-img" src={clothing} alt="Clothing" />
              <p>Clothing</p>
            </div>
            <div className="box">
              <img className="product-img" src={footwear} alt="Footwear" />
              <p>Footwear</p>
            </div>
          </div>
          <div className="box-row1">
            <div className="box">
              <img className="product-img" src={watches} alt="Watches" />
              <p>Watches</p>
            </div>
            <div className="box">
              <img className="product-img" src={jewels} alt="Jewellery" />
              <p>Jewellery</p>
            </div>
          </div>
        </div>

        <div className="category-box">
          <div>
            <p>Best Seller in Games and Toys</p>
          </div>

          <div className="box-row1">
            <div className="box">
              <img className="product-img" src={toy1} alt="Toy 1" />
            </div>
            <div className="box">
              <img className="product-img" src={toy2} alt="Toy 2" />
            </div>
          </div>
          <div className="box-row1">
            <div className="box">
              <img className="product-img" src={toy3} alt="Toy 3" />
            </div>
            <div className="box">
              <img className="product-img" src={toy4} alt="Toy 4" />
            </div>
          </div>
        </div>

        <div className="category-box">
          <div>
            <p>Headphones starting at Rs 149</p>
          </div>

          <div className="box-row1">
            <div className="box">
              <img className="product-img" src={boat} alt="Boat" />
            </div>
            <div className="box">
              <img className="product-img" src={boult} alt="Boult" />
            </div>
          </div>
          <div className="box-row1">
            <div className="box">
              <img className="product-img" src={zebronics} alt="Zebronics" />
            </div>
            <div className="box">
              <img className="product-img" src={noise} alt="Noise" />
            </div>
          </div>
        </div>
        <div className="category-box">
          <div>
            <p>Best seller on fitness</p>
          </div>

          <div className="box-row1">
            <div className="box">
              <img className="product-img" src={fit1} alt="Boat" />
            </div>
            <div className="box">
              <img className="product-img" src={fit2} alt="Boult" />
            </div>
          </div>
          <div className="box-row1">
            <div className="box">
              <img className="product-img" src={fit3} alt="Zebronics" />
            </div>
            <div className="box">
              <img className="product-img" src={fit4} alt="Noise" />
            </div>
          </div>
        </div>
      </div>

      <hr></hr>
      <h1 className="book-row">BOOKS</h1>
      <div className="row-container">
        
      
  <button className="leftScroll-btn" onClick={leftScroll}> ⬅️</button>
  
  <div className="row1" ref={scrollByRef}>
    {book.map((item) => (
      <div className="items" key={item.id} onClick={() => navigate(`/item/${item.id}`)}>
        <img className="book-img" src={item.image} alt="Book" />
      </div>
    ))}
  </div>

  <button className="rightScroll-btn" onClick={rightScroll}>➡️</button>
</div>
<hr></hr>
<h1 className="book-row">LAPTOPS</h1>
      <div className="row-container">
        
        
  <button className="leftScroll-btn" onClick={leftScroll2}> ⬅️</button>
  
  <div className="row1" ref={scrollByRef2}>
    {laptop.map((item) => (
      <div className="items" key={item.id} onClick={() => navigate(`/item/${item.id}`)}>
          <img className="book-img" src={item.image} alt="laptop" />
     
      </div>
    ))}
  </div>

  <button className="rightScroll-btn" onClick={rightScroll2}>➡️</button>
</div>
     
    </div>
  );
}

export default Products;
