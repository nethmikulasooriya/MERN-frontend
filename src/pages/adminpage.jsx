import { Link, Navigate, Route, Routes } from "react-router-dom";
import AddProductPage from "./Admin/addProduct";
import AdminProductsPage from "./Admin/adminProductPage";
import EditProductPage from "./Admin/editProduct";

export default function AdminPage() {
  return (
    <div className="w-full h-screen flex">
      {/* Sidebar */}
      <div className="h-full w-75 shrink-0 bg-blue-900 flex flex-col text-white p-4 gap-2">
        <Link to="/admin/products" className="p-2 hover:bg-blue-800 rounded">
          Products
        </Link>
        <Link to="/admin/users" className="p-2 hover:bg-blue-800 rounded">
          Users
        </Link>
        <Link to="/admin/orders" className="p-2 hover:bg-blue-800 rounded">
          Orders
        </Link>
        <Link to="/admin/reviews" className="p-2 hover:bg-blue-800 rounded">
          Reviews
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="h-full min-w-0 flex-1 bg-amber-400 p-4">
        <Routes>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/add" element={<AddProductPage />} />
          <Route path="products/edit" element={<EditProductPage />} />
          <Route path="users" element={<h1>Users</h1>} />
          <Route path="orders" element={<h1>Orders</h1>} />
          <Route path="reviews" element={<h1>Reviews</h1>} />
        </Routes>
      </div>
    </div>
  );
}