import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductForm.css";

const ProductForm = ({ editProduct, onSuccess }) => {
  const [productName, setProductName] = useState("");
  const [cost, setCost] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // FIX: Safe vendor data extraction with error handling
  const getVendorData = () => {
    console.log("=== DEBUG: CHECKING LOCALSTORAGE ===");
    
    try {
      const currentUserData = localStorage.getItem('currentUser');
      console.log("Raw currentUser data:", currentUserData);
      
      if (!currentUserData || currentUserData === 'null') {
        console.error("❌ currentUser is null or empty");
        return null;
      }

      // FIX: Handle the JSON parsing error in products array
      let parsedData;
      try {
        parsedData = JSON.parse(currentUserData);
      } catch (parseError) {
        console.error("❌ Error parsing currentUser JSON:", parseError);
        
        // Try to fix the JSON by removing the problematic products array
        const fixedJson = currentUserData.replace(/,"products":\[.*?\],/g, ',"products":[],');
        console.log("Attempting to fix JSON...");
        
        try {
          parsedData = JSON.parse(fixedJson);
          console.log("✅ JSON fixed successfully");
        } catch (fixError) {
          console.error("❌ Could not fix JSON, using basic extraction");
          // Last resort: extract just the ID using regex
          const idMatch = currentUserData.match(/"id":(\d+)/);
          if (idMatch) {
            parsedData = { id: parseInt(idMatch[1]), role: 'VENDOR' };
            console.log("✅ Extracted basic vendor data:", parsedData);
          } else {
            throw new Error("Cannot extract vendor data from corrupted JSON");
          }
        }
      }

      // Validate we have a vendor
      if (parsedData && parsedData.id && parsedData.role === 'VENDOR') {
        console.log("✅ Valid vendor data found:", { 
          id: parsedData.id, 
          shopName: parsedData.shopName,
          role: parsedData.role 
        });
        return parsedData;
      } else {
        console.error("❌ Invalid vendor data:", parsedData);
        return null;
      }
      
    } catch (error) {
      console.error("❌ Error getting vendor data:", error);
      return null;
    }
  };

  const vendorData = getVendorData();
  const vendorId = vendorData ? vendorData.id : null;
  
  console.log("=== DEBUG: VENDOR INFO ===");
  console.log("Vendor Data:", vendorData);
  console.log("Vendor ID:", vendorId);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3130/api/categories");
        const formatted = res.data.map(c => ({
          id: c.id.toString(),
          name: c.categoryName || c.name,
        }));
        setCategories(formatted);
        console.log("✅ Categories loaded:", formatted.length);
      } catch (err) {
        console.error("❌ Failed to fetch categories:", err);
      }
    };
    loadCategories();
  }, []);

  // Populate form for editing
  useEffect(() => {
    if (editProduct) {
      console.log("DEBUG: Editing product:", editProduct);
      setProductName(editProduct.productName || "");
      setCost(editProduct.cost || "");
      setStockQuantity(editProduct.stockquantity || "");
      setUnit(editProduct.unit || "");
      setDescription(editProduct.description || "");
      setCategoryId((editProduct.categoryId || editProduct.category?.id || "").toString());

      if (editProduct.image) {
        const imageUrl = editProduct.image.startsWith("http")
          ? editProduct.image
          : `http://localhost:3130/${editProduct.image.replace(/^\/+/, "")}`;
        setImagePreview(imageUrl);
      } else {
        setImagePreview(null);
      }

      setImageFile(null);
    }
  }, [editProduct]);

  const handleImageChange = e => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // REVALIDATE vendor data right before submission
    const currentVendorData = getVendorData();
    const currentVendorId = currentVendorData ? currentVendorData.id : null;
    
    console.log("=== DEBUG: FORM VALIDATION ===");
    console.log("Vendor ID:", currentVendorId);
    console.log("Category ID:", categoryId);
    console.log("Product Name:", productName);
    
    if (!currentVendorId) { 
      alert("❌ Vendor not properly logged in! Please login again."); 
      return; 
    }
    
    if (!categoryId) { 
      alert("⚠️ Please select a category."); 
      return; 
    }
    
    if (!productName.trim()) {
      alert("⚠️ Please enter a product name.");
      return;
    }

    setLoading(true);

    // Create product data
    const productData = {
      productName: productName.trim(),
      cost: parseFloat(cost),
      stockquantity: parseInt(stockQuantity),
      unit: unit,
      description: description.trim(),
      categoryId: parseInt(categoryId),
      vendorId: currentVendorId,
    };

    console.log("📦 Product data being sent:", productData);

    const formData = new FormData();
    formData.append("product", new Blob([JSON.stringify(productData)], { 
        type: "application/json" 
    }));
    
    if (imageFile) {
        formData.append("file", imageFile);
    }

    try {
        const url = editProduct 
            ? `http://localhost:3130/api/product/${editProduct.id}`
            : "http://localhost:3130/api/product";

        const method = editProduct ? "put" : "post";

        console.log("🌐 Sending request to:", url);

        const response = await axios[method](url, formData, {
            headers: { 
                "Content-Type": "multipart/form-data",
            }
        });

        console.log("✅ Server response:", response.data);

        // Reset form
        setProductName(""); 
        setCost(""); 
        setStockQuantity(""); 
        setUnit(""); 
        setDescription(""); 
        setCategoryId(""); 
        setImageFile(null); 
        setImagePreview(null);

        alert(`🎉 Product ${editProduct ? "updated" : "added"} successfully!`);

        if (onSuccess) onSuccess();

    } catch (err) {
        console.error("❌ Failed to save product:", err);
        console.error("Error response:", err.response?.data);
        alert("❌ Failed to save product! Check console for details.");
    } finally {
        setLoading(false);
    }
  };

  const unitOptions = ["kg", "grams", "pieces", "liters", "ml", "pack"];

  // Show login prompt if no vendor ID
  if (!vendorId) {
    return (
      <div className="product-form">
        <h2>Add New Product</h2>
        <div style={{
          background: '#f8d7da', 
          padding: '20px', 
          margin: '20px 0',
          borderRadius: '5px',
          border: '1px solid #f5c6cb',
          textAlign: 'center'
        }}>
          <h3>❌ Vendor Not Logged In</h3>
          <p>Please login as a vendor to add products.</p>
          <div style={{marginTop: '10px'}}>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
              style={{
                padding: '10px 20px', 
                background: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                margin: '5px'
              }}
            >
              Clear Storage & Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{editProduct ? "Edit Product" : "Add New Product"}</h2>

      {/* Vendor info */}
      <div style={{
          background: '#d4edda', 
          padding: '10px', 
          marginBottom: '15px', 
          borderRadius: '5px',
          border: '1px solid #c3e6cb'
      }}>
        <strong>✅ Vendor Logged In:</strong><br />
        Vendor ID: <strong>{vendorId}</strong><br />
        Shop: {vendorData.shopName || 'N/A'}<br />
        Email: {vendorData.email || 'N/A'}
      </div>

      <div className="form-group">
        <label>Product Name *</label>
        <input 
          type="text" 
          placeholder="Enter product name" 
          value={productName} 
          onChange={e => setProductName(e.target.value)} 
          required 
        />
      </div>
      
      <div className="form-group">
        <label>Cost (₹) *</label>
        <input 
          type="number" 
          placeholder="0.00" 
          value={cost} 
          onChange={e => setCost(e.target.value)} 
          required 
          step="0.01" 
          min="0"
        />
      </div>
      
      <div className="form-group">
        <label>Stock Quantity *</label>
        <input 
          type="number" 
          placeholder="0" 
          value={stockQuantity} 
          onChange={e => setStockQuantity(e.target.value)} 
          required 
          min="0" 
        />
      </div>

      <div className="form-group">
        <label>Unit *</label>
        <select value={unit} onChange={e => setUnit(e.target.value)} required>
          <option value="">-- Select Unit --</option>
          {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>Category *</label>
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
          <option value="">-- Select Category --</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea 
          placeholder="Product description..." 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Product Image (Optional)</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
            <div style={{marginTop: '10px'}}>
                <img src={imagePreview} alt="Preview" style={{maxWidth: '200px', maxHeight: '200px'}} />
                <button 
                  type="button" 
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  style={{display: 'block', marginTop: '5px'}}
                >
                  Remove Image
                </button>
            </div>
        )}
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? "⏳ Processing..." : editProduct ? "📝 Update Product" : "➕ Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;