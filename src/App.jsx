import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import AdminPage from "./pages/adminpage";
import TestPage from "./pages/testPage";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/homepage";
import RegisterPage from "./pages/register";
import AddProductPage from "./pages/Admin/addProduct";
import ForgetPasswordPage from "./client/forgetPassword";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId="60928684691-47kpae31691eqpe43runs6kbk7hmsv14.apps.googleusercontent.com">
    <BrowserRouter>
      <div>
        <Toaster position="top-right"/>
        {/* <Header /> */}
        <Routes>
          <Route path="/*" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/test/*" element={<TestPage />} />
          <Route path="/register/*" element={<RegisterPage />} />
          <Route path="/admin-products" element={<AdminPage />} />
          <Route path="/forget" element={<ForgetPasswordPage />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
//https://nprdehrnljcraitludsj.supabase.co/rest/v1/

//