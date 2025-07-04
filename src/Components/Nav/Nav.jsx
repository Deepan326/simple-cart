import React from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function Nav() {
    const [cartCount,setIsCartCount]=useState(0);
    const [isCartOpen,setIsCartOpen]=useState(false);
    const [cartItems,setIsCartItems]=useState([])

    useEffect(()=>{
        const updateCart=()=>{
            const cart=JSON.parse(localStorage.getItem('cart')) || [];
            setIsCartItems(cart);
                        setIsCartCount(cart.length);

        }
        updateCart();

        window.addEventListener('cartUpdated',updateCart);
        return()=>window.removeEventListener("cartUpdated",updateCart)
    },[]);

    const removeItem=(id)=>{
        const updated = cartItems.filter(item=>item.id !==id);
        setIsCartItems(updated);
        localStorage.setItem('cart',JSON.stringify(updated));
        setIsCartCount(updated.length)
        window.dispatchEvent(new Event("cartUpdated"));
    }

    const totalPrice=cartItems.reduce((sum,item)=>{
        return sum + parseFloat(item.price.replace("$",""));
    },0).toFixed(2);

  return (
    <>
      <div className="px-5 bg-light">
        <nav className="navbar navbar-light justify-content-between px-5 w-100">
          <a href="#" className="navbar-brand fs-3 fw-bold">
            Home
          </a>

          <div className="product-search flex-grow-1 d-flex justify-content-center">
            <input
              type="text"
              className="form-control"
              placeholder="Search for products..."
              style={{ maxWidth: "500px" }}
              onChange={(e)=>{
                const query=e.target.value
                window.dispatchEvent(new CustomEvent(`searchQueryChanged`,{detail:query}))
              }}
            />
          </div>
          <div
            className="cart-icon position-relative"
            style={{ cursor: "pointer" }}
            onClick={()=>setIsCartOpen(true)}
          >
            <i className="bi bi-bag fs-4"></i>
            <span className="cart-qount">
              {cartCount}
            </span>
          </div>
        </nav>
      </div>


      <div className={`cart-sidebar ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="m-0">Your Cart</h5>
          <button
            className="btn btn-sm btn-outline-dark bg-dark text-white"
            onClick={() => setIsCartOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="cart-body p-3">
          {cartItems.length === 0 ? (
            <p className="alert alert-danger">Your Cart Is Empty</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="d-flex mb-3 align-items-center">
                <img
                  src={item.image}
                  alt=""
                  width={60}
                  height={60}
                  className="me-3 rounded"
                />
                <div className="flex-grow-1">
                  <h6 className="mb-1">{item.ProductName}</h6>
                  <p className="mb-1">{item.price}</p>
                </div>
                <button
                  className="btn btn-sm bg-dark text-white"
                  onClick={() => removeItem(item.id)}
                >
                  X
                </button>
              </div>
            ))
          )}
        </div>
        {cartItems.length>0 &&(
            <div className="cart-footer p-3 border-top">
                <h6>Total:${totalPrice}</h6>
                <button className="btn btn-dark w-100 mt-2">CheckOut</button>
            </div>
        )}
      </div>
    </>
  );
}
