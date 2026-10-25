import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/login", {
        email: email,
        password: password,
      });
      //alert("Login Successful")
      toast.success("Login Successful");
      console.log(response.data);
      LocalStorage.setItem("token",response.data.token)
    } catch (e) {
      toast.error(e.response?.data?.message || "Unable to connect to the login service.");
    }
  }

  return (
    <div className="w-full h-screen bg-[url('/login.jpg')] bg-center bg-cover flex justify-evenly items-center">
      <div className="w-[50%] h-full ">
      </div>

      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[500px] h-[600px] backdrop-blur-md rounded-[20px] shadow-xl flex flex-col justify-center items-center">
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[20px]"
          />
          <input
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[20px]"
          />
          <button
            onClick={handleLogin}
            className="w-[300px] cursor-pointer h-[50px] bg-[#c3efe9] rounded-[20px]"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
