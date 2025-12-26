// // components/product/ProductImage.js
// import React, { useState, useEffect } from "react";
// import { getImageUrl } from "../../utils/imageUrl";
// import "./ProductImage.css"; // Add this CSS file

// const ProductImage = ({ src, alt, type = "product", style, className = "" }) => {
//   const [imgSrc, setImgSrc] = useState("/placeholder.png");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (src) {
//       setLoading(true);
//       const url = getImageUrl(src, type);
//       console.log("DEBUG: Image URL:", url);
      
//       // Preload image to check if it exists
//       const img = new Image();
//       img.src = url;
//       img.onload = () => {
//         setImgSrc(url);
//         setLoading(false);
//       };
//       img.onerror = () => {
//         console.warn("❌ Image failed to load:", url);
//         setImgSrc("/placeholder.png");
//         setLoading(false);
//       };
//     } else {
//       setImgSrc("/placeholder.png");
//       setLoading(false);
//     }
//   }, [src, type]);

//   const handleImageError = () => {
//     console.warn("❌ Image error in img tag:", imgSrc);
//     setImgSrc("/placeholder.png");
//     setLoading(false);
//   };

//   return (
//     <div className={`product-image-container ${loading ? 'loading' : ''} ${className}`}>
//       <img
//         src={imgSrc}
//         alt={alt || "Product Image"}
//         className="product-image"
//         style={style}
//         onError={handleImageError}
//         onLoad={() => setLoading(false)}
//         loading="lazy"
//       />
//       {loading && <div className="image-loading">Loading...</div>}
//     </div>
//   );
// };

// export default ProductImage;// components/product/ProductImage.js
import React, { useState, useEffect } from "react";
import { getImageUrl } from "../../utils/imageUrl";
import "./ProductImage.css";

const PLACEHOLDER = "/placeholder.png"; // Make sure this exists in public folder

const ProductImage = ({ src, alt = "Product Image", type = "product", style, className = "" }) => {
  const [imgSrc, setImgSrc] = useState(PLACEHOLDER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (src) {
      const url = getImageUrl(src, type);
      const img = new Image();
      img.src = url;

      img.onload = () => {
        setImgSrc(url);
        setLoading(false);
      };

      img.onerror = () => {
        console.warn("❌ Image failed to load:", url);
        setImgSrc(PLACEHOLDER);
        setLoading(false);
      };
    } else {
      setImgSrc(PLACEHOLDER);
      setLoading(false);
    }
  }, [src, type]);

  const handleImageError = () => {
    setImgSrc(PLACEHOLDER);
    setLoading(false);
  };

  return (
    <div className={`product-image-container ${loading ? "loading" : ""} ${className}`}>
      <img
        src={imgSrc}
        alt={alt}
        className="product-image"
        style={style}
        onError={handleImageError}
        loading="lazy"
      />
      {loading && <div className="image-loading">Loading...</div>}
    </div>
  );
};

export default ProductImage;
