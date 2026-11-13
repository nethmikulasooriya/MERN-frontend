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
  const fromCart =
    location.state?.fromCart === true || location.pathname === "/cart";

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
      navigate("/login", {
        replace: true,
        state: { from: location },
      });
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
  }, [location, navigate]);

  useEffect(() => {
    if (cart.length === 0) {
      toast.error("Please select items to checkout");
      navigate("/products", { replace: true });
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
    if (!address.trim() || !phone.trim()) {
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
    <main className="min-h-screen px-3 py-6 sm:px-4 sm:py-10">
      <h1 className="sr-only">Checkout</h1>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.8fr)]">
        <section className="flex flex-col gap-4" aria-label="Cart items">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 p-3 shadow-xl sm:flex sm:min-h-25 sm:gap-3"
            >
              <img
                src={item.image || ""}
                alt={item.name || "Product"}
                className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
              />
              <div className="min-w-0 flex-1">
                <span className="block truncate font-bold">
                  {item.name || "Product"}
                </span>
                <span className="font-semibold">
                  {item.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="col-start-1 row-start-2 flex shrink-0 items-center sm:col-auto sm:row-auto">
                <button
                  type="button"
                  aria-label={`Decrease ${item.name || "product"} quantity`}
                  className="h-8 w-8 rounded-lg bg-accent text-white hover:bg-blue-400"
                  onClick={() => updateQuantity(item, -1)}
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  type="button"
                  aria-label={`Increase ${item.name || "product"} quantity`}
                  className="h-8 w-8 rounded-lg bg-accent text-white hover:bg-blue-400"
                  onClick={() => updateQuantity(item, 1)}
                >
                  +
                </button>
              </div>
              <span className="col-start-3 row-start-2 shrink-0 text-right text-sm font-semibold sm:ml-auto sm:block sm:w-28 sm:text-base">
                {(item.quantity * item.price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <button
                type="button"
                aria-label={`Remove ${item.name || "product"}`}
                className="col-start-3 row-start-1 shrink-0 cursor-pointer justify-self-end text-red-700 sm:col-auto sm:row-auto"
                onClick={() => updateQuantity(item, -item.quantity)}
              >
                <TbTrash className="text-xl" />
              </button>
            </div>
          ))}
        </section>

        <aside
          className="w-full"
          aria-label={name ? `Order for ${name}` : "Place order"}
        >
          <p className="mb-4 text-right text-lg font-bold sm:mb-6 sm:text-xl">
            Total:{" "}
            <span className="text-accent">
              {getTotal().toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </p>
          <div className="flex flex-col gap-3 p-3 shadow-xl">
            <input
              className="h-10 w-full rounded-lg border border-gray-300 p-2.5"
              type="tel"
              placeholder="Phone Number"
              aria-label="Phone number"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <input
              className="h-10 w-full rounded-lg border border-gray-300 p-2.5"
              type="text"
              placeholder="Address"
              aria-label="Address"
              autoComplete="street-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
            <button
              type="button"
              onClick={placeOrder}
              disabled={isSubmitting || cart.length === 0}
              className="mx-auto mt-2 h-10 rounded-lg border-2 border-accent bg-accent px-4 font-semibold text-white hover:bg-white hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Placing order..." : "Place Order"}
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}