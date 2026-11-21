import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleRegister() {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/users",
        {
          firstName,
          lastName,
          email,
          password,
        }
      );

      toast.success("Registration Successful");
      console.log(response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role || "user");

        if (response.data.role === "admin") {
          navigate("/admin/");
        } else {
          navigate("/");
        }
      } else {
        navigate("/login");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Registration Failed");
    }
  }

  return (
    <div className="w-full h-screen bg-[url('/login.jpg')] bg-center bg-cover flex justify-evenly items-center">
      {/* Left side empty space matching login page */}
      <div className="w-[50%] h-full"></div>

      {/* Right side form card */}
      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-125 min-h-150 py-10 backdrop-blur-md rounded-[20px] shadow-xl flex flex-col justify-center items-center">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-75 h-12.5 px-4 border border-[#c3efe9] rounded-[20px] my-2.5 outline-none"
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-75 h-12.5 px-4 border border-[#c3efe9] rounded-[20px] my-2.5 outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-75 h-12.5 px-4 border border-[#c3efe9] rounded-[20px] my-2.5 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-75 h-12.5 px-4 border border-[#c3efe9] rounded-[20px] my-2.5 outline-none"
          />

          <button
            onClick={handleRegister}
            className="w-75 h-12.5 cursor-pointer bg-[#c3efe9] rounded-[20px] mt-5 font-medium hover:opacity-90 transition-opacity"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}