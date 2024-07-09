import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import "react-loading-skeleton/dist/skeleton.css";

import { SocketProvider } from "./context/SocketContext";
import AppLayout from "./pages/AppLayout/AppLayout";
import Home from "./pages/Home/Home";
import HouseListPage from "./pages/HouseListPage/HouseListPage";
import HousePage from "./pages/HousePage/HousePage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import ProtectedLayout from "./pages/ProtectedLayout/ProtectedLayout";
import ProfileUpdate from "./pages/ProfileUpdate/ProfileUpdate";
import NewPost from "./pages/NewPost/NewPost";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/post/list",
        element: <HouseListPage />,
      },
      {
        path: "/post/:id",
        element: <HousePage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/profile/update",
        element: <ProfileUpdate />,
      },
      {
        path: "/post/new",
        element: <NewPost />,
      },
    ],
  },
]);

function App() {
  return (
    <SocketProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster
          toastOptions={{
            success: {
              duration: 2000,
            },
            error: {
              duration: 3000,
            },
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SocketProvider>
  );
}

export default App;
