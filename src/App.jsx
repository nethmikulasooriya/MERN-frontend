import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import AdminPage from "./pages/adminpage";
import TestPage from "./pages/testPage";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <BrowserRouter>
      <div>
        <Toaster position="top-right"/>
        {/* <Header /> */}
        <Routes path="/*">
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/test/*" element={<TestPage />} />
          <Route path="/*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;