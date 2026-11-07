import { useEffect, useState } from "react";
import { TbTrash } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { addToCart, getCart, removeFromCart } from "../utils/cart";

function normalizeItem(item) {
  return {
    ...item,
    productId: item.productId || item._id,
    quantity: Number(item.quantity ?? item.qty ?? 1),
    price: Number(item.price || 0),
  };
}

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const fromCart = location.state?.fromCart === true;

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cart, setCart] = useState(() => {
    const routeItems = location.state?.items;
    const items =
      Array.isArray(routeItems) && routeItems.length > 0 ? routeItems : getCart();
    return items.map(normalizeItem);
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to checkout");
      navigate("/login", { replace: true });
      return;
    }

    let isCurrent = true;
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (isCurrent) {
          const user = response.data;
          setName([user.firstName, user.lastName].filter(Boolean).join(" "));
        }
      })
      .catch((error) => {
        console.error("Failed to fetch user details:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch user details"
        );
      });

    return () => {
      isCurrent = false;
    };
  }, [navigate]);

  useEffect(() => {
    if (cart.length === 0) {
      toast.error("Please select items to checkout");
      navigate("/cart", { replace: true });
    }
  }, [cart.length, navigate]);

  function updateQuantity(item, change) {
    const newQuantity = item.quantity + change;
    const nextCart =
      newQuantity <= 0
        ? cart.filter((cartItem) => cartItem.productId !== item.productId)
        : cart.map((cartItem) =>
            cartItem.productId === item.productId
              ? { ...cartItem, quantity: newQuantity }
              : cartItem
          );

    if (fromCart) {
      if (newQuantity <= 0) {
        removeFromCart(item.productId);
      } else {
        addToCart({ ...item, images: [item.image] }, change);
      }
    }
    setCart(nextCart);
  }

  function getTotal() {
    return cart.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  }

  async function placeOrder() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!name.trim() || !address.trim() || !phone.trim()) {
      toast.error("Please fill all the fields");
      return;
    }
    if (cart.some((item) => !item.productId || item.quantity < 1)) {
      toast.error("Your cart contains an invalid item. Please update your cart.");
      return;
    }

    const order = {
      address: address.trim(),
      phone: phone.trim(),
      items: cart.map((item) => ({
        productId: item.productId,
        qty: item.quantity,
      })),
    };

    setIsSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        order,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (fromCart) {
        cart.forEach((item) => removeFromCart(item.productId));
      }
      toast.success("Order placed successfully");
      navigate("/products");
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-full min-h-screen flex flex-col px-2.5 py-10 items-center">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      {cart.map((item) => (
        <div
          key={item.productId}
          className="w-full md:w-200 min-h-25 m-2.5 p-2 shadow-2xl flex flex-row items-center relative"
        >
          <div className="w-25 flex justify-center items-center">
            <img
              src={item.image || ""}
              alt={item.name || "Product"}
              className="w-20 h-20 object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center px-2">
            <span className="font-bold">{item.name || "Product"}</span>
            <span className="font-semibold">
              {item.price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              aria-label={`Decrease ${item.name || "product"} quantity`}
              className="w-7.5 rounded-lg bg-accent text-white hover:bg-blue-400"
              onClick={() => updateQuantity(item, -1)}
            >
              -
            </button>
            <span className="mx-2.5">{item.quantity}</span>
            <button
              type="button"
              aria-label={`Increase ${item.name || "product"} quantity`}
              className="w-7.5 rounded-lg bg-accent text-white hover:bg-blue-400"
              onClick={() => updateQuantity(item, 1)}
            >
              +
            </button>
          </div>
          <div className="w-32.5 flex justify-end pr-2 font-semibold">
            {(item.quantity * item.price).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <button
            type="button"
            aria-label={`Remove ${item.name || "product"}`}
            className="ml-1 cursor-pointer text-red-700"
            onClick={() => updateQuantity(item, -item.quantity)}
          >
            <TbTrash className="text-xl" />
          </button>
        </div>
      ))}

      <div className="md:w-200 w-full m-2.5 p-2.5 shadow-2xl flex flex-row items-center justify-between">
        <button
          type="button"
          onClick={placeOrder}
          disabled={isSubmitting || cart.length === 0}
          className="w-50 md:w-37.5 h-12.5 rounded-lg shadow-2xl bg-accent border-2 border-accent text-white hover:bg-white hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Placing order..." : "Place Order"}
        </button>
        <span className="font-bold text-xl">
          Total:{" "}
          {getTotal().toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      <div className="md:w-200 w-full m-2.5 p-2.5 shadow-2xl flex flex-col md:flex-row items-center justify-center gap-2">
        <input
          className="w-full md:w-50 h-10 border border-gray-300 rounded-lg p-2.5"
          type="text"
          placeholder="Enter your name"
          aria-label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          className="w-full md:w-50 h-10 border border-gray-300 rounded-lg p-2.5"
          type="text"
          placeholder="Enter your address"
          aria-label="Address"
          autoComplete="street-address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
        <input
          className="w-full md:w-50 h-10 border border-gray-300 rounded-lg p-2.5"
          type="tel"
          placeholder="Enter your phone number"
          aria-label="Phone number"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </div>
    </div>
  );
}