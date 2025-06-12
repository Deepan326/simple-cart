import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import productsData from "../../Products.json";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSortOption, setFilterSortOption] = useState("all");

  useEffect(() => {
    const handleSearchQuery = (e) => {
      setSearchQuery(e.detail.toLowerCase());
    };
    window.addEventListener("searchQueryChanged", handleSearchQuery);
    return () =>
      window.removeEventListener("searchQueryChanged", handleSearchQuery);
  }, []);

  const handleFilterSort = () => {
    let filtered = [...productsData];
    if (filterSortOption === "New" || filterSortOption === "Sale") {
      filtered = filtered.filter((product) => product.tag === filterSortOption);
    }
    if (filterSortOption === "low") {
      filtered.sort(
        (a, b) =>
          parseFloat(a.price.replace("$", "")) -
          parseFloat(b.price.replace("$", ""))
      );
    }
    if (filterSortOption === "high") {
      filtered.sort(
        (a, b) =>
          parseFloat(b.price.replace("$", "")) -
          parseFloat(a.price.replace("$", ""))
      );
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.ProductName.toLowerCase().includes(searchQuery)
      );
    }
    return filtered;
  };

  const displayedProducts = handleFilterSort();

  const addToCart = (product) => {
    const existing = JSON.parse(localStorage.getItem("cart")) || [];
    const alreadyCart = existing.find((product) => product.id === product.id);

    if (!alreadyCart) {
      const updatedProduct = { ...product, quantity: 1 };
      const updatedCart = [...existing, updatedProduct];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };
  return (
    <>
      <div className="shop-container">
        <div className="container">
          <h1 className="text-white py-4 fw-semibold">Products</h1>
          <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="text-muted" style={{ fontSize: "1.1rem" }}>
                Showing <strong>{displayedProducts.length}</strong>Product
                {displayedProducts.length !== 1 && "s"}for"
                {filterSortOption === "all"
                  ? "All"
                  : filterSortOption.charAt(0).toUpperCase() +
                    filterSortOption.slice(1)}
                "
              </div>
              <div>
                <select
                  className="form-select py-2 fs-6"
                  style={{
                    minWidth: "260px",
                    backgroundColor: "#f5f5f5",
                    border: "0px",
                  }}
                  value={filterSortOption}
                  onChange={(e) => setFilterSortOption(e.target.value)}
                >
                  <option value="all">All Products</option>
                  <option value="New">New Products</option>
                  <option value="Sale">Sale Products</option>
                  <option value="Low">Price:Low to High</option>
                  <option value="all">Price:High to Low</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            {displayedProducts.lenth === 0 ? (
              <div className="col-12">
                <div className="alert alert-danger text-center">
                  No Product Found Matching Your Search
                </div>
              </div>
            ) : (
              displayedProducts.map(product=>(
                <div className="col-md-3 mb-4" key={product.id}>
                    <div className="product-item text-center position-relative">
                        <div className="product-image w-100 position-relative overflow-hidden">
                            <img src={product.image} className="img-fluid" alt="not available" />
                        </div>
                    </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
