import { useEffect, useState } from "react";
import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useLocation } from "react-router-dom";
import { ResizableBox } from "react-resizable";
import { useNavigate } from "react-router-dom";
import "./search.css";

function Search() {
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search);
  const searchQuery = queryParam.get("query");
  const [error, setError] = useState(null);
  const [width, setWidth] = useState(300);
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
 
  const [nextPage, setNextPage] = useState(false);
  const [isSideBarOpen, setIsSidebarOpen] = useState(true);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sideBarSize, setSideriBarSize] = useState(15);
  const [page, setPage] = useState(1);
  const [ascending, setAscending] = useState(false);
  const [descending, setDescending] = useState(false);

  const navigate = useNavigate();
  const getProgressStyleLeft = (value) => {
    let percentage = ((value - 10000) / (100000 - 10000)) * 100;
    return {
      background: `linear-gradient(to right, #007bff ${percentage}%, white ${percentage}%)`,
    };
  };
  const getProgressStyleRight = (value) => {
    let percentage = ((value - 10000) / (100000 - 10000)) * 100;
    return {
      background: `linear-gradient(to right,rgb(246, 250, 255) ${percentage}%, #007bff ${percentage}%)`,
    };
  };
  const handleAscending = () => {
    setAscending((prev) => {
      if (!prev) setDescending(false); 
      return !prev;
    });
  };
  
  const handleDescending = () => {
    setDescending((prev) => {
      if (!prev) setAscending(false); // If enabling descending, disable ascending
      return !prev;
    });
  };
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3500/product/allproducts?search=${searchQuery}&page=${page}&minprice=${minPrice}&maxprice=${maxPrice}&limit=${10}&ascending=${ascending}&descending=${descending}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setProducts(data.allProducts);
        setNextPage(data.hasNext);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchItems();
  }, [searchQuery, page, maxPrice, minPrice, ascending, descending]);

  return (
    <div className="main-search">
      <div className="main-product-page">
        {/* Ensuring ResizableBox is flexible */}
        <PanelGroup autoSaveId="example" direction="horizontal">
          <Panel
            minSize={10}
            maxSize={30}
            defaultSize={30}
            size={sideBarSize}
           
            style={{ overflow: "auto" }}
          >
            <div className="filter-class">

           
            <div
              className="filter-container"
              style={{ width: { sideBarSize } }}
            >
              <h3>Price Filter</h3>

              <div className="price-range">
                {/* Min Price */}
                <div className="price-input">
                  <label>
                    Min Price: <span>Rs. {minPrice}</span>
                  </label>
                  <input
                    step="10000"
                    type="range"
                    min="10000"
                    max="100000"
                    style={getProgressStyleLeft(minPrice)}
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                  />
                </div>

                {/* Max Price */}
                <div className="price-input">
                  <label>
                    Max Price: <span>Rs. {maxPrice}</span>
                  </label>
                  <input
                    step="10000"
                    type="range"
                    min="10000"
                    max="100000"
                    value={maxPrice}
                    style={getProgressStyleRight(maxPrice)}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div>
  <input
    id="increasing"
    type="checkbox"
    checked={ascending}
    onChange={handleAscending}
  />
  <label htmlFor="increasing" style={{ cursor: "pointer" }}>
    Sort by increasing
  </label>

  <br />

  <input
    id="decreasing"
    type="checkbox"
    checked={descending}
    onChange={handleDescending}
  />
  <label htmlFor="decreasing" style={{ cursor: "pointer" }}>
    Sort by decreasing
  </label>
</div>
            </div>
          </Panel>

          <PanelResizeHandle className="resize-handle"></PanelResizeHandle>
          {/* Product List */}
          <Panel>
            <div className="productspage">
              {products.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/item/${item.id}`)}
                  className="product-container"
                >
                  <div>
                    <img
                      className="product-img"
                      src={item.image}
                      alt={item.description}
                    />
                  </div>
                  <div>
                    <div className="product">{item.description}</div>
                    <div>
                      <b>
                        <p style={{ fontWeight: "bolder" }}>
                          {" "}
                          Rs. {item.price}
                        </p>
                      </b>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Pagination */}
      <div>
        {page > 1 && (
          <button className="page-btn" onClick={() => setPage(page - 1)}>
            Prev
          </button>
        )}

        {nextPage && (
          <button className="page-btn" onClick={() => setPage(page + 1)}>
            Next
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Search;
