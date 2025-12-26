// src/auth/PhoneEmailLogin.js
import React, { useEffect, useState } from "react";
import RoleBasedLoginForm from "./RoleBasedLoginForm";

const PhoneEmailLogin = () => {
  const [error, setError] = useState("");

  useEffect(() => {
    // Load Phone.Email script dynamically
    const script = document.createElement("script");
    script.src = "https://www.phone.email/sign_in_button_v1.js";
    script.async = true;
    document.body.appendChild(script);

    // Global function called by Phone.Email after verification
    window.phoneEmailListener = async (userObj) => {
      const user_json_url = userObj.user_json_url;
      try {
        const res = await fetch(
          `/auth/verify-phone-email?user_json_url=${encodeURIComponent(user_json_url)}`
        );

        const data = await res.json();

        if (data.error) {
          // Safely handle backend errors
          setError(data.error || "Phone verification failed");
          return;
        }

        // Save verified user data in localStorage
        localStorage.setItem("currentUser", JSON.stringify(data));
        if (data.role === "USER") localStorage.setItem("userId", data.id);

        // Redirect user based on role
        switch (data.role) {
          case "USER":
            window.location.href = "/buyer-dashboard";
            break;
          case "VENDOR":
            window.location.href = "/vendor-dashboard";
            break;
          case "ADMIN":
            window.location.href = "/admin-dashboard";
            break;
          default:
            window.location.href = "/buyer-dashboard";
        }
      } catch (err) {
        console.error("Phone verification failed:", err);
        setError("Phone verification failed. Please try again.");
      }
    };

    // Cleanup the script on unmount
    return () => {
      document.body.removeChild(script);
      delete window.phoneEmailListener;
    };
  }, []);

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      {/* Existing OTP login form */}
      <RoleBasedLoginForm />

      {/* Phone.Email verification button */}
      <div
        className="pe_signin_button"
        data-client-id="11125739024853129935"
        style={{ marginTop: "20px" }}
      ></div>

      {/* Display any errors safely */}
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default PhoneEmailLogin;
