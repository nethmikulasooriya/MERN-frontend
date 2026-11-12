import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [popupVisible, setPopupVisible] = useState(false);
  const [clickedOrder, setClickedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("pending");
  const [orderNotes, setOrderNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  async function updateOrderStatus(updatedValue) {
    const orderId =
      clickedOrder?.orderID || clickedOrder?.orderId || clickedOrder?._id;
    const token = localStorage.getItem("token");

    if (!orderId) {
      toast.error("Unable to identify this order");
      return;
    }

    if (!token) {
      toast.error("Please login first");
      return;
    }

    setUpdatingStatus(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/${updatedValue}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrderStatus(updatedValue);
      setClickedOrder((order) => ({ ...order, status: updatedValue }));
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          (order.orderID || order.orderId || order._id) === orderId
            ? { ...order, status: updatedValue }
            : order
        )
      );
      toast.success("Order status updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  }

  useEffect(() => {
    if (loading) {
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/${page}/${limit}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setOrders(res.data.orders || []);
          setTotalPages(res.data.totalPages || 1);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.response?.data?.message || "Failed to load orders");
          setLoading(false);
        });
    }
  }, [loading, page, limit]);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-sm text-slate-600">
              <th className="p-2.5">Order ID</th>
              <th className="p-2.5">Email</th>
              <th className="p-2.5">Name</th>
              <th className="p-2.5">Address</th>
              <th className="p-2.5">Phone</th>
              <th className="p-2.5">Status</th>
              <th className="p-2.5">Date</th>
              <th className="p-2.5 text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && !loading ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={order._id || order.orderID || `order-${index}`}
                  className="cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50 text-sm"
                  onClick={() => {
                    setOrderStatus(order.status || "pending");
                    setOrderNotes(order.notes || "");
                    setClickedOrder(order);
                    setPopupVisible(true);
                  }}
                >
                  <td className="p-2.5 font-medium text-slate-900">{order.orderID}</td>
                  <td className="p-2.5 text-slate-600">{order.email}</td>
                  <td className="p-2.5 text-slate-800">{order.name}</td>
                  <td className="p-2.5 text-slate-600">{order.address}</td>
                  <td className="p-2.5 text-slate-600">{order.phone}</td>
                  <td className="p-2.5">
                    <span
                      className={`capitalize px-2 py-0.5 rounded text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.status || "pending"}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-600">
                    {order.date ? new Date(order.date).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-2.5 text-end font-medium text-slate-900">
                    Rs.{" "}
                    {Number(order.total || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {popupVisible && clickedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPopupVisible(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            {(orderStatus !== (clickedOrder.status || "pending") ||
              orderNotes !== (clickedOrder.notes || "")) && (
              <button
                type="button"
                className="absolute right-16 top-4 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm"
                onClick={async () => {
                  try {
                    await axios.put(
                      `${import.meta.env.VITE_BACKEND_URL}/api/orders/${clickedOrder.orderID}`,
                      {
                        status: orderStatus,
                        notes: orderNotes,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      }
                    );
                    toast.success("Order updated successfully");
                    setPopupVisible(false);
                    setLoading(true);
                  } catch (err) {
                    console.error(err);
                    toast.error(
                      err.response?.data?.message || "Failed to update order"
                    );
                  }
                }}
              >
                Save Changes
              </button>
            )}

            <button
              type="button"
              aria-label="Close order details"
              className="absolute right-4 top-4 rounded-lg px-2.5 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              onClick={() => setPopupVisible(false)}
            >
              ✕
            </button>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Order {clickedOrder.orderID}
            </p>
            <h2
              id="order-modal-title"
              className="mb-5 mt-1 text-2xl font-bold text-slate-900"
            >
              Order details
            </h2>

            <div className="mb-6 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2 text-sm">
              <p>
                <span className="font-semibold text-slate-600">Name:</span>{" "}
                {clickedOrder.name || "—"}
              </p>
              <p>
                <span className="font-semibold text-slate-600">Email:</span>{" "}
                {clickedOrder.email || "—"}
              </p>
              <p>
                <span className="font-semibold text-slate-600">Phone:</span>{" "}
                {clickedOrder.phone || "—"}
              </p>
              <p>
                <span className="font-semibold text-slate-600">Address:</span>{" "}
                {clickedOrder.address || "—"}
              </p>
              <p>
                <span className="font-semibold text-slate-600">Total:</span>{" "}
                Rs.{" "}
                {Number(clickedOrder.total || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p>
                <span className="font-semibold text-slate-600">Date:</span>{" "}
                {clickedOrder.date
                  ? new Date(clickedOrder.date).toLocaleString()
                  : "—"}
              </p>
              <label className="text-sm font-semibold text-slate-700">
                Status
                <select
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2 font-normal"
                  value={orderStatus}
                  disabled={updatingStatus}
                  onChange={(e) => updateOrderStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Notes
                <textarea
                  className="mt-1 block min-h-20 w-full rounded-lg border border-slate-300 p-2.5 font-normal text-sm"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Add a note about this order"
                />
              </label>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-800">
                Items ({clickedOrder.items?.length || 0})
              </h3>
              <div className="max-h-64 space-y-3 overflow-y-auto">
                {(clickedOrder.items || []).map((item, index) => (
                  <div
                    key={item._id || item.productId || `item-${index}`}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 p-3"
                  >
                    <img
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name || "Product"}
                      className="h-16 w-16 rounded-lg border border-slate-200 object-cover bg-slate-100"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-800">
                        {item.name || "Product"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Qty: {item.qty} · Rs.{" "}
                        {Number(item.price || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-slate-800">
                      Rs.{" "}
                      {(
                        Number(item.qty || 0) * Number(item.price || 0)
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
        <label className="flex items-center gap-2">
          Rows per page
          <select
            className="rounded-md border border-slate-300 bg-white px-2 py-1"
            value={limit}
            onChange={(event) => {
              setLimit(Number(event.target.value));
              setPage(1);
              setLoading(true);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </label>
        <div className="flex items-center gap-3">
          <span>
            Page {page} of {totalPages || 1}
          </span>
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50 disabled:opacity-40"
            disabled={page <= 1 || loading}
            onClick={() => {
              setPage((prev) => prev - 1);
              setLoading(true);
            }}
          >
            Previous
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50 disabled:opacity-40"
            disabled={page >= totalPages || loading}
            onClick={() => {
              setPage((prev) => prev + 1);
              setLoading(true);
            }}
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
}