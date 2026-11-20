import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import CartPage from "../client/cart";
import CheckoutPage from "../client/checkoutPage";
import ProductOverviewPage from "../client/productOverview";
import ProductPage from "../client/productPage";
import SearchProductPage from "../client/searchProduct";

export default function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <Header />
      <main className="flex w-full flex-1 flex-col items-center px-4 py-6">
        <Routes>
          <Route path="/" element={<h1 className="text-center text-2xl font-bold sm:text-3xl">Home</h1>} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/about" element={<h1 className="text-center text-2xl font-bold sm:text-3xl">About</h1>} />
          <Route path="/contact" element={<h1 className="text-center text-2xl font-bold sm:text-3xl">Contact</h1>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/search" element={<SearchProductPage />} />
          <Route path="/overview/:productId" element={<ProductOverviewPage />} />
          <Route path="*" element={<h1 className="text-center text-2xl font-bold sm:text-3xl">404 Not Found</h1>} />
        </Routes>
      </main>
    </div>
  );
}