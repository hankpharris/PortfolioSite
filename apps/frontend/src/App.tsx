import { createBrowserRouter, Navigate, RouteObject, RouterProvider } from "react-router-dom";
import Projects from "./routes/Projects";
import { ErrorPage } from "./routes/ErrorPage";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <Navigate to="/projects" replace />,
    },
    {
        path: "/projects",
        element: <Projects />,
    },
    {
        path: "*",
        element: <ErrorPage />,
    },
];

const router = createBrowserRouter(routes);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
