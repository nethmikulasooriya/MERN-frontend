import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/loader";
import ImageSlider from "../components/imageSlider";
import { addToCart } from "../utils/cart";
import toast from "react-hot-toast";

export default function ProductOverviewPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const currentPrice = Number(product?.price);
  const labelledPrice = Number(
    product?.labelledPrice ?? product?.labeledPrice,
  );
  const hasDiscount =
    Number.isFinite(currentPrice) &&
    Number.isFinite(labelledPrice) &&
    labelledPrice > currentPrice;

  useEffect(() => {
    setStatus("loading");
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${params.productId}`)
      .then((res) => {
        setProduct(res.data);
        setStatus("success");
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
      });
  }, [params.productId]);

  return (
    <div className="w-full h-full">
      {status === "loading" && <Loader />}

      {status === "success" && product && (
        <div className="w-full h-full flex flex-col md:flex-row">
          {/* Mobile Title */}
          <h1 className="text-2xl my-4 text-center font-bold md:hidden">
            {product.name}{" "}
            {product.altNames?.length > 0 && (
              <span className="font-light">
                {product.altNames.join(" | ")}
              </span>
            )}
          </h1>

          {/* Left Column: Image Slider */}
          <div className="w-full md:w-[49%] h-full flex flex-col justify-center items-center pt-6 md:pt-8">
            <ImageSlider images={product.images || []} />
          </div>

          {/* Right Column: Product Details */}
          <div className="w-full md:w-[49%] h-full flex flex-col items-center pt-12.5">
            {/* Desktop Title */}
            <h1 className="text-2xl font-bold hidden md:block">
              {product.name}{" "}
              {product.altNames?.length > 0 && (
                <span className="font-light">
                  {product.altNames.join(" | ")}
                </span>
              )}
            </h1>

            <p className="text-lg p-2">{product.description}</p>

            {/* Pricing Section */}
            <div className="w-full flex flex-col items-center mt-5">
              {Number.isFinite(currentPrice) && (
                <div className="flex items-center justify-center gap-4">
                  {hasDiscount && (
                    <span className="text-2xl font-medium text-gray-500 line-through">
                      {labelledPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-blue-900">
                    {currentPrice.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-row justify-center items-center mt-5 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  navigate("/checkout", {
                    state: {
                      items: [
                        {
                          productId: product.productId,
                          quantity: 1,
                          name: product.name,
                          image: product.images?.[0] || "",
                          price: product.price,
                        },
                      ],
                    },
                  });
                }}
                className="w-50 h-12.5 cursor-pointer rounded-xl shadow-2xl text-white bg-blue-900 border-[3px] border-blue-900 transition-colors hover:bg-white hover:text-blue-900"
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={() => {
                  try {
                    addToCart(product, 1);
                    toast.success("Product added to cart");
                  } catch (error) {
                    console.error("Unable to add product to cart:", error);
                    toast.error("Unable to add product to cart.");
                  }
                }}
                className="w-50 h-12.5 cursor-pointer rounded-xl shadow-2xl text-white bg-blue-600 border-[3px] border-blue-600 transition-colors hover:bg-white hover:text-blue-600"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="w-full h-full flex justify-center items-center text-red-500 font-semibold text-lg">
          Error loading product.
        </div>
      )}
    </div>
  );
}