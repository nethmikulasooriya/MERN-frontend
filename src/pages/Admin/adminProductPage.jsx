import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        );
        setProducts(response.data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Could not load products. Check that the backend is running.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="relative h-full max-h-full w-full overflow-y-auto bg-red-900 p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          to="/admin/add-product"
          className="rounded bg-green-500 px-4 py-2 font-bold text-white"
        >
          Add Product
        </Link>
      </div>

      {loading && <p>Loading products...</p>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && products.length === 0 && <p>No products found.</p>}

      {!loading && !error && products.length > 0 && (
        <table className="w-full text-center">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Image</th>
              <th>Labelled Price</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <tr key={item._id || item.productId || index}>
                <td>{item.productId || item._id}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
