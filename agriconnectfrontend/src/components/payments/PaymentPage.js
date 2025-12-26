// import React from "react";
// import { createOrder, verifyPayment } from "../services/PaymentService";

// export default function PaymentPage({ amountRupees = 100, user = {} }) {
//   const amountPaise = amountRupees * 100;

//   const handlePay = async () => {
//     try {
//       const orderResp = await createOrder(amountPaise);
//       const order = orderResp.data; // contains id, amount, currency

//       const options = {
//         key: process.env.REACT_APP_RAZORPAY_KEY,
//         amount: order.amount,
//         currency: order.currency || "INR",
//         order_id: order.id,
//         name: "AgriConnect",
//         description: "Order Payment",
//         prefill: {
//           name: user.name || "",
//           email: user.email || "",
//           contact: user.phone || ""
//         },
//         handler: async function (response) {
//           // response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
//           try {
//             const verifyResp = await verifyPayment(response);
//             if (verifyResp.data.status === "success") {
//               alert("Payment successful and verified!");
//               // redirect or show invoice
//             } else {
//               alert("Payment verification failed.");
//             }
//           } catch (err) {
//             console.error("verify error", err);
//             alert("Verification request failed — check console.");
//           }
//         },
//         modal: {
//           ondismiss: function () {
//             console.log("Payment popup closed by user");
//           }
//         }
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error("create order error", err);
//       alert("Could not create order. Check console.");
//     }
//   };

//   return (
//     <div style={{textAlign:"center", marginTop:50}}>
//       <h3>Pay ₹{amountRupees}</h3>
//       <button onClick={handlePay}>Pay Now</button>
//     </div>
//   );
// }
