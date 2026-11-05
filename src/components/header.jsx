import { Link, useNavigate } from "react-router-dom";
import UserData from "./userData";
import { BiCart } from "react-icons/bi";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full h-20 shadow-2xl flex relative">
      <img
        onClick={() => {
          navigate("/");
        }}
        src="/logo.png"
        alt="Logo"
        className="w-20 h-20 object-cover cursor-pointer"
      />

      <div className="w-[calc(100%-160px)] h-full flex justify-center items-center">
        <Link to="/" className="text-xl font-bold mx-2">
          Home
        </Link>
        <Link to="/products" className="text-xl font-bold mx-2">
          Products
        </Link>
        <Link to="/about" className="text-xl font-bold mx-2">
          About
        </Link>
        <Link to="/contact" className="text-xl font-bold mx-2">
          Contact
        </Link>

        {/* Cart Link */}
        <Link to="/cart" className="absolute right-25 flex items-center">
          <BiCart className="text-3xl ml-4 hover:text-accent cursor-pointer" />
        </Link>
      </div>

      <div className="w-20 h-full bg-blue-600 flex justify-center items-center">
        <UserData />
      </div>
    </header>
  );
}