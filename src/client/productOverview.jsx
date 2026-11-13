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
    <main className="min-h-screen w-full">
      {status === "loading" && <Loader />}

      {status === "success" && product && (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 pb-8 md:min-h-screen md:flex-row md:items-center md:gap-8 md:px-8">
          {/* Mobile Title */}
          <h1 className="my-4 break-words text-center text-2xl font-bold md:hidden">
            {product.name}{" "}
            {product.altNames?.length > 0 && (
              <span className="font-light">
                {product.altNames.join(" | ")}
              </span>
            )}
          </h1>

          {/* Left Column: Image Slider */}
          <div className="flex w-full justify-center md:w-1/2">
            <ImageSlider images={product.images || []} />
          </div>

          {/* Right Column: Product Details */}
          <div className="flex w-full flex-col items-center md:w-1/2 md:py-8">
            {/* Desktop Title */}
            <h1 className="hidden break-words text-center text-2xl font-bold md:block">
              {product.name}{" "}
              {product.altNames?.length > 0 && (
                <span className="font-light">
                  {product.altNames.join(" | ")}
                </span>
              )}
            </h1>

            <p className="w-full break-words p-2 text-base leading-relaxed sm:text-lg">
              {product.description}
            </p>

            {/* Pricing Section */}
            <div className="mt-5 flex w-full flex-col items-center">
              {Number.isFinite(currentPrice) && (
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                  {hasDiscount && (
                    <span className="text-xl font-medium text-gray-500 line-through sm:text-2xl">
                      {labelledPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-blue-900 sm:text-3xl">
                    {currentPrice.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex w-full max-w-md flex-col items-stretch justify-center gap-2.5 sm:flex-row">
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
                className="h-12.5 w-full flex-1 cursor-pointer rounded-xl border-[3px] border-blue-900 bg-blue-900 text-white shadow-2xl transition-colors hover:bg-white hover:text-blue-900"
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
                className="h-12.5 w-full flex-1 cursor-pointer rounded-xl border-[3px] border-blue-600 bg-blue-600 text-white shadow-2xl transition-colors hover:bg-white hover:text-blue-600"
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
    </main>
  );
}