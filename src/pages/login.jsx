import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GrGoogle } from "react-icons/gr";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      setIsGoogleLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/login/google`,
          { accessToken: access_token }
        );

        if (!response.data.token) {
          throw new Error(
            "The login service did not return an authentication token."
          );
        }

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role || "user");
        toast.success("Login Successful");

        const destination =
          location.state?.from ||
          (response.data.role === "admin" ? "/admin/" : "/products");
        navigate(destination, { replace: true });
      } catch (e) {
        toast.error(
          e.response?.data?.message || e.message || "Google login failed."
        );
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Google login was unsuccessful. Please try again.");
    },
  });

  async function handleLogin() {
    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        { email: email.trim(), password }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role || "user");
      toast.success("Login Successful");

      const destination =
        location.state?.from ||
        (response.data.role === "admin" ? "/admin/" : "/products");
      navigate(destination, { replace: true });
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Unable to connect to the login service."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full h-screen bg-[url('/login.jpg')] bg-center bg-cover flex justify-evenly items-center">
      <div className="w-[50%] h-full"></div>

      <div className="w-[50%] h-full flex justify-center items-center">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleLogin();
          }}
          className="w-125 h-150 backdrop-blur-md rounded-[20px] shadow-xl flex flex-col justify-center items-center"
        >
          <input
            type="email"
            placeholder="Email"
            aria-label="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-75 h-12.5 px-4 border border-[#c3efe9] rounded-[20px] my-5 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            aria-label="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="w-75 h-12.5 px-4 border border-[#c3efe9] rounded-[20px] my-5 outline-none"
          />
          <Link
            className="w-75 -mt-3 mb-4 text-center text-sm text-teal-700 hover:text-teal-900 hover:underline"
            to="/forget"
          >
            Forgot password?
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="w-75 cursor-pointer h-12.5 bg-[#c3efe9] rounded-[20px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={isGoogleLoading}
            className="w-75 cursor-pointer h-12.5 flex justify-center items-center bg-[#c3efe9] rounded-[20px] my-5 text-[20px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GrGoogle className="text-xl text-gray-600 cursor-pointer hover:text-gray-800" />
            <span className="ml-2 text-gray-600 text-xl font-semibold">
              {isGoogleLoading ? "Logging in..." : "Login with Google"}
            </span>
          </button>
          <p className="w-75 text-center text-sm text-gray-700">
            Don&apos;t have an account?{" "}
            <Link
              className="font-medium text-teal-700 hover:text-teal-900 hover:underline"
              to="/signup"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}