import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import store from "./store/index";
import { Provider } from "react-redux";
import React, { Suspense, lazy } from "react";

import Layout from "./components/Layout/Layout";
import OrderListPage from "./components/Pages/OrderListPage/OrderListPage";
import OrderPage from "./components/Pages/OrderListPage/OrderPage";
const HomePage = lazy(() => import("./components/Pages/HomePage/HomePage"));
const ShopPage = lazy(() => import("./components/Pages/ShopPage/ShopPage"));
const DetailPage = lazy(() =>
  import("./components/Pages/DetailPage/DetailPage")
);
const CartPage = lazy(() => import("./components/Pages/CartPage/CartPage"));
const CheckoutPage = lazy(() =>
  import("./components/Pages/CheckoutPage/CheckoutPage")
);
const LoginPage = lazy(() => import("./components/Pages/Account/LoginPage"));
const RegisterPage = lazy(() =>
  import("./components/Pages/Account/RegisterPage")
);
const NotFoundPage = lazy(() =>
  import("./components/Pages/HomePage/NotFoundPage/NotFoundPage")
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    id: "home",
    loader: () =>
      import("./components/Pages/HomePage/Trending/Treanding").then((module) =>
        module.loader()
      ),
    children: [
      {
        index: true,
        element: (
          <Suspense>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "shop",
        element: (
          <Suspense>
            <ShopPage />
          </Suspense>
        ),
        loader: ({ request }) =>
          import("./components/Pages/ShopPage/ShopPage").then((module) =>
            module.loader({ request })
          ),
      },
      {
        path: "detail/:productId",
        element: (
          <Suspense>
            <DetailPage />
          </Suspense>
        ),
      },
      {
        path: "cart",
        element: (
          <Suspense>
            <CartPage />
          </Suspense>
        ),
      },
      {
        path: "checkout",
        element: (
          <Suspense>
            <CheckoutPage />
          </Suspense>
        ),
      },
      {
        path: "history",
        element: (
          <Suspense>
            <OrderListPage />
          </Suspense>
        ),
      },
      {
        path: "history/:orderID",
        element: (
          <Suspense>
            <OrderPage />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense>
            <RegisterPage />
          </Suspense>
        ),
      },
    ],
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
