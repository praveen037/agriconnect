import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/cart/CartItem";
import "./CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    localStorage.setItem("checkoutItems", JSON.stringify(cart));
    navigate("/checkout");
  };

  const validCart = useMemo(() => cart.filter(item => item.product), [cart]);

  const totalAmount = useMemo(() => {
    return validCart.reduce((acc, item) => {
      const price = item.product.cost ?? item.price ?? 0;
      return acc + price * (item.quantity ?? 1);
    }, 0);
  }, [validCart]);

  return (
    <div className="cart-container">
      <div className="cart-left">
        <h2>Shopping Cart ({validCart.length} items)</h2>
        {validCart.length === 0 ? (
          <p className="empty-cart">
            Your cart is empty. <span onClick={() => navigate("/products")}>Shop Now</span>
          </p>
        ) : (
          validCart.map(item => (
            <CartItem
              key={item.product.id}
              item={{
                id: item.product.id,
                name: item.product.productName ?? "Unknown Product",
                price: item.product.cost ?? item.price ?? 0,
                quantity: item.quantity ?? 1,
                image: item.product.image ?? "",
                stock: item.product.stockQuantity ?? item.product.stockquantity ?? 0,
              }}
              onRemove={removeFromCart}
              onUpdateQty={updateQuantity}
            />
          ))
        )}
      </div>

      {validCart.length > 0 && (
        <div className="cart-right">
          <div className="price-details">
            <h3>PRICE DETAILS</h3>
            <hr />
            <div className="price-row">
              <span>Price ({validCart.length} items)</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>Delivery Charges</span>
              <span className="free">FREE</span>
            </div>
            <hr />
            <div className="total-row">
              <strong>Total Amount</strong>
              <strong>₹{totalAmount.toFixed(2)}</strong>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              PLACE ORDER
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
