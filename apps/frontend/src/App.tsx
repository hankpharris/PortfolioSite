import { createBrowserRouter, Navigate, RouteObject, RouterProvider } from "react-router-dom";
import Projects from "./routes/Projects";
import { ErrorPage } from "./routes/ErrorPage";
import ExampleProjectOverview from "./routes/ExampleProjectOverview";
import { AboutMe } from "./routes/AboutMe";

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
        path: "/projects/:id",
        element: <ExampleProjectOverview />,
    },
    {
        path: "/about",
        element: <AboutMe />,
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
