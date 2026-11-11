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
    <div className="h-full w-full overflow-y-auto bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Catalog management
          </p>
          <h1 className="mt-1 text-2xl font-bold text-accent sm:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage product details, pricing, and inventory.
          </p>
        </div>
        <Link
          to="/admin/add-product"
          className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          Add Product
        </Link>
      </header>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-800">All products</h2>
          {!isLoading && !error && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-accent"
              role="status"
              aria-label="Loading products"
            />
          </div>
        ) : error ? (
          <p role="alert" className="px-6 py-12 text-center text-red-700">
            {error}
          </p>
        ) : products.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-semibold text-slate-800">No products yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Add a product to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Product
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Product ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Labelled price
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Price
                  </th>
                  <th scope="col" className="px-4 py-3 text-center font-semibold">
                    Stock
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((item, index) => {
                  const id = item.productId || item._id;
                  const name = item.productName || item.name || "Unnamed product";
                  const stock = Number(item.stock || 0);
                  return (
                    <tr
                      key={id || index}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || item.images?.[0] || ""}
                            alt={name}
                            className="h-12 w-12 rounded-lg border border-slate-200 bg-slate-50 object-cover"
                          />
                          <span className="max-w-64 truncate font-semibold text-slate-800">
                            {name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">
                        {id || "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500">
                        {Number(item.labelledPrice || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800">
                        {Number(item.price || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            stock > 0
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {stock}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            aria-label={`Delete ${name}`}
                            onClick={() => deleteProduct(id)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                          >
                            <FaTrash aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Edit ${name}`}
                            onClick={() =>
                              navigate("/admin/edit-product", { state: item })
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-accent focus:outline-none focus:ring-2 focus:ring-blue-200"
                          >
                            <FaEdit aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}