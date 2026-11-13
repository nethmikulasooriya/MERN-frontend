import { Route, Routes } from "react-router-dom";
import Header from "../components/header";

export default function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <Header />
      <main className="flex w-full flex-1 flex-col items-center px-4 py-6">
        <Routes>
          <Route path="/" element={<h1 className="text-center text-2xl font-bold sm:text-3xl">Home</h1>} />
          <Route path="/products" element={<h1 className="text-center text-2xl font-bold sm:text-3xl">ProductPage</h1>} />
          <Route path="/about" element={<h1 className="text-center text-2xl font-bold sm:text-3xl">About</h1>} />
          <Route path="/contact" element={<h1 className="text-center text-2xl font-bold sm:text-3xl">Contact</h1>} />
          <Route path="*" element={<h1 className="text-center text-2xl font-bold sm:text-3xl">404 Not Found</h1>} />
        </Routes>
      </main>
    </div>
  );
}