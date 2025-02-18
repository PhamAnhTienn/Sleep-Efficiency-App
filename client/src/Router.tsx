import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/sign-in/SignIn";
import SignUp from "./pages/sign-up/SignUp";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/predict" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
