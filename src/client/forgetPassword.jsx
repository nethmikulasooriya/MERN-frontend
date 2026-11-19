import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const usersApi = `${import.meta.env.VITE_BACKEND_URL}/api/users`;

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  async function sendOTP(event) {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Enter your email address.");
      return;
    }

    setIsSending(true);
    try {
      await axios.post(`${usersApi}/send-otp`, { email: email.trim() });
      setEmailSent(true);
      toast.success("OTP sent. Check your email.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsSending(false);
    }
  }

  async function resetPassword(event) {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter the six-digit OTP from your email.");
      return;
    }

    if (!newPassword) {
      toast.error("Enter a new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsResetting(true);
    try {
      await axios.post(`${usersApi}/reset-password`, {
        email: email.trim(),
        otp,
        newPassword,
      });
      setResetComplete(true);
      toast.success("Password reset successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsResetting(false);
    }
  }

  const inputClassName =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
  const buttonClassName =
    "w-full rounded-xl bg-blue-600 px-4 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[url('/login.jpg')] bg-cover bg-center px-4 py-8">
      <section className="w-full max-w-md rounded-3xl bg-white/95 p-8 shadow-2xl sm:p-10">
        {resetComplete ? (
          <div className="flex flex-col items-center gap-5 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Password reset
            </h1>
            <p className="text-gray-600">
              Your password has been changed successfully.
            </p>
            <Link className={buttonClassName} to="/login">
              Go to login
            </Link>
          </div>
        ) : !emailSent ? (
          <form className="flex flex-col gap-5" onSubmit={sendOTP}>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Reset Password
              </h1>
              <p className="mt-2 text-gray-600">
                Enter your account email and we&apos;ll send you a reset code.
              </p>
            </div>
            <label className="sr-only" htmlFor="reset-email">
              Email address
            </label>
            <input
              id="reset-email"
              className={inputClassName}
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button
              className={buttonClassName}
              type="submit"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send OTP"}
            </button>
            <Link
              className="text-center text-sm text-blue-700 hover:underline"
              to="/login"
            >
              Back to login
            </Link>
          </form>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={resetPassword}>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Verify OTP
              </h1>
              <p className="mt-2 text-gray-600">
                Enter the code sent to {email.trim()} and choose a new password.
              </p>
            </div>
            <label className="sr-only" htmlFor="reset-otp">
              Six-digit OTP
            </label>
            <input
              id="reset-otp"
              className={inputClassName}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              pattern="[0-9]{6}"
              placeholder="Enter your OTP"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              required
            />
            <label className="sr-only" htmlFor="new-password">
              New password
            </label>
            <input
              id="new-password"
              className={inputClassName}
              type="password"
              autoComplete="new-password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
            <label className="sr-only" htmlFor="confirm-password">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              className={inputClassName}
              type="password"
              autoComplete="new-password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            <button
              className={buttonClassName}
              type="submit"
              disabled={isResetting}
            >
              {isResetting ? "Resetting..." : "Verify OTP"}
            </button>
            <button
              className="w-full rounded-xl bg-gray-200 px-4 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={sendOTP}
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Resend OTP"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
