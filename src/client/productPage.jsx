import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products`)
      .then((res) => {
        if (!Array.isArray(res.data)) {
          throw new Error("The products API returned an invalid response.");
        }
        if (isCurrentRequest) {
          setProducts(res.data);
          setError("");
        }
      })
      .catch((requestError) => {
        console.error("Unable to load products:", requestError);
        if (isCurrentRequest) {
          setError("Could not load products. Check that the backend server is running, then try again.");
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
  }, [requestId]);

  return (
    <div className="w-full h-full flex flex-wrap justify-center items-center">
      {isLoading && <p role="status">Loading products...</p>}
      {!isLoading && error && (
        <div className="flex flex-col items-center gap-3 text-center">
          <p role="alert" className="text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setRequestId((currentId) => currentId + 1);
            }}
            className="rounded bg-blue-900 px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      )}
      {!isLoading && !error && products.length === 0 && (
        <p>No products found.</p>
      )}
      {!isLoading &&
        !error &&
        products.map((product) => (
          <ProductCard key={product.productId || product._id} product={product} />
        ))}
    </div>
  );
}
