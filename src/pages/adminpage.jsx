import { Link, Route, Routes } from "react-router-dom";

export default function AdminPage() {
  return (
    <div className="w-full h-screen flex">
      {/* Sidebar */}
      <div className="h-full w-[300px] bg-blue-900 flex flex-col"> 
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/orders">Orders</Link>
        <Link to="/admin/reviews">Reviews</Link>
      </div>

      {/* Main Content Area */}
      <div className="h-full w-[calc(100%-300px)] bg-amber-400">
        <Routes path="/*">
          <Route path="/products" element={<h1>Products</h1>} /> //load sidebar component with products list
          <Route path="/users" element={<h1>Users</h1>} />
          <Route path="/orders" element={<h1>Orders</h1>} />
          <Route path="/reviews" element={<h1>Reviews</h1>} />
        </Routes>
      </div>
    </div>
  );
}