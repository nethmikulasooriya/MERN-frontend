import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function ProductCard({ product, isAdmin, onDelete }) {
  // Safe fallbacks matching your Mongoose schema fields
  const productId = product.productId || product._id;
  const name = product.name || "Unnamed Product";
  const description = product.description || "No description provided.";
  const price = product.price ?? product.Price ?? 0;
  const labeledPrice = product.labeledPrice ?? product.labelledPrice ?? 0;
  const stock = product.stock ?? 0;
  const isAvailable = product.isAvailable ?? stock > 0;
  const image =
    (product.images && product.images.length > 0 ? product.images[0] : null) ||
    product.image ||
    "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="relative flex flex-col justify-between w-[280px] min-h-[420px] m-4 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Top Image & Badge */}
      <div className="relative w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Stock / Availability Status Badge */}
        <span
          className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
            isAvailable && stock > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {isAvailable && stock > 0 ? `In Stock (${stock})` : "Out of Stock"}
        </span>

        {/* Product ID Pill */}
        <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-sm">
          #{productId}
        </span>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 truncate" title={name}>
          {name}
        </h2>

        {/* Alternate Names */}
        {product.altNames && product.altNames.length > 0 && (
          <p className="text-[12px] text-gray-400 italic truncate mt-0.5">
            Also known as: {product.altNames.join(", ")}
          </p>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mt-2 leading-relaxed">
          {description}
        </p>

        {/* Price Section */}
        <div className="mt-auto pt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-gray-900">
            ${price.toFixed(2)}
          </span>
          {labeledPrice > price && (
            <span className="text-sm font-medium text-gray-400 line-through">
              ${labeledPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-0">
        {isAdmin ? (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <Link
              to="/admin/edit-product"
              state={product}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <FaEdit className="text-sm" />
              Edit
            </Link>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(productId)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
              >
                <FaTrash className="text-sm" />
                Delete
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            disabled={!isAvailable || stock <= 0}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all shadow-sm ${
              isAvailable && stock > 0
                ? "bg-blue-900 hover:bg-blue-800 text-white cursor-pointer active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isAvailable && stock > 0 ? "Add to Cart" : "Unavailable"}
          </button>
        )}
      </div>
    </div>
  );
}