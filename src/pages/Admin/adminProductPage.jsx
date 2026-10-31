import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      async function fetchProducts() {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products`
          );
          setProducts(response.data);
        } catch (requestError) {
          setError(
            requestError.response?.data?.message ||
              "Could not load products. Check that the backend is running."
          );
        } finally {
          setIsLoading(false);
        }
      }

      fetchProducts();
    }
  }, [isLoading]);

  async function deleteProduct(productId) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product deleted successfully");
      // Trigger a re-fetch via useEffect
      setIsLoading(true);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete product");
    }
  }

  return (
    <div className="relative h-full max-h-full w-full overflow-y-auto bg-red-900 p-6 text-white">
      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          to="/admin/add-product"
          className="rounded bg-green-500 px-4 py-2 font-bold text-white"
        >
          Add Product
        </Link>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center">
          <div className="h-[50px] w-[50px] animate-spin rounded-full border-4 border-dashed border-white"></div>
        </div>
      ) : error ? (
        <p role="alert" className="text-center text-yellow-300">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center">No products found.</p>
      ) : (
        <table className="w-full text-center">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Image</th>
              <th>Labelled Price</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => {
              const id = item.productId || item._id;
              return (
                <tr key={id || index}>
                  <td>{id}</td>
                  <td>{item.productName || item.name}</td>
                  <td>
                    <img
                      src={item.image || item.images?.[0] || ""}
                      alt={item.productName || item.name || "Product"}
                      className="mx-auto h-12 w-12 object-cover"
                    />
                  </td>
                  <td>{item.labelledPrice}</td>
                  <td>{item.price}</td>
                  <td>{item.stock}</td>
                  <td>
                    <div className="flex items-center justify-center">
                      <FaTrash
                        className="mx-2 cursor-pointer text-[20px] text-red-500"
                        onClick={() => deleteProduct(id)}
                      />
                      <button
                        type="button"
                        aria-label={`Edit ${item.productName || item.name || "product"}`}
                        onClick={() =>
                          navigate("/admin/edit-product", { state: item })
                        }
                        className="mx-2 cursor-pointer text-[20px] text-white"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}