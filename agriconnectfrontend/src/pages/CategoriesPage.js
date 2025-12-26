import { useEffect, useState } from "react";
import CategoryForm from "../components/category/CategoryForm";
import CategoryList from "../components/category/CategoryList";
import { getAllCategories } from "../services/categoryService";

export default function CategoriesPage({ onCategoriesChange }) {
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    const res = await getAllCategories();
    setCategories(res.data);
    if (onCategoriesChange) onCategoriesChange(res.data); // notify parent
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Manage Categories</h1>
      <CategoryForm onSuccess={loadCategories} />
      <CategoryList categories={categories} onDeleteSuccess={loadCategories} />
    </div>
  );
}
