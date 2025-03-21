// import EcommerenceProducts from "src/pages/Ecommerence/EcommerenceProducts";
import { Navigate } from "react-router-dom"
import Dashboard from "../pages/Dashboard";

//Pages
import PagesStarter from "../pages/Utility/pages-starter";

// Auth
import Login from "pages/Authentication/login";
import Logout from "pages/Authentication/Logout";
import UserProfile from "pages/Authentication/user-profile";
import ForgotPassword from "pages/Authentication/ForgotPassword";
import SignUp from "pages/Authentication/Register"

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/student-info", component: <Dashboard /> },
  { path: "/student-info/history", component: <Dashboard /> },
  { path: "/pages-starter", component: <PagesStarter /> },
  { path: "/profile", component: <UserProfile /> },
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/logout", component: <Logout /> },
  { path: "/forgot-password", component: <ForgotPassword /> },
  { path: "/register", component: <SignUp /> },
]
export { authProtectedRoutes, publicRoutes };
