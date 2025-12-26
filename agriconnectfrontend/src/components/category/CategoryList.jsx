import { useEffect, useState } from "react";
import { getAllCategories, deleteCategory } from "../../services/categoryService";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);

  const loadData = async () => {
    const res = await getAllCategories();
    setCategories(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    await deleteCategory(id);
    loadData();
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold mb-2">Categories</h2>
      <ul className="space-y-2">
        {categories.map((c) => (
          <li key={c.id} className="flex justify-between p-2 border rounded">
            {c.categoryName}
            <button
              onClick={() => handleDelete(c.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
