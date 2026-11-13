import { Link, useNavigate } from "react-router-dom";
import UserData from "./userData";
import { BiCart } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [sideDrawerOpened, setSideDrawerOpened] = useState(false);
  const closeDrawer = () => setSideDrawerOpened(false);

  return (
    <header className="relative z-50 flex h-20 w-full shrink-0 items-center px-2 shadow-2xl md:px-4">
      <button
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={sideDrawerOpened}
        className="mr-2 flex h-10 w-10 items-center justify-center rounded-md md:hidden"
        onClick={() => setSideDrawerOpened(true)}
      >
        <GiHamburgerMenu className="text-2xl" />
      </button>
      <img
        onClick={() => {
          navigate("/");
        }}
        src="/logo.png"
        alt="Logo"
        className="h-16 w-16 cursor-pointer object-cover md:h-20 md:w-20"
      />

      <nav className="hidden h-full flex-1 items-center justify-center md:flex">
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
      </nav>

      <Link
        to="/cart"
        aria-label="View cart"
        className="ml-auto flex h-10 w-10 items-center justify-center md:ml-0"
      >
        <BiCart className="cursor-pointer text-3xl hover:text-accent" />
      </Link>
      <div className="hidden h-full w-20 items-center justify-center bg-blue-600 md:flex">
        <UserData />
      </div>

      {sideDrawerOpened && (
        <div
          className="fixed inset-0 z-[60] flex bg-black/40 md:hidden"
          onClick={closeDrawer}
        >
          <nav
            aria-label="Mobile navigation"
            className="flex h-full w-[min(20rem,85vw)] flex-col gap-2 bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close navigation menu"
              className="mb-4 flex h-10 w-10 items-center justify-center"
              onClick={closeDrawer}
            >
              <GiHamburgerMenu className="text-2xl" />
            </button>
            <Link to="/" onClick={closeDrawer} className="rounded px-3 py-3 text-lg font-bold">
              Home
            </Link>
            <Link to="/products" onClick={closeDrawer} className="rounded px-3 py-3 text-lg font-bold">
              Products
            </Link>
            <Link to="/about" onClick={closeDrawer} className="rounded px-3 py-3 text-lg font-bold">
              About
            </Link>
            <Link to="/contact" onClick={closeDrawer} className="rounded px-3 py-3 text-lg font-bold">
              Contact
            </Link>
            <Link to="/cart" onClick={closeDrawer} className="rounded px-3 py-3 text-lg font-bold">
              Cart
            </Link>
            <div className="mt-4 border-t pt-4">
              <UserData />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}