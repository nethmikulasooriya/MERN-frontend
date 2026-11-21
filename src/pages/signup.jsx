import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignUp(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users`,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
        }
      );

      toast.success("Registration successful.");
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role || "user");
        navigate(response.data.role === "admin" ? "/admin/" : "/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  }

  const inputClassName =
    "w-full rounded-[20px] border border-[#c3efe9] bg-white/90 px-4 py-3 outline-none transition focus:ring-2 focus:ring-[#c3efe9]";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[url('/login.jpg')] bg-cover bg-center px-4 py-8">
      <section className="w-full max-w-lg rounded-[20px] bg-white/20 p-6 shadow-xl backdrop-blur-md sm:p-10">
        <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
          <div className="mb-2 text-center">
            <h1 className="text-3xl font-semibold text-gray-900">
              Create your account
            </h1>
            <p className="mt-2 text-gray-700">
              Sign up to get started.
            </p>
          </div>

          <label className="sr-only" htmlFor="signup-first-name">
            First name
          </label>
          <input
            id="signup-first-name"
            className={inputClassName}
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />

          <label className="sr-only" htmlFor="signup-last-name">
            Last name
          </label>
          <input
            id="signup-last-name"
            className={inputClassName}
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
          />

          <label className="sr-only" htmlFor="signup-email">
            Email
          </label>
          <input
            id="signup-email"
            className={inputClassName}
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label className="sr-only" htmlFor="signup-password">
            Password
          </label>
          <input
            id="signup-password"
            className={inputClassName}
            type={showPasswords ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Password"
     
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <label className="sr-only" htmlFor="signup-confirm-password">
            Confirm password
          </label>
          <input
            id="signup-confirm-password"
            className={inputClassName}
            type={showPasswords ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          <button
            type="button"
            aria-pressed={showPasswords}
            className="self-center text-sm font-medium text-teal-700 hover:text-teal-900 hover:underline"
            onClick={() => setShowPasswords((showing) => !showing)}
          >
            {showPasswords ? "Hide passwords" : "Show passwords"}
          </button>

          <button
            className="mt-2 w-full rounded-[20px] bg-[#c3efe9] px-4 py-3 font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </button>

          <p className="text-center text-sm text-gray-800">
            Already have an account?{" "}
            <Link
              className="font-medium text-teal-700 hover:text-teal-900 hover:underline"
              to="/login"
            >
              Log in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
