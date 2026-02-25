import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Style/index.css'
import App from './Components/App.jsx'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SignUp from './Components/SignUp.jsx';
import Home from "./Components/Home.jsx"
import Login from "./Components/Login.jsx"
import Catalog from "./Components/Catalog.jsx"
import { CartProvider } from './Components/Context/CartContext.jsx';
import Cart from './Components/Cart.jsx';
import About from './Components/About.jsx';
import OrderForm from './Components/OrderForm.jsx';
import AdminLayout from './Components/admin/AdminLayout.jsx';
import AdminDashboard from './Components/admin/AdminDashboard.jsx';
import AdminProducts from './Components/admin/AdminProducts.jsx';
import AdminOrders from './Components/admin/AdminOrders.jsx';
import AdminCustomers from './Components/admin/AdminCustomers.jsx';
import AdminDiscounts from './Components/admin/AdminDiscounts.jsx';
import Vto from './Components/VTO/vto.jsx';
import Trending from './Components/trendingFeature/trending.jsx';
import Dashboard from './Components/User/Dashboard.jsx';
import AuthCallback from './Components/AuthCallback.jsx';
import { Auth0Context, Auth0Provider } from '@auth0/auth0-react';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "signup", element: <SignUp /> },
      { path: "about", element: <About /> },
      { path: "login", element: <Login /> },
      { path: "catalog", element: <Catalog /> },
      { path: "mycart", element: <Cart /> },
      { path: "orderform", element: <OrderForm /> },
      { path: "vto", element: <Vto /> },
      { path: "trending", element: <Trending /> },
      { path: "auth/callback", element: <AuthCallback /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "products", element: <AdminProducts /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "customers", element: <AdminCustomers /> },
      { path: "discounts", element: <AdminDiscounts /> }
    ],
  },
  {
    path: "/userDashboard",
    element: <Dashboard />,
  }
]);
createRoot(document.getElementById('root')).render(
  <Auth0Provider>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>,
  </Auth0Provider>
)