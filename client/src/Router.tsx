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
        <Route path="/singin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
