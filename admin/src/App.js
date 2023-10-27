import "./App.css";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import store from "./store/index";
import { Provider } from "react-redux";
import React, { Suspense, lazy } from "react";

// import Layout from "./components/layout/Layout";
// import DashBoard from "./pages/dashboard/DashBoard";
// import Login from "./pages/auth/Login";
// import OrderDetail from "./pages/dashboard/orders/OrderDetail";
// import Products from "./pages/product/Products";
// import Edit from "./pages/product/edit/Edit";
// import Rooms from "./pages/room/Rooms";
// import NotFoundPage from "./pages/notfoundpage/NotFoundPage";

const Layout = lazy(() => import("./components/layout/Layout"));
const DashBoard = lazy(() => import("./pages/dashboard/DashBoard"));
const Login = lazy(() => import("./pages/auth/Login"));
const OrderDetail = lazy(() => import("./pages/dashboard/orders/OrderDetail"));
const Products = lazy(() => import("./pages/product/Products"));
const Edit = lazy(() => import("./pages/product/edit/Edit"));
const Rooms = lazy(() => import("./pages/room/Rooms"));
const NotFoundPage = lazy(() => import("./pages/notfoundpage/NotFoundPage"));

const router = createBrowserRouter([
  {
    path: "/admin",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense>
            <DashBoard />
          </Suspense>
        ),
      },
      {
        path: "orders/:orderID",
        element: (
          <Suspense>
            <OrderDetail />
          </Suspense>
        ),
      },
      {
        path: "products",
        element: (
          <Suspense>
            <Products />
          </Suspense>
        ),
      },
      {
        path: "new-product",
        element: (
          <Suspense>
            <Edit />
          </Suspense>
        ),
      },
      {
        path: "rooms",
        element: (
          <Suspense>
            <Rooms />
          </Suspense>
        ),
      },
      {
        path: "update-product/:productID",
        element: (
          <Suspense>
            <Edit />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/admin/login",
    element: (
      <Suspense>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: <Navigate to="/admin" />,
  },
  {
    path: "*",
    element: (
      <Suspense>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
