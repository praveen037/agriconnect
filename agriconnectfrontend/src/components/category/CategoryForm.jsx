import { useState } from "react";
import { createCategory } from "../../services/categoryService";

export default function CategoryForm({ onSuccess }) {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCategory({ categoryName });
    setCategoryName("");
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow">
      <input
        type="text"
        placeholder="Category Name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        className="border p-2 mr-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add
      </button>
    </form>
  );
}
