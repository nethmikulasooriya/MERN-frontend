import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../components/loader";
import ProductCard from "../components/ProductCard";

export default function SearchProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products`)
      .then((response) => {
        if (!Array.isArray(response.data)) {
          throw new Error("The products API returned an invalid response.");
        }
        if (isCurrentRequest) {
          setProducts(response.data);
          setError("");
        }
      })
      .catch((requestError) => {
        if (isCurrentRequest) {
          toast.error("Error fetching products");
          console.error("Unable to load products for search:", requestError);
          setError("Could not load products. Please try again later.");
        }
      })
      .finally(() => {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, []);

  const searchQuery = query.trim().toLowerCase();
  const filteredProducts = products.filter((product) =>
    [
      product.name,
      product.description,
      ...(Array.isArray(product.altNames) ? product.altNames : []),
    ].some(
      (field) =>
        typeof field === "string" && field.toLowerCase().includes(searchQuery),
    ),
  );

  return (
    <div className="w-full h-full flex flex-col items-center p-4">
      <input
        type="search"
        placeholder="Search for products..."
        aria-label="Search for products"
        className="w-75 h-10 px-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
      />
      <div className="w-full h-full flex flex-row flex-wrap justify-center items-center">
        {!query.trim() ? (
          <h1 className="text-2xl text-secondary font-semibold">
            Please enter a search query
          </h1>
        ) : isLoading ? (
          <Loading />
        ) : error ? (
          <p role="alert" className="text-red-600">
            {error}
          </p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.productId || product._id}
              product={product}
            />
          ))
        ) : (
          <p className="text-secondary">No products found.</p>
        )}
      </div>
    </div>
  );
}
