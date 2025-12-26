import React, { useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductImage from "../components/product/ProductImage";
import { createOrder, verifyPayment } from "../services/PaymentService";
import { getImageUrl } from "../utils/imageUrl";
import "./CheckoutPage.css";

// Shipping reducer for better state management
const shippingReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_SHIPPING':
      return { ...state, ...action.shipping };
    case 'RESET':
      return initialShippingState;
    default:
      return state;
  }
};

const initialShippingState = {
  name: "", 
  address: "", 
  city: "", 
  state: "", 
  zip: "", 
  phone: "", 
  email: ""
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart, totalAmount } = useCart();
  const { user } = useAuth();

  const [shipping, dispatch] = useReducer(shippingReducer, initialShippingState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (user) {
      dispatch({
        type: 'SET_SHIPPING',
        shipping: {
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email || ""
        }
      });
    }
  }, [user]);

  // Check Razorpay configuration
  useEffect(() => {
    if (!process.env.REACT_APP_RAZORPAY_KEY) {
      console.error("Razorpay key not configured");
    }
  }, []);

  const handleChange = (e) => {
    dispatch({
      type: 'UPDATE_FIELD',
      field: e.target.name,
      value: e.target.value
    });
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!shipping.name.trim()) newErrors.name = "Name is required";
    if (!shipping.address.trim()) newErrors.address = "Address is required";
    if (!shipping.city.trim()) newErrors.city = "City is required";
    if (!shipping.phone.trim()) newErrors.phone = "Phone is required";
    if (!shipping.email.trim()) newErrors.email = "Email is required";
    
    if (shipping.email && !/\S+@\S+\.\S+/.test(shipping.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (shipping.phone && !/^[6-9]\d{9}$/.test(shipping.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    
    if (shipping.zip && !/^\d{6}$/.test(shipping.zip)) {
      newErrors.zip = "Enter a valid 6-digit PIN code";
    }
    
    return newErrors;
  };

  // Helper functions for input configuration
  const getInputType = (field) => {
    const types = {
      email: 'email',
      phone: 'tel',
      zip: 'text'
    };
    return types[field] || 'text';
  };

  const getAutoComplete = (field) => {
    const autoCompleteMap = {
      name: 'name',
      email: 'email',
      phone: 'tel',
      address: 'street-address',
      city: 'address-level2',
      state: 'address-level1',
      zip: 'postal-code'
    };
    return autoCompleteMap[field];
  };

  const getPlaceholder = (field) => {
    const placeholders = {
      name: 'Enter your full name',
      email: 'your.email@example.com',
      phone: '9876543210',
      address: 'Your complete address',
      city: 'Your city',
      state: 'Your state',
      zip: '560001'
    };
    return placeholders[field];
  };

  const handlePayment = async () => {
    if (retryCount >= 3) {
      alert("Too many attempts. Please try again later.");
      return;
    }

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Mark all fields as touched to show errors
      const allTouched = Object.keys(shipping).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);
      alert("Please fix the errors before proceeding");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const userId = user?.id || JSON.parse(localStorage.getItem("currentUser"))?.id;
    if (!userId) {
      alert("Please login to continue!");
      navigate("/login");
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');

    try {
      const amountPaise = Math.round(totalAmount * 100);

      if (amountPaise < 100) {
        alert("Minimum order amount is ₹1");
        setLoading(false);
        setPaymentStatus('idle');
        return;
      }

      console.log("Creating order for:", { userId, amountPaise, totalAmount, cartItems: cart.length });

      // ✅ Send cart items to backend
      const orderData = await createOrder(amountPaise, userId, cart);
      console.log("Razorpay order created:", orderData);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        order_id: orderData.id,
        name: "AgriConnect",
        description: "Order Payment",
        prefill: {
          name: shipping.name,
          email: shipping.email,
          contact: shipping.phone
        },
        handler: async (response) => {
          try {
            console.log("Payment successful, verifying...", response);
            setPaymentStatus('verifying');

            const verifyResp = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            console.log("Verification response:", verifyResp);

            if (verifyResp.status === "success") {
              setPaymentStatus('success');
              clearCart();
              navigate("/paymentsuccess", {
                state: {
                  order: {
                    items: cart,
                    totalAmount,
                    shippingInfo: shipping,
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id
                  }
                }
              });
            } else {
              setPaymentStatus('error');
              alert("Payment verification failed! Please contact support.");
              setLoading(false);
            }
          } catch (err) {
            console.error("Verification error:", err);
            setPaymentStatus('error');
            alert("Payment verification failed! " + (err.response?.data?.message || err.message));
            setLoading(false);
          }
        },
        modal: { 
          ondismiss: () => {
            setLoading(false);
            setPaymentStatus('idle');
          }
        },
        theme: { color: "#6aae4f" }
      };

      new window.Razorpay(options).open();

    } catch (err) {
      console.error("Order creation error:", err);
      setPaymentStatus('error');
      
      let errorMessage = "Could not initiate payment: ";
      
      if (err.response?.status === 402) {
        errorMessage += "Payment declined. Please check your payment details.";
      } else if (err.response?.status === 409) {
        errorMessage += "Order already processed. Please check your orders.";
      } else if (!navigator.onLine) {
        errorMessage += "Network error. Please check your connection.";
      } else {
        errorMessage += err.response?.data?.error || err.message;
      }
      
      alert(errorMessage);
      setLoading(false);
      
      // Increment retry count for server errors
      if (err.response?.status >= 500) {
        setRetryCount(prev => prev + 1);
      }
    }
  };

  // Checkout Item Component
  const CheckoutItem = ({ item }) => (
    <div className="checkout-item">
      <div className="item-image">
        <ProductImage 
          src={getImageUrl(item.product.image)} 
          alt={item.product.productName} 
          type="product"
        />
      </div>
      <div className="item-details">
        <h4>{item.product.productName}</h4>
        <p className="item-category">{item.product.category}</p>
        <p className="item-quantity">Quantity: {item.quantity}</p>
        <p className="item-price">
          ₹{item.product.cost} × {item.quantity} = ₹{(item.product.cost * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );

  // Order Total Component
  const OrderTotal = ({ totalAmount }) => (
    <div className="order-total">
      <h3>Total Amount: ₹{totalAmount.toFixed(2)}</h3>
      <small>({Math.round(totalAmount * 100)} paise)</small>
    </div>
  );

  // Payment Button Component
  const PaymentButton = ({ loading, totalAmount, cartLength }) => (
    <button 
      className={`pay-button ${loading ? "loading" : ""}`} 
      onClick={handlePayment} 
      disabled={loading || cartLength === 0}
    >
      {loading ? (
        <>
          <span className="loading-spinner"></span>
          Processing...
        </>
      ) : (
        `Pay ₹${totalAmount.toFixed(2)}`
      )}
    </button>
  );

  // Payment Status Display
  const PaymentStatus = ({ status }) => {
    if (status === 'processing') {
      return (
        <div className="payment-status processing">
          <div className="status-spinner"></div>
          <p>Opening payment gateway...</p>
        </div>
      );
    }
    
    if (status === 'verifying') {
      return (
        <div className="payment-status verifying">
          <div className="status-spinner"></div>
          <p>Verifying your payment...</p>
        </div>
      );
    }
    
    return null;
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page container">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to proceed with checkout</p>
          <button onClick={() => navigate("/products")} className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <h1>Checkout</h1>
      
      <PaymentStatus status={paymentStatus} />
      
      <div className="checkout-layout">
        <div className="shipping-section">
          <h2>Shipping Details</h2>
          <form className="shipping-form">
            {["name", "email", "phone", "address", "city", "state", "zip"].map(field => (
              <div key={field} className="input-group">
                <label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)} *
                </label>
                <input
                  id={field}
                  type={getInputType(field)}
                  name={field}
                  value={shipping[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors[field] && touched[field] ? "error" : ""}
                  disabled={loading}
                  autoComplete={getAutoComplete(field)}
                  placeholder={getPlaceholder(field)}
                />
                {errors[field] && touched[field] && (
                  <small className="error-text">{errors[field]}</small>
                )}
              </div>
            ))}
          </form>
        </div>

        <div className="order-summary">
          <h2>Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})</h2>
          <div className="order-items">
            {cart.map(item => (
              <CheckoutItem key={item.product.id} item={item} />
            ))}
          </div>

          <OrderTotal totalAmount={totalAmount} />

          <PaymentButton 
            loading={loading} 
            totalAmount={totalAmount} 
            cartLength={cart.length} 
          />

          {retryCount > 0 && (
            <div className="retry-notice">
              <small>Payment attempts: {retryCount}/3</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { useAuth } from "../context/AuthContext";
// import ProductImage from "../components/product/ProductImage";
// import { createOrder, verifyPayment } from "../services/PaymentService";
// import { getImageUrl } from "../utils/imageUrl";
// import "./CheckoutPage.css";

// const CheckoutPage = () => {
//   const navigate = useNavigate();
//   const { cart, clearCart, totalAmount } = useCart();
//   const { user } = useAuth();

//   const [shipping, setShipping] = useState({
//     name: "", address: "", city: "", state: "", zip: "", phone: "", email: ""
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setShipping(prev => ({
//         ...prev,
//         name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
//         email: user.email || ""
//       }));
//     }
//   }, [user]);

//   const handleChange = (e) =>
//     setShipping({ ...shipping, [e.target.name]: e.target.value });

//   const validateForm = () => {
//     const newErrors = {};
//     if (!shipping.name.trim()) newErrors.name = "Name is required";
//     if (!shipping.address.trim()) newErrors.address = "Address is required";
//     if (!shipping.city.trim()) newErrors.city = "City is required";
//     if (!shipping.phone.trim()) newErrors.phone = "Phone is required";
//     if (!shipping.email.trim()) newErrors.email = "Email is required";
    
//     if (shipping.email && !/\S+@\S+\.\S+/.test(shipping.email)) {
//       newErrors.email = "Email is invalid";
//     }
    
//     if (shipping.phone && !/^[6-9]\d{9}$/.test(shipping.phone.replace(/\D/g, ''))) {
//       newErrors.phone = "Enter a valid 10-digit phone number";
//     }
    
//     return newErrors;
//   };

//   const handlePayment = async () => {
//     const newErrors = validateForm();
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       alert("Please fix the errors before proceeding");
//       return;
//     }

//     if (cart.length === 0) {
//       alert("Your cart is empty!");
//       return;
//     }

//     const userId = user?.id || JSON.parse(localStorage.getItem("currentUser"))?.id;
//     if (!userId) {
//       alert("Please login to continue!");
//       navigate("/login");
//       return;
//     }

//     setLoading(true);

//     try {
//       const amountPaise = Math.round(totalAmount * 100);

//       if (amountPaise < 100) {
//         alert("Minimum order amount is ₹1");
//         setLoading(false);
//         return;
//       }

//       console.log("Creating order for:", { userId, amountPaise, totalAmount, cartItems: cart.length });

//       // ✅ Send cart items to backend
//       const orderData = await createOrder(amountPaise, userId, cart);
//       console.log("Razorpay order created:", orderData);

//       const options = {
//         key: process.env.REACT_APP_RAZORPAY_KEY,
//         amount: orderData.amount,
//         currency: orderData.currency || "INR",
//         order_id: orderData.id,
//         name: "AgriConnect",
//         description: "Order Payment",
//         prefill: {
//           name: shipping.name,
//           email: shipping.email,
//           contact: shipping.phone
//         },
//         handler: async (response) => {
//           try {
//             console.log("Payment successful, verifying...", response);

//             const verifyResp = await verifyPayment({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature
//             });

//             console.log("Verification response:", verifyResp);

//             if (verifyResp.status === "success") {
//               clearCart();
//               navigate("/paymentsuccess", {
//                 state: {
//                   order: {
//                     items: cart,
//                     totalAmount,
//                     shippingInfo: shipping,
//                     paymentId: response.razorpay_payment_id
//                   }
//                 }
//               });
//             } else {
//               alert("Payment verification failed! Please contact support.");
//               setLoading(false);
//             }
//           } catch (err) {
//             console.error("Verification error:", err);
//             alert("Payment verification failed! " + (err.response?.data?.message || err.message));
//             setLoading(false);
//           }
//         },
//         modal: { ondismiss: () => setLoading(false) },
//         theme: { color: "#6aae4f" }
//       };

//       new window.Razorpay(options).open();

//     } catch (err) {
//       console.error("Order creation error:", err);
//       alert("Could not initiate payment: " + (err.response?.data?.error || err.message));
//       setLoading(false);
//     }
//   };

//   if (cart.length === 0) {
//     return (
//       <div className="checkout-page container">
//         <div className="empty-cart">
//           <h2>Your cart is empty</h2>
//           <button onClick={() => navigate("/products")} className="btn btn-primary">
//             Continue Shopping
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="checkout-page container">
//       <h1>Checkout</h1>
//       <div className="checkout-layout">
//         <div className="shipping-section">
//           <h2>Shipping Details</h2>
//           <form className="shipping-form">
//             {["name","email","phone","address","city","state","zip"].map(field => (
//               <div key={field} className="input-group">
//                 <label>{field.charAt(0).toUpperCase() + field.slice(1)} *</label>
//                 <input
//                   type={field === "email" ? "email" : "text"}
//                   name={field}
//                   value={shipping[field]}
//                   onChange={handleChange}
//                   className={errors[field] ? "error" : ""}
//                   disabled={loading}
//                 />
//                 {errors[field] && <small className="error-text">{errors[field]}</small>}
//               </div>
//             ))}
//           </form>
//         </div>

//         <div className="order-summary">
//           <h2>Order Summary ({cart.length} items)</h2>
//           <div className="order-items">
//             {cart.map(item => (
//               <div key={item.product.id} className="checkout-item">
//                 <div className="item-image">
//                   <ProductImage src={getImageUrl(item.product.image)} alt={item.product.productName} type="product"/>
//                 </div>
//                 <div className="item-details">
//                   <h4>{item.product.productName}</h4>
//                   <p>Quantity: {item.quantity}</p>
//                   <p className="item-price">
//                     ₹{item.product.cost} × {item.quantity} = ₹{(item.product.cost * item.quantity).toFixed(2)}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="order-total">
//             <h3>Total Amount: ₹{totalAmount.toFixed(2)}</h3>
//             <small>({Math.round(totalAmount * 100)} paise)</small>
//           </div>

//           <button className={`pay-button ${loading ? "loading" : ""}`} onClick={handlePayment} disabled={loading || cart.length === 0}>
//             {loading ? "Processing..." : `Pay ₹${totalAmount.toFixed(2)}`}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;